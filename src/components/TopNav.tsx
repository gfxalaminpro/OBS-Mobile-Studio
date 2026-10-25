import React from 'react';
import { Radio, Square, Play, CircleDot } from 'lucide-react';

interface TopNavProps {
  activeTab: 'studio' | 'analytics' | 'formats' | 'android';
  setActiveTab: (tab: 'studio' | 'analytics' | 'formats' | 'android') => void;
  isLive: boolean;
  isRecording: boolean;
  onToggleLive: () => void;
  platformName: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  isLive,
  isRecording,
  onToggleLive,
  platformName,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0D1117] border-b border-[#21262D]">
      {/* Zone 1: Brand wordmark (single text element) */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#studio" 
          onClick={(e) => { e.preventDefault(); setActiveTab('studio'); }}
          className="text-lg font-bold tracking-tight text-white flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E63] shrink-0" />
          <span>MobileStudio Pro</span>
        </a>
        <span className="hidden sm:inline-block text-xs text-[#8B949E] border-l border-[#30363D] pl-3">
          {platformName}
        </span>
      </div>

      {/* Zone 2: 4 single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#8B949E]">
        <button
          onClick={() => setActiveTab('studio')}
          className={`transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'studio' ? 'text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Live Studio
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics' ? 'text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Audience Analytics
        </button>
        <button
          onClick={() => setActiveTab('formats')}
          className={`transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'formats' ? 'text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Supported Formats
        </button>
        <button
          onClick={() => setActiveTab('android')}
          className={`transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'android' ? 'text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Android Companion
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {isRecording && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-[#FF5C35] bg-[#FF5C35]/10 border border-[#FF5C35]/30 rounded">
            <CircleDot className="w-3.5 h-3.5 animate-pulse" />
            <span>REC MP4</span>
          </div>
        )}
        <button
          onClick={onToggleLive}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
            isLive
              ? 'bg-[#E02456] text-white hover:bg-[#C21946]'
              : 'bg-[#FF2E63] text-white hover:bg-[#FF4575]'
          }`}
        >
          {isLive ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>End Broadcast</span>
            </>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5" />
              <span>Go Live</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
