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

      <div className="max-w-[1780px] mx-auto px-3 sm:px-6 py-4 space-y-6">
        
        {/* Editorial Spotlight Banner */}
        {selectedCategory === 'all' && (
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1c1c1c] via-[#222222] to-[#181818] border border-[#2f2f2f] p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff0000] animate-pulse" />
                <span className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase">
                  Featured Video Editing Showreel
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Cinematic Commercial Edits, Viral Shorts & Master Color Grading
              </h1>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Explore commercial campaign cuts, DaVinci Resolve color passes, and rhythmic sound design crafted for brands and top creators worldwide.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-neutral-300">
                <span className="text-white font-semibold">50M+ Views Generated</span>
                <span>•</span>
                <span>DaVinci Resolve Studio</span>
                <span>•</span>
                <span>Premiere Pro</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Accepting Commercial Bookings</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={onOpenHireModal}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#ff0000] hover:bg-[#cc0000] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Hire Editor / Quote</span>
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#2a2a2a] hover:bg-[#383838] text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#3f3f3f] transition-colors"
              >
                <span>About & Gear</span>
              </button>
            </div>
          </div>
        )}

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
