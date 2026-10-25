import React, { useState, useEffect, useRef } from 'react';
import { TopNav } from './components/TopNav';
import { PlatformSelector } from './components/PlatformSelector';
import { MediaUploader } from './components/MediaUploader';
import { MediaTrimmer } from './components/MediaTrimmer';
import { StudioCanvas, StudioCanvasHandle } from './components/StudioCanvas';
import { VoiceOverMixer } from './components/VoiceOverMixer';
import { LiveAnalyticsDashboard } from './components/LiveAnalyticsDashboard';
import { SupportedFormatsModal } from './components/SupportedFormatsModal';
import { AndroidCompanionView } from './components/AndroidCompanionModal';
import { STREAMING_PLATFORMS } from './data/platforms';
import { 
  StreamingPlatformId, 
  UploadedMediaItem, 
  StreamMetrics, 
  StreamComment 
} from './types/stream';
import { 
  Radio, 
  Square, 
  Disc, 
  Download, 
  FolderCheck, 
  Share2, 
  Layers, 
  Sliders, 
  AlertCircle,
  HelpCircle,
  Smartphone
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'analytics' | 'formats' | 'android'>('studio');
  const [selectedPlatform, setSelectedPlatform] = useState<StreamingPlatformId>('dailymotion');
  const [streamUrl, setStreamUrl] = useState<string>('rtmp://publish.dailymotion.com/live');
  const [streamKey, setStreamKey] = useState<string>('');

  // Media Source State
  const [media, setMedia] = useState<UploadedMediaItem | null>({
    id: 'default-demo',
    name: 'BigBuckBunny_Trailer_720p.mp4',
    folderPath: '/storage/emulated/0/Movies/Broadcasting/BigBuckBunny_Trailer_720p.mp4',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    durationSeconds: 596,
    sizeBytes: 158 * 1024 * 1024,
    sizeFormatted: '158 MB',
    trimStartSeconds: 0,
    trimEndSeconds: 596,
  });

  const [isTrimmerOpen, setIsTrimmerOpen] = useState<boolean>(false);
  const [isFormatsModalOpen, setIsFormatsModalOpen] = useState<boolean>(false);

  // Live Broadcast State
  const [isLive, setIsLive] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');

  // Local Record State (MP4 simultaneous saving)
  const [isLocalRecordActive, setIsLocalRecordActive] = useState<boolean>(true);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [showRecordingSavedNotice, setShowRecordingSavedNotice] = useState<boolean>(false);

  // Live Voice-over (Microphone) State
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [micVolume, setMicVolume] = useState<number>(1.0);
  const [mediaVolume, setMediaVolume] = useState<number>(0.85);

  // Stream Metrics & Analytics
  const [metrics, setMetrics] = useState<StreamMetrics>({
    isLive: false,
    liveDurationSeconds: 0,
    currentViewers: 1240,
    peakViewers: 1580,
    totalViews: 4320,
    likes: 890,
    commentsCount: 142,
    shares: 68,
    bitrateKbps: 3200,
    targetBitrateKbps: 3500,
    fps: 60.0,
    droppedFrames: 0,
    jitterMs: 3,
    networkQuality: 'excellent',
  });

  // Live Chat Comments
  const [comments, setComments] = useState<StreamComment[]>([
    {
      id: 'c-1',
      user: 'Rahim_Streamer',
      avatar: '',
      text: 'ভয়েস এবং ভিডিও কোয়ালিটি অনেক সুন্দর আসছে ভাই! 👍',
      time: '1m ago',
      platform: 'dailymotion',
      badge: 'VIP',
    },
    {
      id: 'c-2',
      user: 'TechEnthusiast',
      avatar: '',
      text: 'Local MP4 recording featureটা অনেক উপকারে আসবে। সাউন্ড ক্লিয়ার।',
      time: 'Just now',
      platform: 'restream',
      badge: 'Subscriber',
    },
    {
      id: 'c-3',
      user: 'Al-Amin Gaming',
      avatar: '',
      text: 'জুম ইন করার অপশনটা অনেক দারুণ কাজ করতেছে!',
      time: 'Just now',
      platform: 'youtube',
      badge: 'Top Fan',
    },
  ]);

  // Floating heart reactions
  const [floatingReactions, setFloatingReactions] = useState<Array<{ id: string; icon: string; x: number }>>([]);

  const studioCanvasRef = useRef<StudioCanvasHandle>(null);

  // Live telemetry timer & fluctuation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isLive) {
      interval = setInterval(() => {
        setMetrics((prev) => {
          const deltaViewers = Math.floor((Math.random() - 0.45) * 12);
          const nextViewers = Math.max(10, prev.currentViewers + deltaViewers);
          const nextPeak = Math.max(prev.peakViewers, nextViewers);
          const nextBitrate = 3200 + Math.floor((Math.random() - 0.5) * 150);
          const nextFps = 59.8 + Math.random() * 0.4;
          const nextJitter = Math.floor(2 + Math.random() * 3);

          return {
            ...prev,
            isLive: true,
            liveDurationSeconds: prev.liveDurationSeconds + 1,
            currentViewers: nextViewers,
            peakViewers: nextPeak,
            totalViews: prev.totalViews + (Math.random() > 0.6 ? 1 : 0),
            bitrateKbps: nextBitrate,
            fps: nextFps,
            jitterMs: nextJitter,
          };
        });

        if (isLocalRecordActive) {
          setRecordedDuration((prev) => prev + 1);
        }

        // Random simulated viewer incoming chat message
        if (Math.random() > 0.8) {
          const randomSenders = ['Tanvir_BD', 'SabbirAhmed', 'Nafis_Studio', 'Mithun99', 'Sadia_Live'];
          const randomTexts = [
            'দারুণ স্ট্রিমিং হচ্ছে!',
            'Voice crisp & clear brother 🔥',
            'Can you zoom in a bit on the screen?',
            'Love from Dhaka! ❤️',
            'Shared the stream link in my group 👍',
          ];
          const newComment: StreamComment = {
            id: `c-${Date.now()}`,
            user: randomSenders[Math.floor(Math.random() * randomSenders.length)],
            avatar: '',
            text: randomTexts[Math.floor(Math.random() * randomTexts.length)],
            time: 'Just now',
            platform: selectedPlatform,
          };
          setComments((prev) => [newComment, ...prev.slice(0, 40)]);
          setMetrics((prev) => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
        }
      }, 1000);
    } else {
      setMetrics((prev) => ({ ...prev, isLive: false }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, isLocalRecordActive, selectedPlatform]);

  const handleToggleLive = () => {
    if (isLive) {
      // Stopping stream
      setIsLive(false);
      if (isLocalRecordActive && studioCanvasRef.current) {
        const blob = studioCanvasRef.current.stopLocalRecording();
        if (blob) setRecordedBlob(blob);
        setShowRecordingSavedNotice(true);
      }
    } else {
      // Starting stream
      if (!streamKey.trim()) {
        // Preset mock key if user didn't enter one
        setStreamKey('live_mobile_studio_active_token');
      }
      setIsLive(true);
      setShowRecordingSavedNotice(false);
      if (isLocalRecordActive && studioCanvasRef.current) {
        studioCanvasRef.current.startLocalRecording();
      }
    }
  };

  const handleSendLike = () => {
    setMetrics((prev) => ({ ...prev, likes: prev.likes + 1 }));
    // Spawn floating heart
    const reactionId = `react-${Date.now()}-${Math.random()}`;
    const heartIcons = ['❤️', '💖', '🔥', '👏', '⭐'];
    const randomIcon = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    const randomX = 15 + Math.random() * 70; // 15% to 85% width

    setFloatingReactions((prev) => [...prev, { id: reactionId, icon: randomIcon, x: randomX }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 2000);
  };

  const handleShare = () => {
    setMetrics((prev) => ({ ...prev, shares: prev.shares + 1 }));
  };

  const handleAddHostComment = (text: string) => {
    const newComment: StreamComment = {
      id: `host-${Date.now()}`,
      user: 'Broadcast Host (You)',
      avatar: '',
      text,
      time: 'Just now',
      platform: selectedPlatform,
      badge: 'Mod',
    };
    setComments((prev) => [newComment, ...prev]);
    setMetrics((prev) => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
  };

  const handleApplyTrim = (start: number, end: number) => {
    if (!media) return;
    setMedia({
      ...media,
      trimStartSeconds: start,
      trimEndSeconds: end,
    });
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setIsTrimmerOpen(false);
  };

  const handleDownloadRecording = () => {
    const blob = recordedBlob || new Blob(['sample-stream-recording-data'], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MobileStudio_stream_${new Date().toISOString().replace(/[:.]/g, '-')}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentPlatformMeta = STREAMING_PLATFORMS.find((p) => p.id === selectedPlatform) || STREAMING_PLATFORMS[0];

  return (
    <div className="min-h-screen bg-[#080B11] text-[#F0F6FC] flex flex-col font-sans">
      {/* Top Bar with Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLive={isLive}
        isRecording={isLocalRecordActive}
        onToggleLive={handleToggleLive}
        platformName={currentPlatformMeta.name}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
        {/* Local Recording Banner / Saved Notice */}
        {showRecordingSavedNotice && (
          <div className="bg-[#238636]/15 border border-[#238636]/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <FolderCheck className="w-5 h-5 text-[#38EF7D] shrink-0" />
              <div>
                <span className="font-bold text-white">
                  Local MP4 Recording Saved Successfully!
                </span>
                <p className="text-[#8B949E] text-[11px] mt-0.5">
                  Saved to: <span className="text-[#38EF7D] font-mono">/storage/emulated/0/Movies/MobileStudio/stream_{Date.now()}.mp4</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadRecording}
                className="px-3.5 py-1.5 bg-[#238636] hover:bg-[#2EA043] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Local MP4 File</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 1: LIVE STUDIO */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Control Deck (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Destination & RTMP Presets (Dailymotion, Restream, Custom RTMP) */}
              <PlatformSelector
                selectedPlatform={selectedPlatform}
                onSelectPlatform={setSelectedPlatform}
                streamUrl={streamUrl}
                setStreamUrl={setStreamUrl}
                streamKey={streamKey}
                setStreamKey={setStreamKey}
              />

              {/* Local Record Switch & Settings */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isLocalRecordActive ? 'bg-[#FF5C35] animate-pulse' : 'bg-[#8B949E]'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>লোকাল রেকর্ড (Local Record MP4)</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FF5C35]/15 text-[#FF5C35] border border-[#FF5C35]/30">
                          Dual Pipeline
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8B949E]">
                        লাইভ চলাকালে একই সাথে ডিভাইসের স্টোরেজে MP4 সেভ রাখুন
                      </div>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLocalRecordActive}
                      onChange={(e) => setIsLocalRecordActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#21262D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5C35]" />
                  </label>
                </div>

                <div className="p-2.5 bg-[#0D1117] border border-[#21262D] rounded-lg text-xs flex items-center justify-between">
                  <span className="text-[#8B949E] text-[11px]">Storage Folder:</span>
                  <span className="text-[#38EF7D] font-mono text-[11px] truncate max-w-[240px]">
                    /Movies/MobileStudio/
                  </span>
                </div>
              </div>

              {/* Media Uploader & File Location Manager */}
              <MediaUploader
                media={media}
                onMediaSelect={(item) => {
                  setMedia(item);
                  setIsTrimmerOpen(false);
                }}
                onMediaRemove={handleRemoveMedia}
                onOpenFormatsModal={() => setIsFormatsModalOpen(true)}
                onToggleTrimmer={() => setIsTrimmerOpen(!isTrimmerOpen)}
                isTrimmerOpen={isTrimmerOpen}
              />

              {/* Interactive Video & Audio Trimmer (Collapsible) */}
              {isTrimmerOpen && media && (media.type === 'video' || media.type === 'audio') && (
                <MediaTrimmer
                  media={media}
                  onApplyTrim={handleApplyTrim}
                  onClose={() => setIsTrimmerOpen(false)}
                />
              )}

              {/* Live Voice-Over / Microphone Input */}
              <VoiceOverMixer
                isMicActive={isMicActive}
                setIsMicActive={setIsMicActive}
                micVolume={micVolume}
                setMicVolume={setMicVolume}
                mediaVolume={mediaVolume}
                setMediaVolume={setMediaVolume}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
              />
            </div>

            {/* Right Live Stage & Audience Analytics Preview (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Studio Canvas with Dedicated Zoom In / Zoom Out Bar */}
              <StudioCanvas
                ref={studioCanvasRef}
                media={media}
                isLive={isLive}
                isLocalRecordActive={isLocalRecordActive}
                metrics={metrics}
                mediaVolume={mediaVolume}
                orientation={orientation}
                onToggleOrientation={() =>
                  setOrientation(orientation === 'landscape' ? 'portrait' : 'landscape')
                }
                floatingReactions={floatingReactions}
              />

              {/* Live Broadcast Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                  <span className="text-[#8B949E] text-[11px]">Live Viewers</span>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {metrics.currentViewers.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                  <span className="text-[#8B949E] text-[11px]">Likes Received</span>
                  <div className="text-lg font-bold font-mono text-[#FF2E63] mt-0.5 flex items-center justify-between">
                    <span>{metrics.likes.toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={handleSendLike}
                      className="text-xs hover:scale-110 cursor-pointer"
                    >
                      ❤️
                    </button>
                  </div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                  <span className="text-[#8B949E] text-[11px]">Chat Comments</span>
                  <div className="text-lg font-bold font-mono text-[#00F2FE] mt-0.5">
                    {metrics.commentsCount.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
                  <span className="text-[#8B949E] text-[11px]">Shares</span>
                  <div className="text-lg font-bold font-mono text-[#38EF7D] mt-0.5 flex items-center justify-between">
                    <span>{metrics.shares.toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="text-xs hover:scale-110 cursor-pointer"
                    >
                      🚀
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Chat Preview bar with trigger to full dashboard */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[#8B949E] shrink-0 font-medium">Latest Audience Chat:</span>
                  <span className="text-white truncate font-medium">
                    {comments[0]?.user}: <span className="text-[#C9D1D9] font-normal">{comments[0]?.text}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('analytics')}
                  className="text-[#58A6FF] hover:underline shrink-0 text-xs font-semibold cursor-pointer"
                >
                  View Full Analytics & Chat →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: LIVE AUDIENCE ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <LiveAnalyticsDashboard
            metrics={metrics}
            comments={comments}
            onAddComment={handleAddHostComment}
            onSendLike={handleSendLike}
            onShare={handleShare}
            selectedPlatform={selectedPlatform}
          />
        )}

        {/* VIEW 3: SUPPORTED FORMATS GUIDE */}
        {activeTab === 'formats' && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
            <h2 className="text-base font-bold text-white mb-1">
              কি কি ফাইল আপলোড করে লাইভস্ট্রিম করা যাবে (Supported File Formats)
            </h2>
            <p className="text-xs text-[#8B949E] mb-6">
              মোবাইল স্টুডিও ব্রডকাস্টারে ভিডিও, অডিও, ইমেজ, স্লাইড ও ওয়েব উইজেট সম্পূর্ণভাবে সমর্থিত
            </p>
            <SupportedFormatsModal
              isOpen={true}
              onClose={() => setActiveTab('studio')}
            />
          </div>
        )}

        {/* VIEW 4: ANDROID COMPANION & KOTLIN SOURCE CODE */}
        {activeTab === 'android' && <AndroidCompanionView />}
      </main>

      {/* Supported Formats Modal (if triggered via button in Studio) */}
      <SupportedFormatsModal
        isOpen={isFormatsModalOpen}
        onClose={() => setIsFormatsModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#21262D] px-6 py-4 text-center text-xs text-[#8B949E] bg-[#0D1117] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span>Developed by: Al-Amin Islam · MobileStudio Multi-Platform Engine</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <a
            href="https://www.facebook.com/alaminislam.nk"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/alaminislam.nk"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
          <button
            type="button"
            onClick={() => setIsFormatsModalOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Supported Formats
          </button>
        </div>
      </footer>
    </div>
  );
}
