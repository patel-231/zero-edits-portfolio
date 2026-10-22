import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Mail, 
  ExternalLink, 
  Flame, 
  Film, 
  Sparkles, 
  Check,
  ChevronRight,
  Share2
} from 'lucide-react';
import { CreatorProfile, VideoItem, Category, SiteSettings } from '../types';
import { formatDriveImageUrl } from '../utils/format';
import { VideoCard } from './VideoCard';
import { ShortsCard } from './ShortsCard';
import { StorageService } from '../services/storage';

interface ProfileChannelPageProps {
  profile: CreatorProfile;
  videos: VideoItem[];
  categories: Category[];
  settings: SiteSettings;
  onSelectVideo: (video: VideoItem) => void;
  onSelectShort: (short: VideoItem) => void;
  onOpenHireModal: () => void;
}

export const ProfileChannelPage: React.FC<ProfileChannelPageProps> = ({
  profile,
  videos,
  categories,
  settings,
  onSelectVideo,
  onSelectShort,
  onOpenHireModal,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'shorts' | 'about'>('home');
  const [isSubscribed, setIsSubscribed] = useState(true);

  const longVideos = videos.filter((v) => v.videoType !== 'short');
  const shorts = videos.filter((v) => v.videoType === 'short');
  const featured = videos.filter((v) => v.featured);

  const handleSubscribe = () => {
    const next = StorageService.toggleSubscribe(profile.displayName);
    setIsSubscribed(next);
  };

  return (
    <div className="max-w-[1780px] mx-auto px-2 sm:px-6 py-2 space-y-4 pb-16">
      
      {/* 1. CHANNEL PANORAMIC BANNER */}
      <div className="relative w-full h-36 sm:h-52 md:h-64 rounded-3xl overflow-hidden bg-neutral-900 border border-[#272727]">
        <img
          src={formatDriveImageUrl(profile.bannerUrl || profile.avatarUrl)}
          alt="Channel Banner"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.8]"
        />
      </div>

      {/* 2. CHANNEL IDENTITY HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 px-2 sm:px-4">
        {/* Avatar */}
        <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#272727] bg-neutral-800 shrink-0">
          <img
            src={formatDriveImageUrl(profile.avatarUrl)}
            alt={profile.displayName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Identity Details */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f1f1f1] tracking-tight">
              {profile.displayName}
            </h1>
            <CheckCircle2 className="w-5 h-5 text-neutral-400 fill-neutral-400/20" />
          </div>

          <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#aaaaaa]">
            <span className="font-semibold text-neutral-300">{profile.handle}</span>
            <span>•</span>
            <span className="font-mono text-white">{profile.subscribersCount} subscribers</span>
            <span>•</span>
            <span className="font-mono">{videos.length} videos</span>
          </div>

          <p className="text-xs sm:text-sm text-[#aaaaaa] line-clamp-2 max-w-3xl leading-relaxed pt-0.5">
            {profile.shortBio}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSubscribe}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                isSubscribed
                  ? 'bg-[#272727] text-white hover:bg-[#383838]'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>

            <button
              onClick={onOpenHireModal}
              className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-[#272727] hover:bg-[#383838] text-amber-400 border border-amber-400/30 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hire / Request Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CHANNEL NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-[#272727] px-2 overflow-x-auto no-scrollbar pt-2 text-sm font-medium">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-4 py-2.5 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'home' ? 'border-white text-white font-bold' : 'border-transparent text-[#aaaaaa] hover:text-white'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2.5 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'videos' ? 'border-white text-white font-bold' : 'border-transparent text-[#aaaaaa] hover:text-white'
          }`}
        >
          Videos ({longVideos.length})
        </button>
        <button
          onClick={() => setActiveTab('shorts')}
          className={`px-4 py-2.5 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'shorts' ? 'border-white text-white font-bold' : 'border-transparent text-[#aaaaaa] hover:text-white'
          }`}
        >
          Shorts ({shorts.length})
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2.5 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'about' ? 'border-white text-white font-bold' : 'border-transparent text-[#aaaaaa] hover:text-white'
          }`}
        >
          About & Rig
        </button>
      </div>

      {/* 4. TAB CONTENTS */}
      {activeTab === 'home' && (
        <div className="space-y-6 pt-2">
          {/* Featured Video Spotlight */}
          {featured[0] && (
            <div
              onClick={() => onSelectVideo(featured[0])}
              className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl bg-[#1f1f1f] border border-[#2d2d2d] hover:border-neutral-600 transition-colors"
            >
              <div className="md:col-span-5 relative aspect-video rounded-xl overflow-hidden bg-black">
                <img src={featured[0].thumbnailUrl} alt={featured[0].title} className="w-full h-full object-cover group-hover:scale-102 transition-transform" />
                <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white font-mono text-xs px-1.5 py-0.5 rounded">{featured[0].duration}</span>
              </div>
              <div className="md:col-span-7 flex flex-col justify-center space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Featured Reel</span>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                  {featured[0].title}
                </h3>
                <p className="text-xs text-[#aaaaaa] line-clamp-3 leading-relaxed">
                  {featured[0].description}
                </p>
                <div className="text-xs text-neutral-400 pt-1">
                  Client: <strong className="text-white">{featured[0].clientName || 'Commercial Spec'}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Videos Row */}
          <div>
            <h3 className="text-base font-bold text-white mb-3">Popular Videos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {longVideos.slice(0, 4).map((v) => (
                <VideoCard key={v.id} video={v} categories={categories} onSelectVideo={onSelectVideo} />
              ))}
            </div>
          </div>

          {/* Shorts Row */}
          {shorts.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#ff0000] fill-[#ff0000]" />
                <span>Shorts</span>
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {shorts.map((s) => (
                  <ShortsCard key={s.id} video={s} onSelectShort={onSelectShort} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          {longVideos.map((v) => (
            <VideoCard key={v.id} video={v} categories={categories} onSelectVideo={onSelectVideo} />
          ))}
        </div>
      )}

      {activeTab === 'shorts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {shorts.map((s) => (
            <ShortsCard key={s.id} video={s} onSelectShort={onSelectShort} />
          ))}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 text-xs">
          <div className="md:col-span-8 bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Description</h3>
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {profile.fullBio}
            </p>

            <div className="pt-4 border-t border-[#2d2d2d] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Post-Production Software Mastery</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {profile.tools.map((t) => (
                  <div key={t.name} className="p-3 bg-[#272727] rounded-xl">
                    <div className="flex justify-between font-semibold text-white mb-1">
                      <span>{t.name}</span>
                      <span className="font-mono text-neutral-400">{t.proficiency}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff0000]" style={{ width: `${t.proficiency}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#1f1f1f] border border-[#2d2d2d] rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Stats & Contact</h3>
            <div className="space-y-2 text-neutral-300">
              <div>Joined: <strong className="text-white">Oct 2026</strong></div>
              <div>Total views: <strong className="text-white font-mono">{profile.subscribersCount} Subs · 250M+ Views</strong></div>
              <div>Location: <strong className="text-white">{profile.location}</strong></div>
              <div>Email: <strong className="text-white font-mono">{profile.email}</strong></div>
            </div>
            <button
              onClick={onOpenHireModal}
              className="w-full mt-3 py-2 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold rounded-xl text-xs"
            >
              Get Project Quote
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
