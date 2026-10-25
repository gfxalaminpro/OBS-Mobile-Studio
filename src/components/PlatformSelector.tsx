import React, { useState } from 'react';
import { STREAMING_PLATFORMS } from '../data/platforms';
import { StreamingPlatformId } from '../types/stream';
import { Eye, EyeOff, Copy, Check, ExternalLink, Settings2, Plus, Bookmark } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatform: StreamingPlatformId;
  onSelectPlatform: (id: StreamingPlatformId) => void;
  streamUrl: string;
  setStreamUrl: (url: string) => void;
  streamKey: string;
  setStreamKey: (key: string) => void;
}

interface CustomPreset {
  id: string;
  title: string;
  serverUrl: string;
  streamKey: string;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onSelectPlatform,
  streamUrl,
  setStreamUrl,
  streamKey,
  setStreamKey,
}) => {
  const [showKey, setShowKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([
    {
      id: 'nginx-1',
      title: 'Local Nginx-RTMP Node',
      serverUrl: 'rtmp://192.168.1.100:1935/live',
      streamKey: 'studiodemo123',
    },
    {
      id: 'srs-cloud',
      title: 'SRS Cloud Low-Latency',
      serverUrl: 'rtmp://live.example-cloud.net/app',
      streamKey: 'secret_feed_token',
    },
  ]);
  const [isAddingPreset, setIsAddingPreset] = useState(false);
  const [newPresetTitle, setNewPresetTitle] = useState('');

  const currentPlatform = STREAMING_PLATFORMS.find((p) => p.id === selectedPlatform) || STREAMING_PLATFORMS[0];

  const handlePlatformChange = (id: StreamingPlatformId) => {
    onSelectPlatform(id);
    const target = STREAMING_PLATFORMS.find((p) => p.id === id);
    if (target) {
      setStreamUrl(target.defaultRtmpUrl);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(streamUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSaveCurrentAsPreset = () => {
    if (!newPresetTitle.trim()) return;
    const newPreset: CustomPreset = {
      id: `preset-${Date.now()}`,
      title: newPresetTitle.trim(),
      serverUrl: streamUrl,
      streamKey: streamKey,
    };
    setCustomPresets([...customPresets, newPreset]);
    setNewPresetTitle('');
    setIsAddingPreset(false);
  };

  const handleLoadPreset = (preset: CustomPreset) => {
    onSelectPlatform('custom');
    setStreamUrl(preset.serverUrl);
    setStreamKey(preset.streamKey);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col gap-4">
      {/* Platform Tabs Header */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold tracking-wider uppercase text-[#8B949E]">
            Broadcast Destination & RTMP Presets
          </label>
          <span className="text-[11px] font-mono text-[#8B949E]">
            {STREAMING_PLATFORMS.length} Targets
          </span>
        </div>

        {/* Platform Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STREAMING_PLATFORMS.map((platform) => {
            const isSelected = platform.id === selectedPlatform;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => handlePlatformChange(platform.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                  isSelected
                    ? `${platform.badgeBg} font-semibold shadow-sm ring-1 ring-white/10`
                    : 'bg-[#0D1117] border-[#21262D] text-[#C9D1D9] hover:border-[#30363D] hover:bg-[#21262D]/50'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: platform.brandColor }}
                />
                <span className="truncate">{platform.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Platform Guide Banner */}
      <div className="p-3 bg-[#0D1117] border border-[#21262D] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: currentPlatform.brandColor }}
          />
          <span className="text-[#F0F6FC] font-medium">{currentPlatform.name} Target</span>
          <span className="text-[#8B949E] hidden lg:inline">· {currentPlatform.guideText}</span>
        </div>
        <a
          href={currentPlatform.docsUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[#58A6FF] hover:underline flex items-center gap-1 text-[11px] shrink-0"
        >
          <span>Stream Setup Guide</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Stream URL & Stream Key Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Stream URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#8B949E] flex items-center justify-between">
            <span>RTMP Ingest Server URL</span>
            <button
              onClick={handleCopyUrl}
              className="text-[#58A6FF] hover:text-[#79C0FF] text-[11px] flex items-center gap-1 cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
            </button>
          </label>
          <input
            type="text"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            placeholder="rtmp://server-address/live"
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs font-mono text-[#F0F6FC] focus:outline-none focus:border-[#58A6FF]"
          />
        </div>

        {/* Stream Key */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#8B949E] flex items-center justify-between">
            <span>Stream Key / Access Secret</span>
            <span className="text-[11px] font-mono text-[#484F58]">{currentPlatform.keyHint}</span>
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={streamKey}
              onChange={(e) => setStreamKey(e.target.value)}
              placeholder={currentPlatform.streamKeyPlaceholder}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-3 pr-10 py-2 text-xs font-mono text-[#F0F6FC] focus:outline-none focus:border-[#58A6FF]"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B949E] hover:text-white cursor-pointer"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Custom RTMP Presets Quick Bar */}
      <div className="pt-2 border-t border-[#21262D]">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-[#8B949E]">
            <Bookmark className="w-3.5 h-3.5" />
            <span className="font-medium">Saved Custom RTMP Presets</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingPreset(!isAddingPreset)}
            className="text-[11px] text-[#58A6FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>{isAddingPreset ? 'Cancel' : 'Save Current Settings'}</span>
          </button>
        </div>

        {/* Save Preset Form */}
        {isAddingPreset && (
          <div className="mb-2.5 p-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg flex items-center gap-2">
            <input
              type="text"
              value={newPresetTitle}
              onChange={(e) => setNewPresetTitle(e.target.value)}
              placeholder="e.g. My Private Dailymotion or LAN Stream"
              className="flex-1 bg-[#161B22] border border-[#21262D] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#58A6FF]"
            />
            <button
              type="button"
              onClick={handleSaveCurrentAsPreset}
              className="px-3 py-1 bg-[#238636] hover:bg-[#2EA043] text-white text-xs font-medium rounded cursor-pointer"
            >
              Save Preset
            </button>
          </div>
        )}

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {customPresets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleLoadPreset(p)}
              className="px-2.5 py-1 rounded bg-[#0D1117] border border-[#21262D] hover:border-[#58A6FF] text-[#C9D1D9] hover:text-white text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings2 className="w-3 h-3 text-[#A78BFA]" />
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
