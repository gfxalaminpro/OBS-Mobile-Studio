import React, { useState } from 'react';
import { StreamMetrics, StreamComment } from '../types/stream';
import { 
  Users, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Activity, 
  TrendingUp, 
  Send, 
  Wifi, 
  Clock, 
  Sparkles,
  BarChart3
} from 'lucide-react';

interface LiveAnalyticsDashboardProps {
  metrics: StreamMetrics;
  comments: StreamComment[];
  onAddComment: (text: string) => void;
  onSendLike: () => void;
  onShare: () => void;
  selectedPlatform: string;
}

export const LiveAnalyticsDashboard: React.FC<LiveAnalyticsDashboardProps> = ({
  metrics,
  comments,
  onAddComment,
  onSendLike,
  onShare,
  selectedPlatform,
}) => {
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onAddComment(chatInput.trim());
    setChatInput('');
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDuration = (totalSec: number): string => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 4 Main KPI Cards in a clean, high-density row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Concurrent Viewers */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#8B949E]">
            <span className="font-semibold uppercase tracking-wider">Live Viewers</span>
            <Users className="w-4 h-4 text-[#00F2FE]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-white flex items-baseline gap-2">
              <span>{formatNumber(metrics.currentViewers)}</span>
              {metrics.isLive && (
                <span className="text-xs text-[#38EF7D] font-sans font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +8.4%
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#8B949E] mt-0.5">
              এখন সরাসরি দেখছেন
            </div>
          </div>
        </div>

        {/* Total Views / Peak */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#8B949E]">
            <span className="font-semibold uppercase tracking-wider">Total Views / Peak</span>
            <Eye className="w-4 h-4 text-[#A78BFA]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {formatNumber(metrics.totalViews)}
            </div>
            <div className="text-[11px] text-[#8B949E] mt-0.5">
              Peak: <span className="text-[#F0F6FC] font-mono">{formatNumber(metrics.peakViewers)}</span> viewers
            </div>
          </div>
        </div>

        {/* Likes Count with quick Send Reaction trigger */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#8B949E]">
            <span className="font-semibold uppercase tracking-wider">Total Likes</span>
            <button
              type="button"
              onClick={onSendLike}
              className="p-1 rounded bg-[#FF2E63]/20 hover:bg-[#FF2E63]/40 text-[#FF2E63] cursor-pointer transition-colors"
              title="Click to send heart reaction to stream"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-white flex items-baseline gap-2">
              <span>{formatNumber(metrics.likes)}</span>
            </div>
            <div className="text-[11px] text-[#8B949E] mt-0.5 flex items-center justify-between">
              <span>লাইক সংখ্যা</span>
              <button
                type="button"
                onClick={onSendLike}
                className="text-[11px] text-[#FF2E63] hover:underline cursor-pointer"
              >
                + Send Like
              </button>
            </div>
          </div>
        </div>

        {/* Shares Count */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#8B949E]">
            <span className="font-semibold uppercase tracking-wider">Shares & Broadcast</span>
            <button
              type="button"
              onClick={onShare}
              className="p-1 rounded bg-[#38EF7D]/20 hover:bg-[#38EF7D]/40 text-[#38EF7D] cursor-pointer transition-colors"
              title="Share stream link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {formatNumber(metrics.shares)}
            </div>
            <div className="text-[11px] text-[#8B949E] mt-0.5 flex items-center justify-between">
              <span>শেয়ার সংখ্যা</span>
              <button
                type="button"
                onClick={onShare}
                className="text-[11px] text-[#38EF7D] hover:underline cursor-pointer"
              >
                + Boost Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live Chat & Comments Feed + Stream Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Audience Chat & Comments (2 Cols) */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col h-[420px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#21262D]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#58A6FF]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Audience Chat & Comments ({metrics.commentsCount})
              </h3>
            </div>
            <span className="text-[11px] text-[#8B949E]">
              Destination: <span className="text-white capitalize">{selectedPlatform}</span>
            </span>
          </div>

          {/* Messages scroll list */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0D1117] border border-[#21262D]/60 hover:border-[#30363D] transition-colors text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#21262D] border border-[#30363D] flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                  {comment.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white truncate max-w-[140px]">
                      {comment.user}
                    </span>
                    {comment.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#58A6FF]/20 text-[#58A6FF]">
                        {comment.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-[#8B949E] font-mono ml-auto">
                      {comment.time}
                    </span>
                  </div>
                  <p className="text-[#C9D1D9] text-[11px] mt-0.5 break-words">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Host Chat Input Form */}
          <form onSubmit={handleSendChat} className="pt-3 border-t border-[#21262D] flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Reply to live viewers as Host (হোস্ট হিসেবে কমেন্ট করুন)..."
              className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-[#58A6FF]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#238636] hover:bg-[#2EA043] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Real-time Broadcast Health & Telemetry (1 Col) */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col justify-between h-[420px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#21262D]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#38EF7D]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Broadcast Health
                </h3>
              </div>
              <span className="text-[11px] text-[#38EF7D] font-mono font-semibold">
                {metrics.networkQuality.toUpperCase()}
              </span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#8B949E]">Current Bitrate:</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {metrics.bitrateKbps} kbps / {metrics.targetBitrateKbps} kbps
                </span>
              </div>
              {/* Bitrate visual bar */}
              <div className="w-full h-2 bg-[#0D1117] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#38EF7D] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (metrics.bitrateKbps / metrics.targetBitrateKbps) * 100)}%`,
                  }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8B949E]">Encoding Framerate:</span>
                <span className="font-mono font-bold text-[#00D2FF] tabular-nums">
                  {metrics.fps.toFixed(1)} FPS
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8B949E]">Dropped Frames:</span>
                <span className={`font-mono tabular-nums ${metrics.droppedFrames === 0 ? 'text-[#38EF7D]' : 'text-rose-400'}`}>
                  {metrics.droppedFrames} frames (0.0%)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8B949E]">Connection Jitter:</span>
                <span className="font-mono text-white tabular-nums">
                  {metrics.jitterMs} ms
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8B949E]">Session Duration:</span>
                <span className="font-mono text-[#F0F6FC]">
                  {formatDuration(metrics.liveDurationSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Multi-platform distribution */}
          <div className="pt-3 border-t border-[#21262D]">
            <div className="text-[11px] font-semibold text-[#8B949E] mb-2 flex items-center justify-between">
              <span>Audience Platform Breakdown</span>
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-[#C9D1D9]">
                <span>Dailymotion & Restream</span>
                <span className="font-mono font-bold text-white">58%</span>
              </div>
              <div className="flex justify-between text-[#C9D1D9]">
                <span>YouTube & Facebook</span>
                <span className="font-mono font-bold text-white">32%</span>
              </div>
              <div className="flex justify-between text-[#C9D1D9]">
                <span>Twitch & Custom Ingest</span>
                <span className="font-mono font-bold text-white">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
