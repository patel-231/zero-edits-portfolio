import React from 'react';
import { 
  Home, 
  Flame, 
  Tv2, 
  User, 
  History, 
  Clock, 
  ThumbsUp, 
  Film, 
  FolderGit2, 
  Compass, 
  Music2, 
  Gamepad2, 
  Newspaper, 
  Trophy, 
  Podcast, 
  SlidersHorizontal, 
  HelpCircle, 
  Settings, 
  Flag, 
  MessageSquarePlus,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CreatorProfile, SiteSettings } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  profile: CreatorProfile;
  settings: SiteSettings;
  collapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  profile,
  settings,
  collapsed,
  isMobileOpen,
  onCloseMobile,
}) => {
  const subscriptions = [
    { name: 'Alex Vance Film', avatar: profile.avatarUrl, hasUnread: true },
    { name: 'Terra Vision Cinema', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Terra', hasUnread: false },
    { name: 'KAI Brand Lab', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=KAI', hasUnread: true },
    { name: 'Cinecom.net', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Cinecom', hasUnread: false },
  ];

  // If collapsed on desktop, render the YouTube compact icon rail
  if (collapsed) {
    return (
      <aside className="hidden md:flex flex-col items-center w-[72px] shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 bg-[#0f0f0f] py-3 space-y-5 border-r border-[#272727] z-30 select-none">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center w-16 py-3 rounded-xl transition-colors ${
            currentView === 'home' ? 'text-white' : 'text-neutral-400 hover:text-white hover:bg-[#272727]'
          }`}
          title="Home"
        >
          <Home className={`w-6 h-6 ${currentView === 'home' ? 'text-white fill-current' : ''}`} />
          <span className="text-[10px] mt-1 font-medium tracking-tight">Home</span>
        </button>

        <button
          onClick={() => onNavigate('shorts')}
          className={`flex flex-col items-center justify-center w-16 py-3 rounded-xl transition-colors ${
            currentView === 'shorts' ? 'text-white' : 'text-neutral-400 hover:text-white hover:bg-[#272727]'
          }`}
          title="Shorts"
        >
          <Flame className={`w-6 h-6 ${currentView === 'shorts' ? 'text-red-500 fill-red-500' : ''}`} />
          <span className="text-[10px] mt-1 font-medium tracking-tight">Shorts</span>
        </button>

        <button
          onClick={() => onNavigate('subscriptions')}
          className={`flex flex-col items-center justify-center w-16 py-3 rounded-xl transition-colors ${
            currentView === 'subscriptions' ? 'text-white' : 'text-neutral-400 hover:text-white hover:bg-[#272727]'
          }`}
          title="Subscriptions"
        >
          <Tv2 className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium tracking-tight truncate">Subscriptions</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center w-16 py-3 rounded-xl transition-colors ${
            currentView === 'profile' ? 'text-white' : 'text-neutral-400 hover:text-white hover:bg-[#272727]'
          }`}
          title="You"
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium tracking-tight">You</span>
        </button>
      </aside>
    );
  }

  // Full Expanded YouTube Sidebar
  const sidebarContent = (
    <div className="h-full flex flex-col py-2 px-3 overflow-y-auto space-y-3 no-scrollbar text-sm select-none">
      {/* SECTION 1: CORE NAVIGATION */}
      <div className="space-y-0.5">
        <button
          onClick={() => {
            onNavigate('home');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-xl font-medium transition-colors text-left ${
            currentView === 'home'
              ? 'bg-[#272727] text-white font-bold'
              : 'text-[#f1f1f1] hover:bg-[#272727]'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === 'home' ? 'fill-current' : ''}`} />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            onNavigate('shorts');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-xl font-medium transition-colors text-left ${
            currentView === 'shorts'
              ? 'bg-[#272727] text-white font-bold'
              : 'text-[#f1f1f1] hover:bg-[#272727]'
          }`}
        >
          <Flame className={`w-5 h-5 ${currentView === 'shorts' ? 'text-red-500 fill-red-500' : ''}`} />
          <span>Shorts</span>
        </button>

        <button
          onClick={() => {
            onNavigate('subscriptions');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-xl font-medium transition-colors text-left ${
            currentView === 'subscriptions'
              ? 'bg-[#272727] text-white font-bold'
              : 'text-[#f1f1f1] hover:bg-[#272727]'
          }`}
        >
          <Tv2 className="w-5 h-5" />
          <span>Subscriptions</span>
        </button>
      </div>

      <div className="border-t border-[#272727]" />

      {/* SECTION 2: YOU / LIBRARY */}
      <div className="space-y-0.5">
        <button
          onClick={() => {
            onNavigate('profile');
            onCloseMobile();
          }}
          className="w-full flex items-center justify-between px-3 py-1.5 text-base font-bold text-white hover:text-neutral-300"
        >
          <span className="flex items-center gap-1.5">
            <span>You</span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </span>
        </button>

        <button
          onClick={() => {
            onNavigate('profile');
            onCloseMobile();
          }}
          className="w-full flex items-center gap-6 px-3 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-[#272727] text-left"
        >
          <User className="w-5 h-5" />
          <span>Your channel</span>
        </button>

        <button
          onClick={() => {
            onNavigate('history');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-xl text-left ${
            currentView === 'history' ? 'bg-[#272727] text-white font-bold' : 'text-neutral-300 hover:text-white hover:bg-[#272727]'
          }`}
        >
          <History className="w-5 h-5" />
          <span>History</span>
        </button>

        <button
          onClick={() => {
            onNavigate('watch-later');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-xl text-left ${
            currentView === 'watch-later' ? 'bg-[#272727] text-white font-bold' : 'text-neutral-300 hover:text-white hover:bg-[#272727]'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>Watch Later</span>
        </button>

        <button
          onClick={() => {
            onNavigate('liked-videos');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-xl text-left ${
            currentView === 'liked-videos' ? 'bg-[#272727] text-white font-bold' : 'text-neutral-300 hover:text-white hover:bg-[#272727]'
          }`}
        >
          <ThumbsUp className="w-5 h-5" />
          <span>Liked videos</span>
        </button>
      </div>

      <div className="border-t border-[#272727]" />

      {/* SECTION 3: SUBSCRIPTIONS LIST */}
      <div>
        <h4 className="px-3 py-1.5 text-sm font-bold text-white uppercase tracking-wider">
          Subscriptions
        </h4>
        <div className="space-y-0.5 mt-1">
          {subscriptions.map((sub) => (
            <button
              key={sub.name}
              onClick={() => {
                onNavigate('profile');
                onCloseMobile();
              }}
              className="w-full flex items-center gap-4 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#272727] text-left"
            >
              <img
                src={sub.avatar}
                alt={sub.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
              <span className="truncate flex-1 text-xs">{sub.name}</span>
              {sub.hasUnread && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#272727]" />

      {/* SECTION 4: EXPLORE CATEGORIES */}
      <div>
        <h4 className="px-3 py-1.5 text-sm font-bold text-white uppercase tracking-wider">
          Explore
        </h4>
        <div className="space-y-0.5 mt-1">
          <button
            onClick={() => {
              onNavigate('trending');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-6 px-3 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-[#272727] text-left"
          >
            <Compass className="w-5 h-5" />
            <span>Trending</span>
          </button>
          <button
            onClick={() => {
              onNavigate('music');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-6 px-3 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-[#272727] text-left"
          >
            <Music2 className="w-5 h-5" />
            <span>Music</span>
          </button>
          <button
            onClick={() => {
              onNavigate('gaming');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-6 px-3 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-[#272727] text-left"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Gaming</span>
          </button>
          <button
            onClick={() => {
              onNavigate('podcasts');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-6 px-3 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-[#272727] text-left"
          >
            <Podcast className="w-5 h-5" />
            <span>Podcasts</span>
          </button>
        </div>
      </div>

      <div className="border-t border-[#272727]" />

      {/* SECTION 5: MORE FROM YOUTUBE */}
      <div>
        <h4 className="px-3 py-1.5 text-sm font-bold text-white uppercase tracking-wider">
          More from YouTube
        </h4>
        <div className="space-y-0.5 mt-1">
          <button
            onClick={() => {
              onNavigate('contact');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-6 px-3 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-[#272727] text-left"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Hire Creator / Quote</span>
          </button>
        </div>
      </div>

      <div className="border-t border-[#272727]" />

      {/* FOOTER NOTICE */}
      <div className="px-3 py-3 text-[11px] text-[#717171] leading-relaxed space-y-2">
        <div>About Press Copyright Contact us Creators Advertise Developers</div>
        <div>Terms Privacy Policy & Safety How YouTube works Test new features</div>
        <div className="text-neutral-500 pt-2 font-mono">
          © 2026 YouTube LLC
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:block w-60 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 bg-[#0f0f0f] border-r border-[#272727] z-30">
        {sidebarContent}
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-[#0f0f0f] shadow-2xl z-10 border-r border-[#272727]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
