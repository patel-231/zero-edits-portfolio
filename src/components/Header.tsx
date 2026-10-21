import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Mic, 
  Video, 
  Bell, 
  X, 
  SlidersHorizontal,
  User,
  ShieldCheck,
  Upload,
  Radio,
  Sparkles,
  Lock,
  ArrowRight,
  Clock,
  TrendingUp,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { CreatorProfile, SiteSettings } from '../types';

interface HeaderProps {
  settings: SiteSettings;
  profile: CreatorProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
  onOpenHireModal: () => void;
  onNavigate: (view: string, param?: string) => void;
  currentView: string;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  profile,
  searchQuery,
  onSearchChange,
  onToggleSidebar,
  onOpenHireModal,
  onNavigate,
  currentView,
  isAdmin,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // YouTube auto-suggestions pool
  const suggestionsPool = [
    'HYPERCAR NOCTURNE Commercial',
    '3 Sound Design Layers That Make Edits Hit',
    'Cyberpunk Kinetic Typography Reel',
    'Color Grading Shot Matching in 30 Seconds',
    'SILENT PEAKS 4K Documentary',
    'Ultimate Video Editing Studio Tour',
    'KAI URBAN Streetwear Campaign',
    'DaVinci Resolve ACEScc Workflow',
    'Speed Ramping & Optical Flow',
    'Automotive Night Grading',
  ];

  const filteredSuggestions = searchQuery.trim()
    ? suggestionsPool.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVoiceSearch = () => {
    setIsMicActive(true);
    setTimeout(() => {
      setIsMicActive(false);
      onSearchChange('Cinematic Commercial');
    }, 1200);
  };

