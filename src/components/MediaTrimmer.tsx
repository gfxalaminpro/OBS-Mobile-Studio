import React, { useState } from 'react';
import { UploadedMediaItem } from '../types/stream';
import { Scissors, RotateCcw, Check, Clock } from 'lucide-react';

interface MediaTrimmerProps {
  media: UploadedMediaItem;
  onApplyTrim: (start: number, end: number) => void;
  onClose: () => void;
}

export const MediaTrimmer: React.FC<MediaTrimmerProps> = ({
  media,
  onApplyTrim,
  onClose,
}) => {
  const duration = media.durationSeconds || 60;
  const [startSec, setStartSec] = useState<number>(media.trimStartSeconds || 0);
  const [endSec, setEndSec] = useState<number>(media.trimEndSeconds || duration);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
  };

  const handleStartChange = (val: number) => {
    const clamped = Math.min(val, endSec - 1);
    setStartSec(Math.max(0, clamped));
  };

  const handleEndChange = (val: number) => {
    const clamped = Math.max(val, startSec + 1);
    setEndSec(Math.min(duration, clamped));
  };

  const handleReset = () => {
    setStartSec(0);
    setEndSec(duration);
  };

  const handleApply = () => {
    onApplyTrim(startSec, endSec);
    onClose();
  };

  const selectedLength = Math.max(0, endSec - startSec);
  const startPercent = (startSec / duration) * 100;
  const endPercent = (endSec / duration) * 100;
  const widthPercent = endPercent - startPercent;

  return (
    <div className="bg-[#0D1117] border border-[#FF2E63]/40 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
      <div className="flex items-center justify-between border-b border-[#21262D] pb-2">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-[#FF2E63]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            মিডিয়া ট্রিমার (Video & Audio Trimmer)
          </h3>
          <span className="text-[11px] text-[#8B949E]">
            · নির্দিষ্ট অংশ কেটে লাইভে প্রচার করুন
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#38EF7D]">
          <Clock className="w-3.5 h-3.5" />
          <span>Cut Duration: {formatTime(selectedLength)}</span>
        </div>
      </div>

      {/* Visual Timeline Scrub Bar */}
      <div className="relative pt-6 pb-2">
        {/* Timeline track */}
        <div className="relative h-8 bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden flex items-center">
          {/* Waveform / Frames dummy bars */}
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-30">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-[#8B949E] rounded-full"
                style={{ height: `${20 + (i % 7) * 10}%` }}
              />
            ))}
          </div>

          {/* Selected Active Trim Segment */}
          <div
            className="absolute top-0 bottom-0 bg-[#FF2E63]/30 border-x-2 border-[#FF2E63] z-10 transition-all"
            style={{
              left: `${startPercent}%`,
              width: `${widthPercent}%`,
            }}
          />
        </div>

        {/* Start & End Marker Flags */}
        <div
          className="absolute top-0 text-[10px] font-mono text-white bg-[#FF2E63] px-1.5 py-0.5 rounded -translate-x-1/2 z-20"
          style={{ left: `${startPercent}%` }}
        >
          {formatTime(startSec)}
        </div>
        <div
          className="absolute top-0 text-[10px] font-mono text-white bg-[#FF2E63] px-1.5 py-0.5 rounded -translate-x-1/2 z-20"
          style={{ left: `${endPercent}%` }}
        >
          {formatTime(endSec)}
        </div>
      </div>

      {/* Slider Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[#8B949E]">
            <span>Start Marker (শুরু)</span>
            <span className="font-mono text-white">{formatTime(startSec)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.5}
            value={startSec}
            onChange={(e) => handleStartChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[#8B949E]">
            <span>End Marker (শেষ)</span>
            <span className="font-mono text-white">{formatTime(endSec)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.5}
            value={endSec}
            onChange={(e) => handleEndChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-[#21262D]">
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Whole Video</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white text-xs rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-1.5 bg-[#238636] hover:bg-[#2EA043] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Trim to Live Stage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
