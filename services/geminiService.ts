
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

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
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn("Gemini API Key não configurada. Algumas funcionalidades de IA estarão desativadas.");
    }
  }

  async sendTextMessage(message: string, history: any[] = []) {
    const chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  }

  async connectLiveAudio(callbacks: {
    onAudioOutput: (data: string) => void;
    onInterruption: () => void;
    onTranscription?: (text: string, isUser: boolean) => void;
    onError: (e: any) => void;
  }) {
    return this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => console.log('Live Session Opened'),
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
            callbacks.onAudioOutput(message.serverContent.modelTurn.parts[0].inlineData.data);
          }
          if (message.serverContent?.interrupted) {
            callbacks.onInterruption();
          }
          if (message.serverContent?.outputTranscription && callbacks.onTranscription) {
            callbacks.onTranscription(message.serverContent.outputTranscription.text, false);
          }
          if (message.serverContent?.inputTranscription && callbacks.onTranscription) {
            callbacks.onTranscription(message.serverContent.inputTranscription.text, true);
          }
        },
        onerror: callbacks.onError,
        onclose: () => console.log('Live Session Closed'),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: SYSTEM_INSTRUCTION,
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
    });
  }
}

export const geminiService = new GeminiService();
