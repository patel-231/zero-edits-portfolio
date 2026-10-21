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
        bg: 'bg-red-600',
        text: 'text-red-500',
        border: 'border-red-600',
        hoverBg: 'hover:bg-red-700',
        ring: 'focus:ring-red-500',
        badge: 'bg-red-500/10 text-red-400 border-red-500/20'
      };
  }
}
