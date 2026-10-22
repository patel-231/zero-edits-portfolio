import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { VideoItem, Category, CreatorProfile, SiteSettings } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeFeed } from './components/HomeFeed';
import { VideoWatchPage } from './components/VideoWatchPage';
import { ShortsPlayerModal } from './components/ShortsPlayerModal';
import { ProfileChannelPage } from './components/ProfileChannelPage';
import { ContactHireModal } from './components/ContactHireModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VideoCard } from './components/VideoCard';
import { ShortsCard } from './components/ShortsCard';
import { Flame, Clock, History, ThumbsUp, Tv2, Film, Sparkles } from 'lucide-react';

export default function App() {
  const [videos, setVideos] = useState<VideoItem[]>(() => StorageService.getVideos());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [profile, setProfile] = useState<CreatorProfile>(() => StorageService.getProfile());
  const [settings, setSettings] = useState<SiteSettings>(() => StorageService.getSettings());

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sidebar state: desktop collapsed rail vs expanded, and mobile overlay drawer
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Active Video / Short
  const [activeWatchVideo, setActiveWatchVideo] = useState<VideoItem | null>(null);
  const [activeShort, setActiveShort] = useState<VideoItem | null>(null);

  // Modals & Panels
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  // URL state synchronization & Routing (/zero is the secret admin route)
  useEffect(() => {
    const handleLocationChange = () => {
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const watchSlug = params.get('watch') || params.get('v');
      const viewParam = params.get('view');

      // Check if URL is /zero or contains zero param/hash
      if (
        pathname === '/zero' ||
        pathname === '/zero/' ||
        params.has('zero') ||
        hash === '#/zero' ||
        hash === '#zero'
      ) {
        setCurrentView('admin');
        return;
      }

      if (watchSlug) {
        const match = StorageService.getVideoBySlug(watchSlug);
        if (match) {
          if (match.videoType === 'short') {
            setActiveShort(match);
          } else {
            setActiveWatchVideo(match);
            setCurrentView('watch');
          }
          return;
        }
      }

      if (viewParam) {
        setCurrentView(viewParam);
      } else {
        setCurrentView('home');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const refreshAllData = () => {
    setVideos(StorageService.getVideos());
    setCategories(StorageService.getCategories());
    setProfile(StorageService.getProfile());
    setSettings(StorageService.getSettings());
  };

  const navigateTo = (view: string, param?: string) => {
    setSearchQuery('');

    // Admin direct route (/zero)
    if (view === 'admin' || view === 'zero') {
      setCurrentView('admin');
      window.history.pushState({}, '', '/zero');
      return;
    }

    if (view === 'watch' && param) {
      const match = StorageService.getVideoBySlug(param);
      if (match) {
        setActiveWatchVideo(match);
        setCurrentView('watch');
        window.history.pushState({}, '', `?watch=${match.slug}`);
        return;
      }
    }

    if (view === 'category' && param) {
      setSelectedCategory(param);
      setCurrentView('home');
      window.history.pushState({}, '', `?view=home`);
      return;
    }

    if (view === 'contact') {
      setIsHireModalOpen(true);
      return;
    }

    setActiveWatchVideo(null);
    setCurrentView(view);
    window.history.pushState({}, '', view === 'home' ? '/' : `?view=${view}`);
  };

  const handleSelectVideo = (video: VideoItem) => {
    if (video.videoType === 'short') {
      setActiveShort(video);
    } else {
      setActiveWatchVideo(video);
      setCurrentView('watch');
      window.history.pushState({}, '', `?watch=${video.slug}`);
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // Search filter
  const searchedVideos = searchQuery.trim()
    ? videos.filter(
        (v) =>
          v.published &&
          (v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (v.clientName && v.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (v.channelName && v.channelName.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : null;

  // Render Zero Studio (Admin Panel accessible only by /zero in URL, NO password required)
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        onExitAdmin={() => navigateTo('home')}
        onDataUpdated={refreshAllData}
      />
    );
  }

  // Helper data for library views
  const historyVideos = StorageService.getHistory();
  const watchLaterVideos = StorageService.getWatchLater();
  const likedVideos = StorageService.getLikedVideos();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1] flex flex-col font-sans selection:bg-[#ff0000] selection:text-white">
      {/* Universal YouTube Top Header */}
      <Header
        settings={settings}
        profile={profile}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebar={toggleSidebar}
        onOpenHireModal={() => setIsHireModalOpen(true)}
        onNavigate={navigateTo}
        currentView={currentView}
      />

      <div className="flex-1 flex w-full">
        {/* Left YouTube Sidebar (Collapsible to compact rail or expanded drawer) */}
        {currentView !== 'watch' && (
          <Sidebar
            currentView={currentView}
            onNavigate={navigateTo}
            profile={profile}
            settings={settings}
            collapsed={isSidebarCollapsed}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {/* SEARCH RESULTS VIEW */}
          {searchedVideos !== null ? (
            <div className="max-w-[1780px] mx-auto px-4 sm:px-6 py-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#272727]">
                <h2 className="text-lg font-bold text-white">
                  Results for "{searchQuery}" ({searchedVideos.length})
                </h2>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-semibold text-[#3ea6ff] hover:underline"
                >
                  Clear
                </button>
              </div>

              {searchedVideos.length === 0 ? (
                <div className="p-16 text-center text-[#aaaaaa]">
                  <Film className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p className="text-base font-semibold text-neutral-200">No results found.</p>
                  <p className="text-xs text-neutral-500 mt-1">Try different keywords or check spelling.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchedVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      categories={categories}
                      onSelectVideo={handleSelectVideo}
                      onChannelClick={() => navigateTo('profile')}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : currentView === 'watch' && activeWatchVideo ? (
            /* YOUTUBE WATCH PAGE */
            <VideoWatchPage
              video={activeWatchVideo}
              allVideos={videos.filter((v) => v.published)}
              categories={categories}
              profile={profile}
              settings={settings}
              onSelectVideo={handleSelectVideo}
              onBack={() => navigateTo('home')}
              onOpenHireModal={() => setIsHireModalOpen(true)}
            />
          ) : currentView === 'shorts' ? (
            /* DEDICATED YOUTUBE SHORTS GRID */
            <div className="max-w-[1780px] mx-auto px-3 sm:px-6 py-4 space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <Flame className="w-6 h-6 text-[#ff0000] fill-[#ff0000]" />
                <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
                  Shorts
                </h1>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {videos
                  .filter((v) => v.published && v.videoType === 'short')
                  .map((short) => (
                    <ShortsCard
                      key={short.id}
                      video={short}
                      onSelectShort={(s) => setActiveShort(s)}
                    />
                  ))}
              </div>
            </div>
          ) : currentView === 'subscriptions' ? (
            /* SUBSCRIPTIONS FEED */
            <div className="max-w-[1780px] mx-auto px-3 sm:px-6 py-4 space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <Tv2 className="w-6 h-6 text-white" />
                <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
                  Subscriptions
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {videos.filter((v) => v.published).map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    categories={categories}
                    onSelectVideo={handleSelectVideo}
                    onChannelClick={() => navigateTo('profile')}
                  />
                ))}
              </div>
            </div>
          ) : currentView === 'history' ? (
            /* HISTORY VIEW */
            <div className="max-w-[1780px] mx-auto px-3 sm:px-6 py-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#272727]">
                <div className="flex items-center gap-2">
                  <History className="w-6 h-6 text-white" />
                  <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
                    Watch history
                  </h1>
                </div>
                {historyVideos.length > 0 && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('yt_clone_history');
                      refreshAllData();
                    }}
                    className="text-xs text-[#3ea6ff] hover:underline"
                  >
                    Clear all watch history
                  </button>
                )}
              </div>

              {historyVideos.length === 0 ? (
                <div className="p-16 text-center text-[#aaaaaa]">
                  <p className="text-base font-semibold text-neutral-300">This list has no videos.</p>
                  <p className="text-xs text-neutral-500 mt-1">Videos you watch will show up here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {historyVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      categories={categories}
                      onSelectVideo={handleSelectVideo}
                      onChannelClick={() => navigateTo('profile')}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : currentView === 'watch-later' ? (
            /* WATCH LATER VIEW */
            <div className="max-w-[1780px] mx-auto px-3 sm:px-6 py-4 space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <Clock className="w-6 h-6 text-white" />
                <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
                  Watch Later ({watchLaterVideos.length})
                </h1>
              </div>

              {watchLaterVideos.length === 0 ? (
                <div className="p-16 text-center text-[#aaaaaa]">
                  <p className="text-base font-semibold text-neutral-300">No videos in Watch Later.</p>
                  <p className="text-xs text-neutral-500 mt-1">Click the clock icon on any video thumbnail to save it for later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {watchLaterVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      categories={categories}
                      onSelectVideo={handleSelectVideo}
                      onChannelClick={() => navigateTo('profile')}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : currentView === 'liked-videos' ? (
            /* LIKED VIDEOS VIEW */
            <div className="max-w-[1780px] mx-auto px-3 sm:px-6 py-4 space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <ThumbsUp className="w-6 h-6 text-white" />
                <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
                  Liked videos ({likedVideos.length})
                </h1>
              </div>

              {likedVideos.length === 0 ? (
                <div className="p-16 text-center text-[#aaaaaa]">
                  <p className="text-base font-semibold text-neutral-300">No liked videos yet.</p>
                  <p className="text-xs text-neutral-500 mt-1">Tap the thumbs up button on any video to add it to this list.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {likedVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      categories={categories}
                      onSelectVideo={handleSelectVideo}
                      onChannelClick={() => navigateTo('profile')}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : currentView === 'profile' ? (
            /* AUTHENTIC YOUTUBE CHANNEL PAGE */
            <ProfileChannelPage
              profile={profile}
              videos={videos.filter((v) => v.published)}
              categories={categories}
              settings={settings}
              onSelectVideo={handleSelectVideo}
              onSelectShort={(s) => setActiveShort(s)}
              onOpenHireModal={() => setIsHireModalOpen(true)}
            />
          ) : (
            /* AUTHENTIC YOUTUBE HOME FEED */
            <HomeFeed
              videos={videos}
              categories={categories}
              profile={profile}
              settings={settings}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectVideo={handleSelectVideo}
              onSelectShort={(s) => setActiveShort(s)}
              onOpenHireModal={() => setIsHireModalOpen(true)}
              onNavigate={navigateTo}
            />
          )}
        </main>
      </div>

      {/* Authentic YouTube Mobile Bottom Navigation */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenCreate={() => setIsHireModalOpen(true)}
      />

      {/* YouTube Shorts Vertical Modal Player */}
      {activeShort && (
        <ShortsPlayerModal
          shorts={videos.filter((v) => v.published && v.videoType === 'short')}
          currentShort={activeShort}
          profile={profile}
          onClose={() => setActiveShort(null)}
          onSelectShort={(s) => setActiveShort(s)}
          onOpenHireModal={() => {
            setActiveShort(null);
            setIsHireModalOpen(true);
          }}
        />
      )}

      {/* Client Inquiry / Hire Modal */}
      <ContactHireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        profile={profile}
        settings={settings}
        onInquirySubmitted={() => {
          refreshAllData();
        }}
      />
    </div>
  );
}
