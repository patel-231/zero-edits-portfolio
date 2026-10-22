export function formatViews(views: number): string {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M views`;
  }
  if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}K views`;
  }
  return `${views} views`;
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch {
    return dateString;
  }
}

/**
 * Automatically converts Google Drive share links to high-speed direct image URLs
 * Supports:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export function formatDriveImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  // Check for Google Drive links
  if (url.includes('drive.google.com')) {
    const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1 && match1[1]) {
      return `https://lh3.googleusercontent.com/d/${match1[1]}`;
    }
    const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2 && match2[1]) {
      return `https://lh3.googleusercontent.com/d/${match2[1]}`;
    }
  }

  return url;
}

/**
 * Extracts Google Drive file ID
 */
export function extractDriveFileId(url: string): string | null {
  if (!url || !url.includes('drive.google.com')) return null;
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1 && match1[1]) return match1[1];
  const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2 && match2[1]) return match2[1];
  return null;
}

/**
 * Extracts video ID from any YouTube link (shorts, watch, youtu.be, embed, mobile)
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // Handle youtu.be/ID
  const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  // Handle youtube.com/shorts/ID
  const shortsMatch = cleanUrl.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // Handle youtube.com/embed/ID
  const embedMatch = cleanUrl.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // Handle watch?v=ID or other query params
  const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // Fallback pattern
  const generalMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/);
  return generalMatch ? generalMatch[1] : null;
}

/**
 * Returns a clean, minimal-branding YouTube embed without intrusive logos
 */
export function getCleanYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1&showinfo=0&disablekb=0&playsinline=1&enablejsapi=1`;
}

/**
 * Resolves any video URL into embed type and playback URL
 */
export interface VideoPlaybackInfo {
  type: 'youtube' | 'drive' | 'vimeo' | 'direct';
  embedUrl?: string;
  directUrl?: string;
}

export function resolveVideoPlayback(url: string): VideoPlaybackInfo {
  if (!url) {
    return { type: 'direct', directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' };
  }

  // 1. YouTube
  const ytEmbed = getCleanYouTubeEmbedUrl(url);
  if (ytEmbed) {
    return { type: 'youtube', embedUrl: ytEmbed };
  }

  // 2. Google Drive video
  const driveId = extractDriveFileId(url);
  if (driveId) {
    return { type: 'drive', embedUrl: `https://drive.google.com/file/d/${driveId}/preview` };
  }

  // 3. Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479` };
  }

  // 4. Direct video (MP4, WebM, blob, data URL, or external host)
  return { type: 'direct', directUrl: url };
}

export function getAccentClasses(accent: string = 'red') {
  switch (accent) {
    case 'amber':
      return {
        bg: 'bg-amber-500',
        text: 'text-amber-400',
        border: 'border-amber-500',
        hoverBg: 'hover:bg-amber-600',
        ring: 'focus:ring-amber-500',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      };
    case 'blue':
      return {
        bg: 'bg-blue-600',
        text: 'text-blue-400',
        border: 'border-blue-600',
        hoverBg: 'hover:bg-blue-700',
        ring: 'focus:ring-blue-500',
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      };
    case 'emerald':
      return {
        bg: 'bg-emerald-600',
        text: 'text-emerald-400',
        border: 'border-emerald-600',
        hoverBg: 'hover:bg-emerald-700',
        ring: 'focus:ring-emerald-500',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      };
    case 'purple':
      return {
        bg: 'bg-purple-600',
        text: 'text-purple-400',
        border: 'border-purple-600',
        hoverBg: 'hover:bg-purple-700',
        ring: 'focus:ring-purple-500',
        badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      };
    case 'red':
    default:
      return {
        bg: 'bg-[#ff0000]',
        text: 'text-[#ff0000]',
        border: 'border-[#ff0000]',
        hoverBg: 'hover:bg-[#cc0000]',
        ring: 'focus:ring-[#ff0000]',
        badge: 'bg-red-500/10 text-red-400 border-red-500/20'
      };
  }
}
