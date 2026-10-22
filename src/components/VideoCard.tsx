import React, { useState } from 'react';
import { MoreVertical, Clock, Bookmark, Share2, CheckCircle2, Play } from 'lucide-react';
import { VideoItem, Category } from '../types';
import { formatViews, formatRelativeTime, formatDriveImageUrl } from '../utils/format';
import { StorageService } from '../services/storage';

interface VideoCardProps {
  video: VideoItem;
  categories: Category[];
  onSelectVideo: (video: VideoItem) => void;
  onChannelClick?: (channelName: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  categories,
  onSelectVideo,
  onChannelClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [watchLaterSaved, setWatchLaterSaved] = useState(false);

  const handleWatchLater = (e: React.MouseEvent) => {
    e.stopPropagation();
    const saved = StorageService.toggleWatchLater(video);
    setWatchLaterSaved(saved);
    setIsMenuOpen(false);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}?watch=${video.slug}`);
    setIsMenuOpen(false);
    alert('Video link copied to clipboard!');
  };

  return (
    <div
      onClick={() => onSelectVideo(video)}
      className="group cursor-pointer flex flex-col focus:outline-none select-none transition-transform"
    >
      {/* 16:9 Thumbnail Box */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#212121]">
        {!imageError && video.thumbnailUrl ? (
          <img
            src={formatDriveImageUrl(video.thumbnailUrl)}
            alt={video.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#212121] text-neutral-400 p-4 text-center">
            <Play className="w-8 h-8 opacity-40 mb-1" />
            <span className="text-xs line-clamp-2">{video.title}</span>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-1.5 right-1.5 bg-[#000000cc] text-white text-[11px] font-medium px-1.5 py-0.5 rounded font-mono tabular-nums">
          {video.duration}
        </div>

        {/* Hover quick action overlay (Watch Later button) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1.5">
          <button
            onClick={handleWatchLater}
            className={`p-1.5 rounded bg-black/80 hover:bg-black text-white text-xs flex items-center justify-center transition-colors ${
              watchLaterSaved ? 'text-blue-400' : ''
            }`}
            title="Watch later"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Metadata Row */}
      <div className="mt-3 flex gap-3 items-start">
        {/* Channel Avatar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onChannelClick) onChannelClick(video.channelName);
          }}
          className="shrink-0 focus:outline-none"
          title={video.channelName}
        >
          <img
            src={video.channelAvatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=Channel'}
            alt={video.channelName}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover bg-neutral-800"
          />
        </button>

        {/* Titles & Stats */}
        <div className="flex-1 min-w-0 pr-1">
          <h3 className="text-sm font-semibold text-[#f1f1f1] group-hover:text-white line-clamp-2 leading-snug">
            {video.title}
          </h3>

          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onChannelClick) onChannelClick(video.channelName);
            }}
            className="mt-1 text-xs text-[#aaaaaa] hover:text-[#f1f1f1] flex items-center gap-1 transition-colors"
          >
            <span className="truncate">{video.channelName}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 fill-neutral-400/20 shrink-0" />
          </div>

          <div className="text-xs text-[#aaaaaa] flex items-center gap-1 mt-0.5">
            <span className="tabular-nums">{formatViews(video.views)}</span>
            <span>•</span>
            <span>{formatRelativeTime(video.publishedAt)}</span>
          </div>
        </div>

        {/* 3-Dot Context Menu */}
        <div className="relative shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-1 rounded-full text-transparent group-hover:text-neutral-400 hover:text-white hover:bg-[#272727] transition-colors"
            title="Action menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-8 w-44 bg-[#282828] border border-[#3f3f3f] rounded-xl shadow-2xl py-1 z-30 text-xs text-white">
              <button
                onClick={handleWatchLater}
                className="w-full px-3.5 py-2 hover:bg-[#383838] text-left flex items-center gap-2.5"
              >
                <Clock className="w-3.5 h-3.5 text-neutral-300" />
                <span>{watchLaterSaved ? 'Saved to Watch later' : 'Save to Watch later'}</span>
              </button>
              <button
                onClick={handleShare}
                className="w-full px-3.5 py-2 hover:bg-[#383838] text-left flex items-center gap-2.5"
              >
                <Share2 className="w-3.5 h-3.5 text-neutral-300" />
                <span>Share link</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
