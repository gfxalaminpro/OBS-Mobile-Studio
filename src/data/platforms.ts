import { StreamingPlatform, SupportedFormatCategory } from '../types/stream';

export const STREAMING_PLATFORMS: StreamingPlatform[] = [
  {
    id: 'dailymotion',
    name: 'Dailymotion',
    defaultRtmpUrl: 'rtmp://publish.dailymotion.com/live',
    brandColor: '#0066DC',
    badgeBg: 'bg-[#0066DC]/10 border-[#0066DC]/40 text-[#4094FF]',
    badgeText: 'Dailymotion Partner',
    logoIcon: 'dailymotion',
    guideText: 'Paste your Dailymotion Live Stream Key from Dailymotion Studio > Live Streams.',
    keyHint: 'e.g. dm_live_sec_...',
    streamKeyPlaceholder: 'Your Dailymotion stream key',
    docsUrl: 'https://www.dailymotion.com/partner'
  },
  {
    id: 'restream',
    name: 'Restream.io',
    defaultRtmpUrl: 'rtmp://live.restream.io/live',
    brandColor: '#FF5C35',
    badgeBg: 'bg-[#FF5C35]/10 border-[#FF5C35]/40 text-[#FF7A59]',
    badgeText: 'Multi-stream Hub',
    logoIcon: 'restream',
    guideText: 'Stream simultaneously to 30+ platforms (YouTube, FB, Twitch, X) using 1 RTMP connection.',
    keyHint: 're_12345678_...',
    streamKeyPlaceholder: 'Your Restream broadcast key',
    docsUrl: 'https://restream.io'
  },
  {
    id: 'youtube',
    name: 'YouTube Live',
    defaultRtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
    brandColor: '#FF0000',
    badgeBg: 'bg-[#FF0000]/10 border-[#FF0000]/40 text-[#FF4D4D]',
    badgeText: 'YouTube Studio',
    logoIcon: 'youtube',
    guideText: 'Find your stream key in YouTube Studio > Go Live > Stream Settings.',
    keyHint: 'xxxx-xxxx-xxxx-xxxx-xxxx',
    streamKeyPlaceholder: 'Your YouTube stream key',
    docsUrl: 'https://studio.youtube.com'
  },
  {
    id: 'facebook',
    name: 'Facebook Live',
    defaultRtmpUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/',
    brandColor: '#1877F2',
    badgeBg: 'bg-[#1877F2]/10 border-[#1877F2]/40 text-[#4595FF]',
    badgeText: 'Meta Creator',
    logoIcon: 'facebook',
    guideText: 'Get your persistent stream key from Facebook Live Producer / Meta Business Suite.',
    keyHint: 'FB-123456789012345-0-Abc...',
    streamKeyPlaceholder: 'Your Facebook stream key',
    docsUrl: 'https://facebook.com/live/producer'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    defaultRtmpUrl: 'rtmp://live.twitch.tv/app/',
    brandColor: '#9146FF',
    badgeBg: 'bg-[#9146FF]/10 border-[#9146FF]/40 text-[#B782FF]',
    badgeText: 'Twitch Creator',
    logoIcon: 'twitch',
    guideText: 'Obtain Primary Stream Key from Twitch Creator Dashboard > Settings > Stream.',
    keyHint: 'live_123456789_abcdef...',
    streamKeyPlaceholder: 'live_... Primary stream key',
    docsUrl: 'https://dashboard.twitch.tv'
  },
  {
    id: 'kick',
    name: 'Kick',
    defaultRtmpUrl: 'rtmps://fa723fc1b171.global-contribute.live-video.net/app/',
    brandColor: '#53FC18',
    badgeBg: 'bg-[#53FC18]/10 border-[#53FC18]/40 text-[#53FC18]',
    badgeText: 'Kick Stream',
    logoIcon: 'kick',
    guideText: 'Find in Kick Creator Dashboard > Settings > Stream Key & RTMP Server URL.',
    keyHint: 'sk_us-east-1_...',
    streamKeyPlaceholder: 'Your Kick stream key',
    docsUrl: 'https://kick.com/dashboard/settings/stream'
  },
  {
    id: 'tiktok',
    name: 'TikTok Live',
    defaultRtmpUrl: 'rtmp://live-push.tiktok.com/live/',
    brandColor: '#00F2FE',
    badgeBg: 'bg-[#00F2FE]/10 border-[#00F2FE]/40 text-[#00F2FE]',
    badgeText: 'TikTok Studio',
    logoIcon: 'tiktok',
    guideText: 'Requires TikTok Live Studio access or TikTok Creator Marketplace RTMP credentials.',
    keyHint: 'stream-key-from-tiktok-live',
    streamKeyPlaceholder: 'TikTok Server Key',
    docsUrl: 'https://www.tiktok.com/live/studio'
  },
  {
    id: 'custom',
    name: 'Custom RTMP / RTMPS',
    defaultRtmpUrl: 'rtmp://your-private-server.com/live',
    brandColor: '#8B5CF6',
    badgeBg: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/40 text-[#A78BFA]',
    badgeText: 'Custom Endpoint',
    logoIcon: 'server',
    guideText: 'Broadcast to Nginx-RTMP, SRS, OBS Ninja, Castr, Wowza, Ant Media, or private server.',
    keyHint: 'custom-stream-key-or-token',
    streamKeyPlaceholder: 'Custom stream key / authorization',
    docsUrl: 'https://obsproject.com/kb/rtmp-streaming'
  }
];

export const SUPPORTED_FORMATS: SupportedFormatCategory[] = [
  {
    category: 'Video Files',
    categoryBn: 'ভিডিও ফাইল',
    icon: 'video',
    extensions: ['.mp4', '.webm', '.mkv', '.mov', '.avi', '.m4v'],
    description: 'High-definition video playback with interactive trimming, volume slider, looping, and smooth frame-synced streaming.',
    descriptionBn: 'এইচডি ভিডিও প্লেব্যাক, নির্দিষ্ট অংশ কেটে ছোট করার সুবিধা (Trimming), সাউন্ড নিয়ন্ত্রণ ও লুপ স্ট্রিমিং।',
    sampleUse: 'Pre-recorded gameplays, intro trailers, podcasts, product reviews'
  },
  {
    category: 'Audio & Music Tracks',
    categoryBn: 'অডিও ও মিউজিক ফাইল',
    icon: 'music',
    extensions: ['.mp3', '.wav', '.aac', '.m4a', '.ogg', '.flac'],
    description: 'Crystal-clear audio playback synchronized with live spectrum visualizer, customizable background artwork, and mic voice-over mixing.',
    descriptionBn: 'হাই-কোয়ালিটি অডিও, লাইভ অডিও স্পেকট্রাম ভিজ্যুয়ালাইজার এবং ব্যাকগ্রাউন্ড মিউজিকের সাথে সরাসরি লাইভ ভয়েস দেওয়ার সুবিধা।',
    sampleUse: 'Podcasts, background music, radio shows, vocal practice'
  },
  {
    category: 'Images & Graphics',
    categoryBn: 'ছবি ও গ্রাফিক্স',
    icon: 'image',
    extensions: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'],
    description: 'Static or animated overlays, full-screen background graphics, stream banners with real-time zoom in/out & pan navigation.',
    descriptionBn: 'স্ট্যাটিক বা অ্যানিমেটেড ছবি, ফুল-স্ক্রিন ব্যানার, ইনফোগ্রাফিক এবং লাইভ চলাকালীন সুবিধাজনক জুম ইন/আউট কন্ট্রোল।',
    sampleUse: 'Starting soon screens, scoreboards, product photos, memes'
  },
  {
    category: 'PDF Documents & Slides',
    categoryBn: 'পিডিএফ ও স্লাইড ডকুমেন্টস',
    icon: 'file-text',
    extensions: ['.pdf', '.pptx (via PDF)'],
    description: 'Page-by-page rendering with multi-page navigation buttons, crisp zoom scale, high-res vector rendering for presentations.',
    descriptionBn: 'পেজ পরিবর্তন ও সহজে উপস্থাপনা করার সুবিধা, উচ্চ রেজুলেশন টেক্সট রেন্ডারিং এবং ফুল-স্ক্রিন লেকচার স্ট্রিমিং।',
    sampleUse: 'Online tutoring, business pitch decks, research papers, eBooks'
  },
  {
    category: 'Interactive HTML & Web Pages',
    categoryBn: 'ওয়েব পেজ ও এইচটিএমএল উইজেট',
    icon: 'code',
    extensions: ['.html', '.htm'],
    description: 'Dynamic web pages, live charts, animated HTML5 canvas widgets, chat overlays rendered live on the stream.',
    descriptionBn: 'ডাইনামিক ওয়েব পেজ, অ্যানিমেটেড এইচটিএমএল৫ উইজেট, লাইভ চ্যাট কাউন্টার ও চার্ট প্রদর্শন।',
    sampleUse: 'Donation goal widgets, live countdowns, live websites, web animations'
  }
];
