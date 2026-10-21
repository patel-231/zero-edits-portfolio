import React from 'react';
import { MoreVertical, Flame, Play } from 'lucide-react';
import { VideoItem } from '../types';
import { formatViews } from '../utils/format';

interface ShortsCardProps {
  video: VideoItem;
  onSelectShort: (video: VideoItem) => void;
}

export const ShortsCard: React.FC<ShortsCardProps> = ({ video, onSelectShort }) => {
  return (
    <div
      onClick={() => onSelectShort(video)}
      className="group relative cursor-pointer flex-shrink-0 w-36 sm:w-48 aspect-[9/16] rounded-2xl overflow-hidden bg-[#212121] select-none transition-transform hover:scale-102"
    >
      {/* Thumbnail */}
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />

      {/* Gradient Scrim for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none" />

      {/* Shorts shelf icon badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-semibold text-white">
        <Flame className="w-3 h-3 text-[#ff0000] fill-[#ff0000]" />
        <span>Short</span>
      </div>

      {/* Hover play center overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center">
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </div>
      </div>

      {/* Title & Views */}
      <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 text-left">
        <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-snug drop-shadow-sm">
          {video.title}
        </h4>
        <div className="mt-1 text-[11px] text-[#aaaaaa] font-medium tabular-nums">
          {formatViews(video.views)}
        </div>
      </div>
    </div>
  );
};
