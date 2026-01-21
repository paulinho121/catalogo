import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { azureService } from "./azureService";

// Helper functions for audio processing
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export class GeminiService {
  private ai: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    if (apiKey) {
      this.ai = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn("Gemini API Key não configurada. Algumas funcionalidades de IA estarão desativadas.");
    }
  }

  async sendTextMessage(message: string, history: any[] = []) {
    if (!this.ai) return "Sistema de IA não configurado.";

    try {
      // 1. Fetch real product data for context (RAG)
      const products = await azureService.listProducts();
      const knowledgeContext = products.map(p => `
---
PRODUTO: ${p.name}
SKU: ${p.sku}
CATEGORIA: ${p.category}
ESPECIFICAÇÕES E CONTEXTO TÉCNICO:
${p.ragContext || p.description}
---`).join('\n');

      // 2. Configure model with context
      const model = this.ai.getGenerativeModel({
        model: 'gemini-1.5-pro',
        systemInstruction: `${SYSTEM_INSTRUCTION}\n\nBASE DE CONHECIMENTO TÉCNICA ATUAL:\n${knowledgeContext || 'Nenhum produto cadastrado ainda.'}`
      });

      // 3. Start chat session
      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "Desculpe, tive um problema ao processar sua consulta técnica. Verifique minha conexão.";
    }
  }

  // Implementação da Multimodal Live API via WebSocket
  async connectLiveAudio(callbacks: {
    onAudioOutput: (data: string) => void;
    onInterruption: () => void;
    onTranscription?: (text: string, isUser: boolean) => void;
    onError: (e: any) => void;
  }): Promise<any> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BiDiGenerateContent?key=${apiKey}`;

    const ws = new WebSocket(URL);

    // 1. Buscar dados reais para o contexto RAG na voz
    const products = await azureService.listProducts();
    const knowledgeContext = products.map(p => `
---
PRODUTO: ${p.name} (SKU: ${p.sku})
CONTEXTO: ${p.ragContext || p.description}
---`).join('\n');

    // Personalidade Humana e Português nativo conforme solicitado
    const setupPacket = {
      setup: {
        model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
        generation_config: {
          response_modalities: ["audio"],
          speech_config: {
            voice_config: {
              prebuilt_voice_config: {
                voice_name: "Zephyr"
              }
            }
          }
        },
        // Habilita transcrição para o chat visual
        input_audio_transcription: {
          model: "models/gemini-2.5-flash-native-audio-preview-12-2025"
        },
        system_instruction: {
          parts: [{
            text: `${SYSTEM_INSTRUCTION}
                   
                   MODO VOZ: Você é um engenheiro de suporte presencial.
                   Sua voz e jeito de falar são extremamente humanos, naturais e calmos em Português do Brasil.
                   Evite jargões robóticos. Se comporte como um colega de trabalho experiente ajudando no campo.
                   
                   CONHECIMENTO TÉCNICO DISPONÍVEL:
                   ${knowledgeContext || 'Sem produtos no catálogo ainda.'}`
          }]
        }
      }
    };

    return new Promise((resolve, reject) => {
      ws.onopen = () => {
        console.log("Live API: Connected");
        ws.send(JSON.stringify(setupPacket));
      };

      ws.onmessage = async (event) => {
        const response = JSON.parse(event.data);

        // Áudio do modelo
        if (response.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
          callbacks.onAudioOutput(response.serverContent.modelTurn.parts[0].inlineData.data);
        }

        // Interrupção (Barge-in)
        if (response.serverContent?.interrupted) {
          callbacks.onInterruption();
        }

        // Transcrição do Modelo (IA)
        if (response.serverContent?.modelTurn?.parts?.[0]?.text && callbacks.onTranscription) {
          callbacks.onTranscription(response.serverContent.modelTurn.parts[0].text, false);
        }

        // Transcrição do Usuário (Você)
        const inputTransc = response.serverContent?.input_audio_transcription;
        if (inputTransc?.text && callbacks.onTranscription) {
          callbacks.onTranscription(inputTransc.text, true);
        }

        // Finalização do Setup
        if (response.setupComplete) {
          console.log("Live API: Setup Complete");
          resolve({
            sendRealtimeInput: (data: any) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  realtime_input: {
                    media_chunks: [{
                      data: data.media.data,
                      mime_type: data.media.mimeType
                    }]
                  }
                }));
              }
            },
            close: () => ws.close()
          });
        }
      };

      ws.onerror = (e) => {
        callbacks.onError(e);
        reject(e);
      };

      ws.onclose = () => console.log("Live API: Session Closed");
    });
  }
}

export const geminiService = new GeminiService();