  const notifications = [
    {
      id: 'n1',
      title: 'New Commercial Inquiry',
      detail: 'Sarah Jenkins submitted a brief ($5,000 - $10,000 tier)',
      time: '2 hours ago',
      unread: true,
      action: () => onNavigate('admin')
    },
    {
      id: 'n2',
      title: 'Milestone Achieved',
      detail: 'HYPERCAR NOCTURNE reached 480,000 views!',
      time: 'Yesterday',
      unread: true,
      action: () => onNavigate('home')
    },
    {
      id: 'n3',
      title: 'Subscriber Milestone',
      detail: 'Your channel now has 248,000 subscribers.',
      time: '3 days ago',
      unread: false,
      action: () => onNavigate('profile')
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f0f0f] px-3 sm:px-4 h-14 flex items-center justify-between gap-4 border-b border-[#272727]">
      {/* LEFT SECTION: MENU & YOUTUBE LOGO */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-[#272727] text-white transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Authentic YouTube Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1 focus:outline-none group select-none"
          title="YouTube Home"
        >
          <div className="flex items-center">
            <svg
              className="w-7 h-5 sm:w-8 sm:h-6 fill-[#ff0000]"
              viewBox="0 0 28 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M27.4 3.1c-.3-1.2-1.2-2.1-2.4-2.4C22.9 0 14 0 14 0S5.1 0 3 .7C1.8 1 0.9 1.9.6 3.1 0 5.2 0 10 0 10s0 4.8.6 6.9c.3 1.2 1.2 2.1 2.4 2.4 2.1.7 11 .7 11 .7s8.9 0 11-.7c1.2-.3 2.1-1.2 2.4-2.4.6-2.1.6-6.9.6-6.9s0-4.8-.6-6.9z" />
              <polygon points="11.2,14.3 18.5,10 11.2,5.7" fill="#ffffff" />
            </svg>
            <div className="flex items-start ml-1">
              <span className="text-lg sm:text-xl font-bold tracking-tighter text-white font-sans">
                YouTube
              </span>
              <span className="text-[10px] text-neutral-400 font-medium ml-1 mt-0.5 tracking-normal">
                US
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* CENTER SECTION: AUTHENTIC SEARCH BAR + MIC + AUTOCOMPLETE */}
      <div
        ref={searchContainerRef}
        className={`flex-1 max-w-2xl mx-auto relative ${
          isMobileSearchOpen
            ? 'fixed inset-x-2 top-2 z-50 bg-[#0f0f0f] p-2 rounded-2xl shadow-2xl border border-neutral-700 flex items-center md:static md:p-0 md:bg-transparent md:border-0'
            : 'hidden md:flex items-center justify-center gap-3'
        }`}
      >
        <div className="relative flex items-center w-full max-w-xl">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSuggestionsOpen(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsSuggestionsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsSuggestionsOpen(false);
                }
              }}
              placeholder="Search"
              className="w-full bg-[#121212] border border-[#303030] focus:border-[#1c62b9] text-[#f1f1f1] placeholder-[#888888] text-sm pl-4 pr-10 py-2 rounded-l-full focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsSuggestionsOpen(false);
                }}
                className="absolute right-3 p-1 text-neutral-400 hover:text-white"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setIsSuggestionsOpen(false);
              onNavigate('home');
            }}
            className="px-5 py-2 bg-[#222222] hover:bg-[#272727] border border-l-0 border-[#303030] rounded-r-full text-white transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4 text-neutral-300" />
          </button>

          {/* Autocomplete Suggestions Dropdown */}
          {isSuggestionsOpen && filteredSuggestions.length > 0 && (
            <div className="absolute top-11 inset-x-0 bg-[#212121] border border-[#3f3f3f] rounded-2xl shadow-2xl py-2 z-50 text-xs text-white">
              {filteredSuggestions.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    onSearchChange(item);
                    setIsSuggestionsOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-[#383838] cursor-pointer flex items-center gap-3"
                >
                  <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mic Voice Search */}
        <button
          onClick={handleVoiceSearch}
          className={`p-2.5 rounded-full ml-2 transition-colors ${
            isMicActive
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-[#222222] hover:bg-[#272727] text-white'
          }`}
          title="Search with your voice"
        >
          <Mic className="w-4 h-4" />
        </button>

        {isMobileSearchOpen && (
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="ml-2 px-3 py-1.5 text-xs text-neutral-300 bg-[#272727] rounded-lg md:hidden"
          >
            Cancel
          </button>
        )}
      </div>

      {/* RIGHT SECTION: ACTIONS & USER PROFILE */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="md:hidden p-2 rounded-full hover:bg-[#272727] text-white"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Create (+) Video Button with dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsCreateMenuOpen(!isCreateMenuOpen);
              setIsNotificationsOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#272727] hover:bg-[#383838] text-sm font-semibold text-white transition-colors"
            title="Create"
          >
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">+ Create</span>
          </button>

          {isCreateMenuOpen && (
            <div className="absolute right-0 top-11 w-48 bg-[#282828] border border-[#3f3f3f] rounded-xl shadow-2xl py-1 z-50 text-xs text-white animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  onNavigate('admin');
                }}
                className="w-full px-4 py-2.5 hover:bg-[#383838] text-left flex items-center gap-2.5 font-medium"
              >
                <Upload className="w-4 h-4 text-neutral-300" />
                <span>Upload Video (Studio)</span>
              </button>
              <button
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  onOpenHireModal();
                }}
                className="w-full px-4 py-2.5 hover:bg-[#383838] text-left flex items-center gap-2.5 font-medium"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Request Custom Project</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell with working Drawer */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsCreateMenuOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="p-2 rounded-full hover:bg-[#272727] text-white relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#cc0000] text-white text-[9px] font-bold flex items-center justify-center">
              2
            </span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-11 w-80 bg-[#282828] border border-[#3f3f3f] rounded-2xl shadow-2xl z-50 text-xs text-white overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-[#3f3f3f] flex items-center justify-between">
                <span className="font-bold text-sm">Notifications</span>
                <span className="text-[10px] text-neutral-400">2 unread</span>
              </div>
              <div className="divide-y divide-[#383838] max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      n.action();
                    }}
                    className={`p-3.5 hover:bg-[#383838] cursor-pointer flex gap-3 transition-colors ${
                      n.unread ? 'bg-[#303030]/60' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1f1f1f] flex items-center justify-center shrink-0 text-[#ff0000]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">{n.title}</div>
                      <p className="text-[#aaaaaa] text-[11px] leading-tight mt-0.5">{n.detail}</p>
                      <span className="text-[10px] text-neutral-500 mt-1 block font-mono">{n.time}</span>
                    </div>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-[#3ea6ff] mt-1 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* YouTube Studio / Admin Access Button */}
        <button
          onClick={() => onNavigate(currentView === 'admin' ? 'home' : 'admin')}
          className={`p-2 rounded-full transition-colors flex items-center gap-1 text-xs font-semibold ${
            currentView === 'admin'
              ? 'bg-[#ff0000] text-white'
              : 'hover:bg-[#272727] text-neutral-300 hover:text-white'
          }`}
          title={currentView === 'admin' ? 'Exit Studio' : 'YouTube Studio / Admin'}
        >
          {isAdmin ? (
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
          <span className="hidden xl:inline text-xs">
            {currentView === 'admin' ? 'Exit Studio' : 'Studio'}
          </span>
        </button>

        {/* User Channel Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotificationsOpen(false);
              setIsCreateMenuOpen(false);
            }}
            className="flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-neutral-500 focus:outline-none transition-all"
            title="User Profile & Menu"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover bg-neutral-800 border border-[#303030]"
            />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-11 w-64 bg-[#282828] border border-[#3f3f3f] rounded-2xl shadow-2xl py-2 z-50 text-xs text-white animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-[#3f3f3f] flex items-center gap-3">
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="font-bold text-sm text-white truncate">{profile.displayName}</div>
                  <div className="text-neutral-400 truncate">{profile.handle}</div>
                  <div className="text-[11px] text-blue-400 mt-0.5">View your channel</div>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate('profile');
                  }}
                  className="w-full px-4 py-2.5 hover:bg-[#383838] text-left flex items-center gap-3"
                >
                  <User className="w-4 h-4 text-neutral-300" />
                  <span>Your Channel</span>
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate('admin');
                  }}
                  className="w-full px-4 py-2.5 hover:bg-[#383838] text-left flex items-center gap-3"
                >
                  <SlidersHorizontal className="w-4 h-4 text-red-500" />
                  <span>YouTube Studio (Admin)</span>
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenHireModal();
                  }}
                  className="w-full px-4 py-2.5 hover:bg-[#383838] text-left flex items-center gap-3"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Hire Editor / Client Inquiries</span>
                </button>
              </div>

              <div className="border-t border-[#3f3f3f] pt-1 mt-1">
                <div className="px-4 py-2 text-[11px] text-neutral-400">
                  Administrator: <strong className="text-neutral-200">ompatel787877@gmail.com</strong>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
