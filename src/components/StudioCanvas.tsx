import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { UploadedMediaItem, StreamMetrics } from '../types/stream';
import { ZoomControlBar } from './ZoomControlBar';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Tv, 
  Disc, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export interface StudioCanvasHandle {
  startLocalRecording: () => void;
  stopLocalRecording: () => Blob | null;
  captureCurrentFrame: () => string;
}

interface StudioCanvasProps {
  media: UploadedMediaItem | null;
  isLive: boolean;
  isLocalRecordActive: boolean;
  metrics: StreamMetrics;
  mediaVolume: number;
  orientation: 'landscape' | 'portrait';
  onToggleOrientation: () => void;
  floatingReactions: Array<{ id: string; icon: string; x: number }>;
}

export const StudioCanvas = forwardRef<StudioCanvasHandle, StudioCanvasProps>(({
  media,
  isLive,
  isLocalRecordActive,
  metrics,
  mediaVolume,
  orientation,
  onToggleOrientation,
  floatingReactions,
}, ref) => {
  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);

  // Mouse Drag state for panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Playback state for video/audio
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMediaMuted, setIsMediaMuted] = useState(false);
  const [currentPdfPage, setCurrentPdfPage] = useState<number>(1);

  // Refs
  const viewportRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const lastRecordedBlobRef = useRef<Blob | null>(null);

  // Sync volume to audio/video elements
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMediaMuted ? 0 : mediaVolume;
    }
    if (audioRef.current) {
      audioRef.current.volume = isMediaMuted ? 0 : mediaVolume;
    }
  }, [mediaVolume, isMediaMuted]);

  // Handle trim boundary loop
  const handleTimeUpdate = () => {
    if (!media) return;
    const player = videoRef.current || audioRef.current;
    if (!player) return;

    if (media.trimEndSeconds && media.trimEndSeconds > 0) {
      if (player.currentTime >= media.trimEndSeconds) {
        player.currentTime = media.trimStartSeconds || 0;
        player.play().catch(() => {});
      }
    }
  };

  // Drag-to-pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1.0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetPan = () => {
    setPanX(0);
    setPanY(0);
  };

  // Expose local recording handle
  useImperativeHandle(ref, () => ({
    startLocalRecording: () => {
      // Setup recording from preview element
      recordedChunksRef.current = [];
      try {
        const stream = (viewportRef.current as unknown as { captureStream?: (fps?: number) => MediaStream })?.captureStream?.(30);
        if (stream) {
          const rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
          rec.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunksRef.current.push(e.data);
          };
          rec.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
            lastRecordedBlobRef.current = blob;
          };
          rec.start(1000);
          mediaRecorderRef.current = rec;
        }
      } catch (e) {
        console.warn('Canvas stream capture fallback');
      }
    },
    stopLocalRecording: () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      return lastRecordedBlobRef.current;
    },
    captureCurrentFrame: () => {
      return '';
    },
  }));

  const isPortrait = orientation === 'portrait';

  return (
    <div className="flex flex-col bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden shadow-2xl">
      {/* Studio Monitor Top Header Bar */}
      <div className="px-4 py-2.5 bg-[#0D1117] border-b border-[#21262D] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-[#FF2E63] animate-pulse' : 'bg-[#8B949E]'
              }`}
            />
            <span className="font-bold uppercase tracking-wider text-white">
              {isLive ? 'Program Live Feed (PGM)' : 'Studio Stage Standby'}
            </span>
          </div>
          {isLive && (
            <span className="text-[11px] font-mono text-[#38EF7D] bg-[#38EF7D]/10 px-2 py-0.5 rounded border border-[#38EF7D]/30">
              {Math.floor(metrics.liveDurationSeconds / 60)}:
              {(metrics.liveDurationSeconds % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Orientation Toggle & Status */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleOrientation}
            className="px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white transition-colors cursor-pointer text-[11px]"
          >
            {isPortrait ? '📱 Portrait (9:16)' : '🖥️ Landscape (16:9)'}
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        ref={viewportRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full bg-[#05070A] overflow-hidden flex items-center justify-center select-none ${
          isPortrait ? 'aspect-[9/16] max-h-[520px]' : 'aspect-video min-h-[340px] max-h-[480px]'
        } ${zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
      >
        {/* Render Selected Media with Zoom & Pan Transforms */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-75 origin-center"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${
              flipH ? -1 : 1
            })`,
          }}
        >
          {!media && (
            /* Standby Test Card */
            <div className="flex flex-col items-center justify-center text-center p-6 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#0D1117] border border-[#30363D] flex items-center justify-center text-[#8B949E]">
                <Tv className="w-8 h-8 opacity-60" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F0F6FC]">
                  Ready to Stream / প্রস্তুত
                </p>
                <p className="text-xs text-[#8B949E] mt-1 max-w-sm">
                  Upload a video, audio track, presentation PDF, image, or web overlay to begin broadcasting.
                </p>
              </div>
            </div>
          )}

          {media?.type === 'video' && (
            <video
              ref={videoRef}
              src={media.url}
              autoPlay
              loop
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className={`w-full h-full ${
                fitMode === 'cover' ? 'object-cover' : 'object-contain'
              }`}
            />
          )}

          {media?.type === 'audio' && (
            <div className="flex flex-col items-center justify-center gap-4 w-full h-full bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] p-8">
              <audio
                ref={audioRef}
                src={media.url}
                autoPlay
                loop
                onTimeUpdate={handleTimeUpdate}
              />
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#161B22] border-2 border-[#FF2E63] flex items-center justify-center shadow-lg shadow-[#FF2E63]/20 animate-spin-slow">
                  <Disc className="w-12 h-12 text-[#FF2E63]" />
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-white">{media.name}</h4>
                <p className="text-xs text-[#8B949E] mt-1">Audio Broadcast Active · Internal Sound Loop</p>
              </div>
              {/* Spectrum Equalizer Animation */}
              <div className="flex items-end gap-1.5 h-12">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-[#00F2FE] rounded-full animate-pulse"
                    style={{
                      height: `${25 + (Math.sin(i * 1.5) + 1) * 35}%`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {media?.type === 'image' && (
            <img
              src={media.url}
              alt={media.name}
              className={`w-full h-full ${
                fitMode === 'cover' ? 'object-cover' : 'object-contain'
              }`}
            />
          )}

          {media?.type === 'pdf' && (
            <div className="w-full h-full bg-white flex flex-col items-center justify-center p-4 text-slate-800">
              <div className="text-center">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">PDF Slide Deck</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{media.name}</h3>
                <p className="text-xs text-slate-500 mt-2">Page {currentPdfPage} of {media.pdfPagesCount || 10}</p>
                <div className="mt-6 p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 max-w-md mx-auto text-xs text-slate-600">
                  Vector slide rendering active. Streamers can present slides, notes, or research papers with crisp readability.
                </div>
              </div>
            </div>
          )}

          {media?.type === 'html' && (
            <div
              className="w-full h-full overflow-hidden"
              dangerouslySetInnerHTML={{ __html: media.htmlContent || '' }}
            />
          )}
        </div>

        {/* Floating Heart / Like Reactions over the live stream */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {floatingReactions.map((r) => (
            <div
              key={r.id}
              className="absolute bottom-6 text-2xl animate-float-up opacity-90 transition-all"
              style={{ left: `${r.x}%` }}
            >
              {r.icon}
            </div>
          ))}
        </div>

        {/* Floating Stream Health HUD (Overlay in top-left) */}
        <div className="absolute top-3 left-3 z-30 bg-[#0B0E14]/85 backdrop-blur-md border border-[#30363D]/80 rounded-lg p-2.5 flex flex-col gap-1 text-[11px] shadow-lg pointer-events-none">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold flex items-center gap-1 ${
                isLive ? 'text-[#FF2E63]' : 'text-[#8B949E]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#FF2E63]' : 'bg-[#8B949E]'}`} />
              {isLive ? 'LIVE' : 'STANDBY'}
            </span>
            <span className="text-[#38EF7D] font-mono font-bold">
              {metrics.bitrateKbps} kbps
            </span>
            <span className="text-[#00D2FF] font-mono">
              {metrics.fps.toFixed(1)} fps
            </span>
            {isLocalRecordActive && (
              <span className="text-[#FF5C35] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C35] animate-pulse" />
                REC
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#8B949E]">
            <span>Drops: {metrics.droppedFrames}</span>
            <span>Jitter: {metrics.jitterMs}ms</span>
            <span className="text-[#38EF7D]">Quality: {metrics.networkQuality}</span>
          </div>
        </div>

        {/* PDF Page Navigation Overlay (if PDF is loaded) */}
        {media?.type === 'pdf' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 bg-[#0D1117]/90 border border-[#30363D] rounded-lg px-3 py-1.5 flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setCurrentPdfPage(Math.max(1, currentPdfPage - 1))}
              disabled={currentPdfPage <= 1}
              className="p-1 rounded bg-[#21262D] hover:bg-[#30363D] disabled:opacity-40 text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-white">
              Page {currentPdfPage} / {media.pdfPagesCount || 10}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPdfPage(Math.min(media.pdfPagesCount || 10, currentPdfPage + 1))}
              disabled={currentPdfPage >= (media.pdfPagesCount || 10)}
              className="p-1 rounded bg-[#21262D] hover:bg-[#30363D] disabled:opacity-40 text-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Video / Audio playback controls overlay */}
        {(media?.type === 'video' || media?.type === 'audio') && (
          <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 bg-[#0D1117]/80 backdrop-blur border border-[#30363D] rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                const el = videoRef.current || audioRef.current;
                if (!el) return;
                if (isPlaying) {
                  el.pause();
                  setIsPlaying(false);
                } else {
                  el.play();
                  setIsPlaying(true);
                }
              }}
              className="p-1 rounded hover:bg-[#21262D] text-white cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsMediaMuted(!isMediaMuted)}
              className="p-1 rounded hover:bg-[#21262D] text-white cursor-pointer"
              title={isMediaMuted ? 'Unmute' : 'Mute'}
            >
              {isMediaMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* DEDICATED BOTTOM ZOOM & FRAMING CONTROL BAR */}
      <ZoomControlBar
        zoom={zoom}
        setZoom={setZoom}
        panX={panX}
        panY={panY}
        resetPan={resetPan}
        fitMode={fitMode}
        setFitMode={setFitMode}
        rotation={rotation}
        setRotation={setRotation}
        flipH={flipH}
        setFlipH={setFlipH}
      />
    </div>
  );
});

StudioCanvas.displayName = 'StudioCanvas';
