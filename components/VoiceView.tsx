
import React, { useState, useEffect, useRef } from 'react';
import { geminiService, encode, decode, decodeAudioData } from '../services/geminiService';

export const VoiceView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<{ text: string, isUser: boolean }[]>([]);
  const [volume, setVolume] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startVoiceSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = geminiService.connectLiveAudio({
        onAudioOutput: async (base64) => {
          setIsThinking(false);
          if (!audioContextRef.current) return;
          const ctx = audioContextRef.current;
          nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
          const buffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.addEventListener('ended', () => sourcesRef.current.delete(source));
          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += buffer.duration;
          sourcesRef.current.add(source);
        },
        onInterruption: () => {
          sourcesRef.current.forEach(s => s.stop());
          sourcesRef.current.clear();
          nextStartTimeRef.current = 0;
        },
        onTranscription: (text, isUser) => {
          if (isUser) setIsThinking(true);
          setTranscription(prev => [...prev.slice(-4), { text, isUser }]);
        },
        onError: (e) => {
          console.error("Voice Error:", e);
          setIsActive(false);
        }
      });

      sessionRef.current = await sessionPromise;
      
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        setVolume(Math.sqrt(sum / inputData.length));

        const int16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          int16[i] = inputData[i] * 32768;
        }
        
        if (sessionRef.current) {
          sessionRef.current.sendRealtimeInput({
            media: {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000'
            }
          });
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);
      setIsActive(true);
    } catch (err) {
      console.error("Failed to start voice:", err);
    }
  };

  const stopVoiceSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setIsThinking(false);
    setVolume(0);
  };

  useEffect(() => {
    return () => stopVoiceSession();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] max-w-2xl mx-auto p-8">
      <div className="text-center mb-16 animate-fadeIn">
        <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter">Consultoria por <span className="text-blue-600">Voz</span></h2>
        <p className="text-slate-500 text-lg max-w-sm mx-auto font-medium">Fale com sua base técnica enquanto trabalha. Totalmente mãos-livres.</p>
      </div>

      <div className="relative flex items-center justify-center mb-24">
        {/* Advanced Pulse UI */}
        <div className={`absolute w-80 h-80 rounded-full transition-all duration-700 ${isActive ? 'bg-blue-50/50 scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
        <div className={`absolute w-64 h-64 rounded-full transition-all duration-500 delay-100 ${isActive ? 'bg-blue-100/30 scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
        
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none">
            {[...Array(24)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1.5 bg-blue-500 rounded-full transition-all duration-150"
                style={{ 
                  height: isActive ? `${10 + volume * 250 + Math.random() * 20}px` : '4px',
                  transform: `rotate(${i * 15}deg) translateY(100px)`,
                  opacity: 0.6 + volume
                }}
              />
            ))}
          </div>
        )}

        <button 
          onClick={isActive ? stopVoiceSession : startVoiceSession}
          className={`relative z-10 w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl group ${
            isActive 
              ? 'bg-white text-red-500 shadow-red-200 border-4 border-red-50 hover:scale-95' 
              : 'bg-blue-600 text-white shadow-blue-200 hover:scale-110 active:scale-95'
          }`}
        >
          {isActive ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Encerrar</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Iniciar</span>
            </>
          )}
        </button>

        {isThinking && (
          <div className="absolute -bottom-12 flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg animate-bounce">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-100"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-200"></span>
            </span>
            IA Analisando...
          </div>
        )}
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm min-h-[140px] flex flex-col justify-end overflow-hidden">
        <div className="space-y-3">
          {transcription.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-300 text-xs font-medium italic">As transcrições da conversa aparecerão aqui em tempo real.</p>
            </div>
          ) : (
            transcription.map((t, i) => (
              <div key={i} className={`flex ${t.isUser ? 'justify-end' : 'justify-start'} animate-slideInRight`}>
                <p className={`text-xs px-4 py-2 rounded-2xl ${
                  t.isUser 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-700 rounded-tl-none font-medium'
                }`}>
                  {t.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
