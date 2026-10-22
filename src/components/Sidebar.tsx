import React from 'react';
import { 
  Film, 
  Flame, 
  Sparkles, 
  User, 
  Sliders, 
  Award, 
  Tv2, 
  Mail, 
  ExternalLink,
  Laptop,
  CheckCircle2,
  Calendar,
  MessageSquareQuote
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
  // If collapsed on desktop, render the YouTube-style compact rail
  if (collapsed) {
    return (
      <aside className="hidden md:flex flex-col items-center w-[72px] shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 bg-[#0f0f0f] py-3 space-y-4 border-r border-[#272727] z-30 select-none">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center w-16 py-3 rounded-xl transition-colors ${
            currentView === 'home' ? 'text-white' : 'text-neutral-400 hover:text-white hover:bg-[#272727]'
          }`}
          title="All Projects"
        >
          <Film className={`w-5 h-5 ${currentView === 'home' ? 'text-[#ff0000]' : ''}`} />
          <span className="text-[10px] mt-1 font-medium tracking-tight">Portfolio</span>
        </button>

        <button
          onClick={() => onNavigate('shorts')}
          className={`flex flex-col items-center justify-center w-16 py-3 rounded-xl transition-colors ${
            currentView === 'shorts' ? 'text-white' : 'text-neutral-400 hover:text-white hover:bg-[#272727]'
          }`}
          title="Short-Form & Reels"
        >
          <Flame className={`w-5 h-5 ${currentView === 'shorts' ? 'text-[#ff0000] fill-[#ff0000]' : ''}`} />
          <span className="text-[10px] mt-1 font-medium tracking-tight">Reels</span>
        </button>

        <button
          onClick={() => onNavigate('category', 'color-grading')}
          className="flex flex-col items-center justify-center w-16 py-3 rounded-xl transition-colors text-neutral-400 hover:text-white hover:bg-[#272727]"
          title="Color Grading"
        >
          <Sliders className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] mt-1 font-medium tracking-tight">Color</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center w-16 py-3 rounded-xl transition-colors ${
            currentView === 'profile' ? 'text-white' : 'text-neutral-400 hover:text-white hover:bg-[#272727]'
          }`}
          title="About the Editor"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium tracking-tight">About</span>
        </button>

        <button
          onClick={() => onNavigate('contact')}
          className="flex flex-col items-center justify-center w-16 py-3 rounded-xl transition-colors text-neutral-400 hover:text-amber-400 hover:bg-[#272727]"
          title="Hire Editor"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] mt-1 font-medium tracking-tight">Hire</span>
        </button>
      </aside>
    );
  }

  // Full Expanded YouTube-Style Portfolio Sidebar
  const sidebarContent = (
    <div className="h-full flex flex-col py-2 px-3 overflow-y-auto space-y-3 no-scrollbar text-sm select-none">
      
      {/* SECTION 1: PORTFOLIO SHOWCASE */}
      <div>
        <h4 className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
          Portfolio
        </h4>
        <div className="space-y-0.5 mt-1">
          <button
            onClick={() => {
              onNavigate('home');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium transition-colors text-left ${
              currentView === 'home'
                ? 'bg-[#272727] text-white font-bold'
                : 'text-[#f1f1f1] hover:bg-[#272727]'
            }`}
          >
            <Film className={`w-5 h-5 ${currentView === 'home' ? 'text-[#ff0000]' : 'text-neutral-400'}`} />
            <span>All Projects</span>
          </button>

          <button
            onClick={() => {
              onNavigate('shorts');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium transition-colors text-left ${
              currentView === 'shorts'
                ? 'bg-[#272727] text-white font-bold'
                : 'text-[#f1f1f1] hover:bg-[#272727]'
            }`}
          >
            <Flame className={`w-5 h-5 ${currentView === 'shorts' ? 'text-[#ff0000] fill-[#ff0000]' : 'text-neutral-400'}`} />
            <span>Shorts & Viral Reels (9:16)</span>
          </button>

          <button
            onClick={() => {
              onNavigate('category', 'commercials');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-[#272727] text-left"
          >
            <Tv2 className="w-5 h-5 text-neutral-400" />
            <span>Commercials & Brand Ads</span>
          </button>

          <button
            onClick={() => {
              onNavigate('category', 'color-grading');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-[#272727] text-left"
          >
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>Color Grading Breakdowns</span>
          </button>
        </div>
      </div>

      <div className="border-t border-[#272727]" />

      {/* SECTION 2: ABOUT THE EDITOR */}
      <div>
        <h4 className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
          The Editor
        </h4>
        <div className="space-y-0.5 mt-1">
          <button
            onClick={() => {
              onNavigate('profile');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-left ${
              currentView === 'profile'
                ? 'bg-[#272727] text-white font-bold'
                : 'text-neutral-300 hover:text-white hover:bg-[#272727]'
            }`}
          >
            <User className="w-5 h-5 text-neutral-400" />
            <span>Editor Bio & Showreel</span>
          </button>

          <button
            onClick={() => {
              onNavigate('profile');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-[#272727] text-left"
          >
            <Laptop className="w-5 h-5 text-neutral-400" />
            <span>Software & Hardware Suite</span>
          </button>

          <button
            onClick={() => {
              onNavigate('profile');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-[#272727] text-left"
          >
            <Award className="w-5 h-5 text-neutral-400" />
            <span>Editorial Skills & ACES</span>
          </button>
        </div>
      </div>

      <div className="border-t border-[#272727]" />

      {/* SECTION 3: CLIENT & HIRE CTA CARD */}
      <div className="p-3 bg-[#1a1a1a] border border-[#2f2f2f] rounded-2xl space-y-2.5 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white text-[11px] tracking-wide uppercase">Open for Bookings</span>
        </div>
        <p className="text-neutral-400 text-[11px] leading-relaxed">
          Need commercial edits, high-retention YouTube storytelling, or cinematic color grading?
        </p>
        <button
          onClick={() => {
            onNavigate('contact');
            onCloseMobile();
          }}
          className="w-full py-2 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hire Editor / Quote</span>
        </button>
      </div>

      <div className="border-t border-[#272727]" />

      {/* SECTION 4: EDITORIAL STATS */}
      <div className="px-3 space-y-2 text-xs text-neutral-400">
        <div className="flex items-center justify-between">
          <span>Views Generated:</span>
          <strong className="text-white font-mono">50M+</strong>
        </div>
        <div className="flex items-center justify-between">
          <span>Projects Delivered:</span>
          <strong className="text-white font-mono">120+</strong>
        </div>
        <div className="flex items-center justify-between">
          <span>Turnaround:</span>
          <strong className="text-emerald-400 font-mono">24-48 Hours</strong>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-3 border-t border-[#272727] px-3 text-[11px] text-neutral-500 space-y-1">
        <div className="font-semibold text-neutral-400">{profile.displayName || 'Zero Edits'}</div>
        <div>Senior Commercial Video Editor & Master Colorist</div>
        <div className="text-[10px] text-neutral-600 pt-1">
          Crafted with YouTube Dark Design Architecture
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
