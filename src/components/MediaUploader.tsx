import React, { useRef, useState } from 'react';
import { UploadedMediaItem } from '../types/stream';
import { 
  Upload, 
  Trash2, 
  Folder, 
  FileVideo, 
  FileAudio, 
  FileImage, 
  FileText, 
  Code, 
  HelpCircle,
  FolderOpen,
  Scissors
} from 'lucide-react';

interface MediaUploaderProps {
  media: UploadedMediaItem | null;
  onMediaSelect: (media: UploadedMediaItem) => void;
  onMediaRemove: () => void;
  onOpenFormatsModal: () => void;
  onToggleTrimmer?: () => void;
  isTrimmerOpen?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  media,
  onMediaSelect,
  onMediaRemove,
  onOpenFormatsModal,
  onToggleTrimmer,
  isTrimmerOpen,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [folderPrefix, setFolderPrefix] = useState('/storage/emulated/0/Download/Livestreams');
  const [isEditingFolder, setIsEditingFolder] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let mediaType: UploadedMediaItem['type'] = 'image';
    if (file.type.startsWith('video/')) mediaType = 'video';
    else if (file.type.startsWith('audio/')) mediaType = 'audio';
    else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) mediaType = 'pdf';
    else if (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm')) mediaType = 'html';

    const url = URL.createObjectURL(file);

    // If HTML, read text content
    if (mediaType === 'html') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        onMediaSelect({
          id: `media-${Date.now()}`,
          file,
          name: file.name,
          folderPath: `${folderPrefix}/${file.name}`,
          type: 'html',
          url,
          htmlContent: text,
          sizeBytes: file.size,
          sizeFormatted: formatFileSize(file.size),
          trimStartSeconds: 0,
          trimEndSeconds: 0,
        });
      };
      reader.readAsText(file);
    } else {
      // For video or audio, extract duration
      if (mediaType === 'video' || mediaType === 'audio') {
        const tempMedia = document.createElement(mediaType);
        tempMedia.src = url;
        tempMedia.onloadedmetadata = () => {
          onMediaSelect({
            id: `media-${Date.now()}`,
            file,
            name: file.name,
            folderPath: `${folderPrefix}/${file.name}`,
            type: mediaType,
            url,
            durationSeconds: tempMedia.duration || 60,
            sizeBytes: file.size,
            sizeFormatted: formatFileSize(file.size),
            trimStartSeconds: 0,
            trimEndSeconds: tempMedia.duration || 60,
          });
        };
      } else {
        onMediaSelect({
          id: `media-${Date.now()}`,
          file,
          name: file.name,
          folderPath: `${folderPrefix}/${file.name}`,
          type: mediaType,
          url,
          sizeBytes: file.size,
          sizeFormatted: formatFileSize(file.size),
          trimStartSeconds: 0,
          trimEndSeconds: 0,
          pdfPagesCount: mediaType === 'pdf' ? 5 : undefined,
          currentPdfPage: mediaType === 'pdf' ? 1 : undefined,
        });
      }
    }
  };

  const handleLoadSample = (sampleType: 'video' | 'audio' | 'image' | 'pdf' | 'html') => {
    switch (sampleType) {
      case 'video':
        onMediaSelect({
          id: 'sample-video',
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
        break;
      case 'audio':
        onMediaSelect({
          id: 'sample-audio',
          name: 'Tech_Podcast_Episode_42.mp3',
          folderPath: '/storage/emulated/0/Music/Podcasts/Tech_Podcast_Episode_42.mp3',
          type: 'audio',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          durationSeconds: 372,
          sizeBytes: 8.5 * 1024 * 1024,
          sizeFormatted: '8.5 MB',
          trimStartSeconds: 0,
          trimEndSeconds: 372,
        });
        break;
      case 'image':
        onMediaSelect({
          id: 'sample-image',
          name: 'Cyberpunk_Broadcaster_Banner.jpg',
          folderPath: '/storage/emulated/0/Pictures/Overlays/Cyberpunk_Broadcaster_Banner.jpg',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
          sizeBytes: 2.1 * 1024 * 1024,
          sizeFormatted: '2.1 MB',
          trimStartSeconds: 0,
          trimEndSeconds: 0,
        });
        break;
      case 'pdf':
        onMediaSelect({
          id: 'sample-pdf',
          name: 'Live_Product_Keynote_Deck.pdf',
          folderPath: '/storage/emulated/0/Documents/Presentations/Live_Product_Keynote_Deck.pdf',
          type: 'pdf',
          url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
          sizeBytes: 4.8 * 1024 * 1024,
          sizeFormatted: '4.8 MB',
          pdfPagesCount: 14,
          currentPdfPage: 1,
          trimStartSeconds: 0,
          trimEndSeconds: 0,
        });
        break;
      case 'html':
        onMediaSelect({
          id: 'sample-html',
          name: 'Stream_Overlays_Widget.html',
          folderPath: '/storage/emulated/0/Download/Widgets/Stream_Overlays_Widget.html',
          type: 'html',
          url: 'about:blank',
          htmlContent: `
            <div style="font-family: sans-serif; text-align: center; color: #fff; padding: 40px; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); border-radius: 16px; border: 1px solid #30363d; height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <h1 style="color: #00F2FE; font-size: 32px; margin-bottom: 8px;">🔴 LIVE BROADCAST OVERLAY</h1>
              <p style="color: #8B949E; font-size: 16px; max-width: 500px;">Mobile Studio Interactive HTML Stream Layer</p>
              <div style="margin-top: 24px; padding: 12px 24px; background: #21262d; border-radius: 8px; font-family: monospace; color: #38EF7D; font-size: 14px;">
                STATUS: STREAMING ACTIVE · FPS: 60.0 · BITRATE: 3000 kbps
              </div>
            </div>
          `,
          sizeBytes: 32 * 1024,
          sizeFormatted: '32 KB',
          trimStartSeconds: 0,
          trimEndSeconds: 0,
        });
        break;
    }
  };

  const getTypeIcon = (type: UploadedMediaItem['type']) => {
    switch (type) {
      case 'video': return <FileVideo className="w-4 h-4 text-rose-400" />;
      case 'audio': return <FileAudio className="w-4 h-4 text-amber-400" />;
      case 'image': return <FileImage className="w-4 h-4 text-emerald-400" />;
      case 'pdf': return <FileText className="w-4 h-4 text-indigo-400" />;
      case 'html': return <Code className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wider uppercase text-[#8B949E] flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span>Media Source & File Manager</span>
        </label>
        <button
          type="button"
          onClick={onOpenFormatsModal}
          className="text-xs text-[#58A6FF] hover:text-[#79C0FF] flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Supported Formats (কি কি ফাইল চলবে)</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*,application/pdf,.pdf,.html,.htm"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* If media is selected, display rich file card with folder location and cut/remove actions */}
      {media ? (
        <div className="bg-[#0D1117] border border-[#21262D] rounded-lg p-3 flex flex-col gap-2.5">
          {/* File Name & Type & Actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 bg-[#161B22] border border-[#30363D] rounded-lg shrink-0">
                {getTypeIcon(media.type)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                  {media.name}
                </div>
                <div className="text-[11px] text-[#8B949E] flex items-center gap-2">
                  <span className="uppercase font-mono">{media.type}</span>
                  <span>·</span>
                  <span className="font-mono">{media.sizeFormatted}</span>
                  {media.durationSeconds !== undefined && (
                    <>
                      <span>·</span>
                      <span className="font-mono">
                        {Math.floor(media.durationSeconds / 60)}:
                        {(Math.floor(media.durationSeconds % 60)).toString().padStart(2, '0')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons: Trim segment & Remove / Cut out file */}
            <div className="flex items-center gap-2 shrink-0">
              {(media.type === 'video' || media.type === 'audio') && onToggleTrimmer && (
                <button
                  type="button"
                  onClick={onToggleTrimmer}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isTrimmerOpen
                      ? 'bg-[#FF2E63]/20 border-[#FF2E63] text-white'
                      : 'bg-[#21262D] border-[#30363D] text-[#C9D1D9] hover:text-white'
                  }`}
                  title="Trim / Cut audio/video segment"
                >
                  <Scissors className="w-3.5 h-3.5 text-[#FF2E63]" />
                  <span>{isTrimmerOpen ? 'Close Trimmer' : 'Trim Video/Audio'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onMediaRemove}
                className="px-2.5 py-1 text-xs rounded bg-red-950/40 border border-red-800/60 text-red-300 hover:bg-red-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                title="Remove / Delete File (কেটে দিন)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>কেটে দিন (Remove)</span>
              </button>
            </div>
          </div>

          {/* Exact File Folder Location Bar */}
          <div className="p-2 bg-[#161B22] border border-[#30363D]/70 rounded-md flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[#8B949E] shrink-0 font-medium">Location:</span>
              <span className="text-[#38EF7D] font-mono text-[11px] truncate" title={media.folderPath}>
                {media.folderPath}
              </span>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#58A6FF] hover:underline text-[11px] shrink-0 cursor-pointer"
            >
              Change File
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div className="flex flex-col gap-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#30363D] hover:border-[#58A6FF] bg-[#0D1117] hover:bg-[#161B22]/60 rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#21262D] group-hover:bg-[#58A6FF]/20 group-hover:text-[#58A6FF] flex items-center justify-center transition-colors text-[#8B949E]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                ফাইল নির্বাচন করুন (Click to Browse File)
              </p>
              <p className="text-[11px] text-[#8B949E] mt-0.5">
                MP4, MKV, MP3, WAV, JPG, PNG, PDF স্লাইড অথবা HTML ওয়েব পেজ
              </p>
            </div>
          </div>

          {/* Quick preset loaders for testing */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[#8B949E] text-[11px]">Or load instant test sample:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleLoadSample('video')}
                className="px-2 py-0.5 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] rounded text-[11px] cursor-pointer"
              >
                Sample Video
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('audio')}
                className="px-2 py-0.5 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] rounded text-[11px] cursor-pointer"
              >
                Sample Audio
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('image')}
                className="px-2 py-0.5 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] rounded text-[11px] cursor-pointer"
              >
                Sample Image
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('pdf')}
                className="px-2 py-0.5 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] rounded text-[11px] cursor-pointer"
              >
                Sample PDF
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('html')}
                className="px-2 py-0.5 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] rounded text-[11px] cursor-pointer"
              >
                Sample HTML
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
