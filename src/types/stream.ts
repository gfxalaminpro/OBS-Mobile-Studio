export type StreamingPlatformId = 
  | 'dailymotion'
  | 'restream'
  | 'youtube'
  | 'facebook'
  | 'twitch'
  | 'kick'
  | 'tiktok'
  | 'custom';

export interface StreamingPlatform {
  id: StreamingPlatformId;
  name: string;
  defaultRtmpUrl: string;
  brandColor: string;
  badgeBg: string;
  badgeText: string;
  logoIcon: string;
  guideText: string;
  keyHint: string;
  streamKeyPlaceholder: string;
  docsUrl: string;
}

export interface SupportedFormatCategory {
  category: string;
  categoryBn: string;
  icon: string;
  extensions: string[];
  description: string;
  descriptionBn: string;
  sampleUse: string;
}

export interface UploadedMediaItem {
  id: string;
  file?: File;
  name: string;
  folderPath: string; // e.g. /storage/emulated/0/Download/Videos/
  type: 'video' | 'audio' | 'image' | 'pdf' | 'html';
  url: string;
  sizeBytes: number;
  sizeFormatted: string;
  durationSeconds?: number;
  trimStartSeconds: number;
  trimEndSeconds: number;
  width?: number;
  height?: number;
  htmlContent?: string;
  pdfPagesCount?: number;
  currentPdfPage?: number;
}

export interface StreamMetrics {
  isLive: boolean;
  liveDurationSeconds: number;
  currentViewers: number;
  peakViewers: number;
  totalViews: number;
  likes: number;
  commentsCount: number;
  shares: number;
  bitrateKbps: number;
  targetBitrateKbps: number;
  fps: number;
  droppedFrames: number;
  jitterMs: number;
  networkQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'reconnecting';
}

export interface StreamComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  platform: StreamingPlatformId;
  badge?: 'VIP' | 'Mod' | 'Subscriber' | 'Top Fan';
}
