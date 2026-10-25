import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';

interface VoiceOverMixerProps {
  isMicActive: boolean;
  setIsMicActive: (active: boolean) => void;
  micVolume: number; // 0 to 2
  setMicVolume: (vol: number) => void;
  mediaVolume: number; // 0 to 1
  setMediaVolume: (vol: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onAudioStreamChange?: (stream: MediaStream | null) => void;
}

export const VoiceOverMixer: React.FC<VoiceOverMixerProps> = ({
  isMicActive,
  setIsMicActive,
  micVolume,
  setMicVolume,
  mediaVolume,
  setMediaVolume,
  isMuted,
  setIsMuted,
  onAudioStreamChange,
}) => {
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isMicActive) {
      startMicrophone();
    } else {
      stopMicrophone();
    }

    return () => {
      stopMicrophone();
    };
  }, [isMicActive]);

  const startMicrophone = async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      micStreamRef.current = stream;
      if (onAudioStreamChange) onAudioStreamChange(stream);

      // Setup Web Audio Analyser
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(isMuted ? 0 : Math.min(100, (avg / 128) * 100 * micVolume));
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Microphone access denied';
      setMicError(errorMsg);
      setIsMicActive(false);
    }
  };

  const stopMicrophone = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
    if (onAudioStreamChange) onAudioStreamChange(null);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col gap-3">
      {/* Header with Mic Enable Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg border ${
              isMicActive
                ? 'bg-[#00D2FF]/20 border-[#00D2FF]/60 text-[#00F2FE]'
                : 'bg-[#21262D] border-[#30363D] text-[#8B949E]'
            }`}
          >
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>লাইভ ভয়েস ওভার (Live Voice-Over)</span>
              {isMicActive && (
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              )}
            </div>
            <div className="text-[11px] text-[#8B949E]">
              যেকোনো ভিডিও বা ছবির উপর সরাসরি নিজের কণ্ঠ লাইভ দিন
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => setIsMicActive(!isMicActive)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            isMicActive
              ? 'bg-[#238636] hover:bg-[#2EA043] text-white shadow-sm'
              : 'bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9]'
          }`}
        >
          {isMicActive ? (
            <>
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Mic Active</span>
            </>
          ) : (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Turn On Mic</span>
            </>
          )}
        </button>
      </div>

      {micError && (
        <div className="text-[11px] text-rose-400 bg-rose-950/30 border border-rose-800/40 rounded px-2.5 py-1">
          {micError}. Please allow microphone permissions in your browser.
        </div>
      )}

      {/* Real-time Audio Visualizer VU Meter */}
      <div className="bg-[#0D1117] border border-[#21262D] rounded-lg p-2.5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          disabled={!isMicActive}
          className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
            isMuted || !isMicActive
              ? 'bg-rose-950/40 text-rose-400 border border-rose-800/50'
              : 'bg-[#21262D] text-[#38EF7D] hover:text-white'
          }`}
          title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {isMuted || !isMicActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* LED Bars Visualizer */}
        <div className="flex-1 flex items-center gap-1 h-3.5 bg-[#161B22] rounded px-1.5">
          {Array.from({ length: 24 }).map((_, idx) => {
            const stepThreshold = (idx / 24) * 100;
            const isLit = isMicActive && !isMuted && audioLevel > stepThreshold;
            let barColor = 'bg-[#38EF7D]'; // green
            if (idx > 16) barColor = 'bg-[#FFA500]'; // amber
            if (idx > 20) barColor = 'bg-[#FF2E63]'; // red peak

            return (
              <div
                key={idx}
                className={`flex-1 h-2 rounded-xs transition-opacity duration-75 ${
                  isLit ? `${barColor} opacity-100` : 'bg-[#21262D] opacity-40'
                }`}
              />
            );
          })}
        </div>

        <span className="text-[10px] font-mono text-[#8B949E] shrink-0 w-9 text-right">
          {isMicActive && !isMuted ? `${Math.round(audioLevel)}%` : 'OFF'}
        </span>
      </div>

      {/* Dual Volume Sliders: Mic Volume & Media Ducking Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        {/* Mic Volume */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[#8B949E]">
            <span>Microphone Gain</span>
            <span className="font-mono text-white">{Math.round(micVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={2.0}
            step={0.05}
            value={micVolume}
            disabled={!isMicActive}
            onChange={(e) => setMicVolume(parseFloat(e.target.value))}
            className="w-full cursor-pointer disabled:opacity-40"
          />
        </div>

        {/* Media Background Volume */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[#8B949E]">
            <span>Media / Music Level</span>
            <span className="font-mono text-white">{Math.round(mediaVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1.0}
            step={0.05}
            value={mediaVolume}
            onChange={(e) => setMediaVolume(parseFloat(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
