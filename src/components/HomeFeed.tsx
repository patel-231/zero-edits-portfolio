import React, { useRef } from 'react';
import { Flame, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { VideoItem, Category, CreatorProfile, SiteSettings } from '../types';
import { VideoCard } from './VideoCard';
import { ShortsCard } from './ShortsCard';

interface HomeFeedProps {
  videos: VideoItem[];
  categories: Category[];
  profile: CreatorProfile;
  settings: SiteSettings;
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  onSelectVideo: (video: VideoItem) => void;
  onSelectShort: (short: VideoItem) => void;
  onOpenHireModal: () => void;
  onNavigate: (view: string) => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  videos,
  categories,
  profile,
  settings,
  selectedCategory,
  onSelectCategory,
  onSelectVideo,
  onSelectShort,
  onOpenHireModal,
  onNavigate,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollPills = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const publishedVideos = videos.filter((v) => v.published);

  // Filter based on category
  const filteredVideos = publishedVideos.filter((v) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'shorts') return v.videoType === 'short';
    const cat = categories.find((c) => c.slug === selectedCategory);
    return cat ? v.categoryIds.includes(cat.id) : true;
  });

  const shorts = publishedVideos.filter((v) => v.videoType === 'short');
  const mainVideos = filteredVideos.filter((v) => v.videoType !== 'short');

  return (
    <div className="w-full pb-16">
      
      {/* 1. YOUTUBE PILL CHIPS ROW */}
      <div className="sticky top-14 z-30 w-full bg-[#0f0f0f] px-3 sm:px-6 py-2.5 flex items-center gap-2 border-b border-[#272727]">
        {/* Left Scroll arrow */}
        <button
          onClick={() => scrollPills('left')}
          className="p-1.5 rounded-full hover:bg-[#272727] text-white shrink-0 hidden sm:flex items-center justify-center"
          title="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable pill container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#f1f1f1] text-[#0f0f0f] font-semibold'
                    : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Right Scroll arrow */}
        <button
          onClick={() => scrollPills('right')}
          className="p-1.5 rounded-full hover:bg-[#272727] text-white shrink-0 hidden sm:flex items-center justify-center"
          title="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-[1780px] mx-auto px-3 sm:px-6 py-4 space-y-8">
        
        {/* 2. AUTHENTIC YOUTUBE VIDEO GRID (First Row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-4 gap-y-8">
          {mainVideos.slice(0, 4).map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              categories={categories}
              onSelectVideo={onSelectVideo}
              onChannelClick={() => onNavigate('profile')}
            />
          ))}
        </div>

        {/* 3. AUTHENTIC YOUTUBE SHORTS SHELF (When on all or shorts) */}
        {(selectedCategory === 'all' || selectedCategory === 'shorts') && shorts.length > 0 && (
          <section className="pt-2 pb-2 border-y border-[#272727] my-4">
            {/* Shorts Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {/* Shorts Logo SVG */}
                <div className="w-6 h-6 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-[#ff0000] fill-[#ff0000]" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white font-sans">
                  Shorts
                </h2>
              </div>
              <button
                onClick={() => onNavigate('shorts')}
                className="text-xs font-semibold text-[#3ea6ff] hover:underline"
              >
                View all
              </button>
            </div>

            {/* Shorts horizontal / grid items */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {shorts.map((short) => (
                <ShortsCard
                  key={short.id}
                  video={short}
                  onSelectShort={onSelectShort}
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. SECOND ROW OF MAIN VIDEOS */}
        {mainVideos.length > 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-4 gap-y-8">
            {mainVideos.slice(4).map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                categories={categories}
                onSelectVideo={onSelectVideo}
                onChannelClick={() => onNavigate('profile')}
              />
            ))}
          </div>
        )}

        {/* Empty state if nothing matches category */}
        {filteredVideos.length === 0 && (
          <div className="p-16 text-center text-[#aaaaaa]">
            <p className="text-base font-medium">No videos found in this category.</p>
            <button
              onClick={() => onSelectCategory('all')}
              className="mt-3 px-4 py-2 bg-[#272727] hover:bg-[#383838] text-white rounded-full text-xs font-semibold"
            >
              Browse All Videos
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
