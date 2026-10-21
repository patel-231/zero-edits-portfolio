import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Film, 
  BarChart2, 
  MessageSquare, 
  Sliders, 
  Inbox, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Check, 
  Upload, 
  Eye, 
  EyeOff, 
  Save, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Clock, 
  Flame,
  Search,
  Sparkles
} from 'lucide-react';
import { VideoItem, Category, CreatorProfile, SiteSettings, ProjectInquiry, VideoType } from '../../types';
import { StorageService, ASSETS } from '../../services/storage';
import { formatViews, formatRelativeTime } from '../../utils/format';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onLogout: () => void;
  onDataUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  onLogout,
  onDataUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'content' | 'analytics' | 'comments' | 'customization' | 'inquiries' | 'settings'
  >('dashboard');

  const [videos, setVideos] = useState<VideoItem[]>(() => StorageService.getVideos());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [profile, setProfile] = useState<CreatorProfile>(() => StorageService.getProfile());
  const [settings, setSettings] = useState<SiteSettings>(() => StorageService.getSettings());
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>(() => StorageService.getInquiries());
  const [adminAccount, setAdminAccount] = useState(() => StorageService.getAdminAccount());
  
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 3000);
  };

  const refreshData = () => {
    setVideos(StorageService.getVideos());
    setCategories(StorageService.getCategories());
    setProfile(StorageService.getProfile());
    setSettings(StorageService.getSettings());
    setInquiries(StorageService.getInquiries());
    setAdminAccount(StorageService.getAdminAccount());
    onDataUpdated();
  };

  // Video Management
  const handleSaveVideo = (videoData: Partial<VideoItem>) => {
    if (!videoData.title || !videoData.videoUrl) {
      showNotice('Title and Video URL are required', 'error');
      return;
    }

    const newVideo: VideoItem = {
      id: videoData.id || `vid-${Date.now()}`,
      title: videoData.title,
      slug: videoData.slug || videoData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: videoData.description || '',
      videoType: videoData.videoType || 'long',
      videoSourceType: videoData.videoSourceType || 'direct',
      videoUrl: videoData.videoUrl,
      thumbnailUrl: videoData.thumbnailUrl || ASSETS.heroAutomotive,
      posterUrl: videoData.posterUrl || videoData.thumbnailUrl || ASSETS.heroAutomotive,
      duration: videoData.duration || '02:30',
      views: videoData.views || 1200,
      likes: videoData.likes || 140,
      published: videoData.published !== undefined ? videoData.published : true,
      featured: videoData.featured !== undefined ? videoData.featured : false,
      displayOrder: videoData.displayOrder || videos.length + 1,
      publishedAt: videoData.publishedAt || new Date().toISOString().split('T')[0],
      categoryIds: videoData.categoryIds || ['cat-video-editing'],
      channelName: profile.displayName,
      channelAvatar: profile.avatarUrl,
      channelSubscribers: profile.subscribersCount,
      channelHandle: profile.handle,
      commentsCount: 0,
      clientName: videoData.clientName || '',
    };

    StorageService.saveVideo(newVideo);
    refreshData();
    setIsAddModalOpen(false);
    setEditingVideo(null);
    showNotice(`Video "${newVideo.title}" saved successfully!`);
  };

  const handleDeleteVideo = (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      StorageService.deleteVideo(id);
      refreshData();
      showNotice(`Video deleted.`);
    }
  };

  const handleTogglePublish = (video: VideoItem) => {
    const updated = { ...video, published: !video.published };
    StorageService.saveVideo(updated);
    refreshData();
    showNotice(`"${video.title}" ${updated.published ? 'published' : 'saved as draft'}.`);
  };

  // Inquiry Management
  const handleUpdateInquiry = (id: string, status: ProjectInquiry['status']) => {
    StorageService.updateInquiryStatus(id, status);
    refreshData();
    showNotice(`Inquiry status updated to ${status}.`);
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm('Delete this inquiry record?')) {
      StorageService.deleteInquiry(id);
      refreshData();
      showNotice('Inquiry record deleted.');
    }
  };

  // Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    const acc = StorageService.getAdminAccount();
    if (currentPass !== acc.passwordHash) {
      setPassError('Current password is incorrect.');
      return;
    }
    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    StorageService.setAdminPassword(newPass);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setPassSuccess('Administrator password updated successfully!');
    refreshData();
  };

  const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);
  const totalLikes = videos.reduce((acc, v) => acc + (v.likes || 0), 0);
  const pendingInquiries = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col font-sans">
      
      {/* 1. YOUTUBE STUDIO TOP HEADER */}
      <header className="h-14 bg-[#282828] border-b border-[#3f3f3f] px-4 flex items-center justify-between gap-4 sticky top-0 z-40 select-none">
        <div className="flex items-center gap-3">
          {/* Studio Brand Icon */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <svg className="w-7 h-5 fill-[#ff0000]" viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M27.4 3.1c-.3-1.2-1.2-2.1-2.4-2.4C22.9 0 14 0 14 0S5.1 0 3 .7C1.8 1 0.9 1.9.6 3.1 0 5.2 0 10 0 10s0 4.8.6 6.9c.3 1.2 1.2 2.1 2.4 2.4 2.1.7 11 .7 11 .7s8.9 0 11-.7c1.2-.3 2.1-1.2 2.4-2.4.6-2.1.6-6.9.6-6.9s0-4.8-.6-6.9z" />
              <polygon points="11.2,14.3 18.5,10 11.2,5.7" fill="#ffffff" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-white">Studio</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] bg-red-600/30 text-red-400 border border-red-500/40 px-2 py-0.5 rounded font-mono">
            Admin Panel
          </span>
        </div>

        {/* Center Search Studio */}
        <div className="hidden md:flex items-center w-full max-w-md bg-[#1f1f1f] border border-[#3f3f3f] rounded-full px-3 py-1.5 text-xs text-neutral-300">
          <Search className="w-3.5 h-3.5 text-neutral-400 mr-2" />
          <input
            type="text"
            placeholder="Search across your channel videos and projects..."
            className="w-full bg-transparent focus:outline-none text-white text-xs"
          />
        </div>

        {/* Right Studio Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingVideo(null);
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white text-xs font-semibold flex items-center gap-1.5 shadow"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Create / Upload</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="px-3 py-1.5 rounded-lg bg-[#383838] hover:bg-[#484848] text-xs font-medium text-white flex items-center gap-1.5"
          >
            <span>View Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onLogout}
            className="p-1.5 rounded-full hover:bg-[#383838] text-neutral-400 hover:text-white"
            title="Sign out of Studio"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Notice Alert Toast */}
      {notice && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 ${
          notice.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice.message}</span>
        </div>
      )}

      {/* 2. MAIN STUDIO LAYOUT */}
      <div className="flex-1 flex w-full">
        
        {/* Left Studio Navigation Rail */}
        <aside className="w-60 bg-[#282828] border-r border-[#3f3f3f] flex flex-col shrink-0 select-none">
          {/* Creator Profile Summary */}
          <div className="p-4 border-b border-[#3f3f3f] flex flex-col items-center text-center">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-20 h-20 rounded-full object-cover border-2 border-neutral-600 mb-2"
            />
            <h4 className="font-bold text-sm text-white truncate max-w-full">{profile.displayName}</h4>
            <span className="text-xs text-neutral-400">{profile.handle}</span>
            <span className="text-[11px] text-emerald-400 mt-1 font-mono">{profile.subscribersCount} Subscribers</span>
          </div>

          {/* Studio Navigation Links */}
          <nav className="flex-1 p-2 space-y-0.5 text-xs font-medium overflow-y-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'dashboard' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'content' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Film className="w-4 h-4" />
                <span>Content (Videos)</span>
              </div>
              <span className="bg-[#1f1f1f] text-neutral-300 px-1.5 py-0.5 rounded font-mono text-[10px]">
                {videos.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'inquiries' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Inbox className="w-4 h-4" />
                <span>Client Inquiries</span>
              </div>
              {pendingInquiries > 0 && (
                <span className="bg-[#ff0000] text-white px-1.5 py-0.5 rounded-full font-bold text-[10px]">
                  {pendingInquiries}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'analytics' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('customization')}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'customization' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Customization</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'settings' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & Admin</span>
            </button>
          </nav>

          {/* Admin Email pill at bottom */}
          <div className="p-3 border-t border-[#3f3f3f] text-[11px] text-neutral-400">
            <div>Signed in as:</div>
            <strong className="text-white truncate block">{adminAccount.email}</strong>
          </div>
        </aside>

        {/* Right Main Studio Workspace Area */}
        <main className="flex-1 bg-[#1f1f1f] p-4 sm:p-6 overflow-y-auto">
          
          {/* TAB 1: CHANNEL DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl space-y-6">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Channel dashboard</h1>

              {/* 3 Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Latest Video Performance Card */}
                <div className="bg-[#282828] border border-[#3f3f3f] rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-bold text-white">Latest video performance</h3>
                  {videos[0] && (
                    <div>
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-neutral-900 mb-2">
                        <img src={videos[0].thumbnailUrl} alt={videos[0].title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-xs font-semibold text-white line-clamp-1">{videos[0].title}</h4>
                      <div className="mt-2 text-xs space-y-1 text-neutral-300">
                        <div className="flex justify-between">
                          <span>Ranking by views:</span>
                          <strong>1 of {videos.length}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Views:</span>
                          <strong className="font-mono">{formatViews(videos[0].views)}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Likes:</span>
                          <strong className="font-mono">{videos[0].likes}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Channel Analytics */}
                <div className="bg-[#282828] border border-[#3f3f3f] rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-bold text-white">Channel analytics</h3>
                  <div className="space-y-1 text-xs">
                    <span className="text-neutral-400">Current subscribers</span>
                    <div className="text-2xl font-bold text-white">{profile.subscribersCount}</div>
                    <span className="text-emerald-400 text-[11px]">+4,210 in last 28 days</span>
                  </div>

                  <div className="pt-3 border-t border-[#3f3f3f] space-y-2 text-xs">
                    <span className="text-neutral-400 font-semibold block">Summary (Lifetime)</span>
                    <div className="flex justify-between text-neutral-300">
                      <span>Total Views:</span>
                      <strong className="font-mono text-white">{formatViews(totalViews)}</strong>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Total Likes:</span>
                      <strong className="font-mono text-white">{formatViews(totalLikes)}</strong>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Published Videos:</span>
                      <strong className="font-mono text-white">{videos.filter(v => v.published).length}</strong>
                    </div>
                  </div>
                </div>

                {/* Latest Inquiries / Leads */}
                <div className="bg-[#282828] border border-[#3f3f3f] rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">Client briefs & inquiries</h3>
                    <span className="text-xs text-amber-400 font-bold">{pendingInquiries} new</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {inquiries.slice(0, 2).map((inq) => (
                      <div key={inq.id} className="p-2.5 rounded bg-[#1f1f1f] border border-[#383838]">
                        <div className="flex justify-between font-semibold text-white">
                          <span>{inq.name}</span>
                          <span className="text-emerald-400 font-mono">{inq.budgetRange}</span>
                        </div>
                        <p className="text-neutral-400 mt-1 line-clamp-1">{inq.message}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="w-full mt-2 py-1.5 bg-[#383838] hover:bg-[#484848] text-xs font-semibold rounded text-white"
                  >
                    View All Inquiries ({inquiries.length})
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingVideo(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#ff0000] hover:bg-[#cc0000] rounded-lg text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New Video</span>
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className="px-4 py-2 bg-[#282828] hover:bg-[#383838] rounded-lg text-xs font-semibold text-white border border-[#3f3f3f]"
                >
                  Manage Content Library
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2 bg-[#282828] hover:bg-[#383838] rounded-lg text-xs font-semibold text-white border border-[#3f3f3f]"
                >
                  Admin Credentials & Password
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CHANNEL CONTENT (YOUTUBE STUDIO CONTENT TABLE) */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Channel content</h1>
                  <p className="text-xs text-neutral-400">Manage, edit, publish, and delete videos and Shorts.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingVideo(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#ff0000] hover:bg-[#cc0000] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Video</span>
                </button>
              </div>

              {/* Table */}
              <div className="bg-[#282828] border border-[#3f3f3f] rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-12 gap-3 p-3 border-b border-[#3f3f3f] text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                  <div className="col-span-6">Video</div>
                  <div className="col-span-2">Visibility</div>
                  <div className="col-span-2">Views / Likes</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-[#383838]">
                  {videos.map((vid) => (
                    <div key={vid.id} className="grid grid-cols-12 gap-3 p-3 items-center hover:bg-[#303030] transition-colors">
                      <div className="col-span-6 flex gap-3 items-center min-w-0">
                        <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                          <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded font-mono">{vid.duration}</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-white truncate text-xs">{vid.title}</h4>
                          <span className="text-[11px] text-neutral-400 block line-clamp-1">{vid.description}</span>
                          <span className={`inline-block text-[9px] uppercase font-bold px-1.5 py-0.2 rounded mt-1 ${
                            vid.videoType === 'short' ? 'bg-red-500/20 text-red-400' : 'bg-neutral-800 text-neutral-300'
                          }`}>
                            {vid.videoType}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <button
                          onClick={() => handleTogglePublish(vid)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold ${
                            vid.published ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400 bg-neutral-800'
                          }`}
                        >
                          {vid.published ? '● Public' : '○ Draft'}
                        </button>
                      </div>

                      <div className="col-span-2 text-neutral-300 font-mono">
                        <div>{formatViews(vid.views)}</div>
                        <div className="text-[10px] text-neutral-400">{vid.likes} likes</div>
                      </div>

                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingVideo(vid);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 rounded hover:bg-[#484848] text-neutral-300 hover:text-white"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.id, vid.title)}
                          className="p-1.5 rounded hover:bg-red-900/40 text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLIENT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight">Client project inquiries</h1>
                <p className="text-xs text-neutral-400">Review project proposals submitted through YouTube Hire action.</p>
              </div>

              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-4 bg-[#282828] border border-[#3f3f3f] rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-[#383838]">
                      <div>
                        <strong className="text-sm text-white">{inq.name}</strong>
                        <span className="text-neutral-400 ml-2 font-mono">({inq.email})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-400 font-bold">{inq.budgetRange}</span>
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiry(inq.id, e.target.value as any)}
                          className="bg-[#1f1f1f] border border-[#3f3f3f] rounded px-2 py-1 text-xs text-white"
                        >
                          <option value="new">New</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1 text-neutral-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-neutral-200 leading-relaxed">{inq.message}</p>
                    {inq.referenceUrl && (
                      <div className="text-[11px] text-neutral-400">
                        Reference: <a href={inq.referenceUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{inq.referenceUrl}</a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-5">
              <h1 className="text-xl font-bold tracking-tight">Channel analytics & metrics</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-[#282828] border border-[#3f3f3f] rounded-xl">
                  <span className="text-neutral-400 block mb-1">Lifetime Views</span>
                  <div className="text-2xl font-bold text-white font-mono">{formatViews(totalViews)}</div>
                </div>
                <div className="p-4 bg-[#282828] border border-[#3f3f3f] rounded-xl">
                  <span className="text-neutral-400 block mb-1">Subscribers</span>
                  <div className="text-2xl font-bold text-white font-mono">{profile.subscribersCount}</div>
                </div>
                <div className="p-4 bg-[#282828] border border-[#3f3f3f] rounded-xl">
                  <span className="text-neutral-400 block mb-1">Total Comments</span>
                  <div className="text-2xl font-bold text-white font-mono">1,820</div>
                </div>
                <div className="p-4 bg-[#282828] border border-[#3f3f3f] rounded-xl">
                  <span className="text-neutral-400 block mb-1">Average View Duration</span>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">03:12</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMIZATION */}
          {activeTab === 'customization' && (
            <div className="space-y-5 max-w-2xl">
              <h1 className="text-xl font-bold tracking-tight">Channel customization</h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  StorageService.saveProfile(profile);
                  refreshData();
                  showNotice('Channel branding updated!');
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Channel Name</label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full bg-[#282828] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Channel Handle</label>
                  <input
                    type="text"
                    value={profile.handle}
                    onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
                    className="w-full bg-[#282828] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Channel Description</label>
                  <textarea
                    rows={4}
                    value={profile.fullBio}
                    onChange={(e) => setProfile({ ...profile, fullBio: e.target.value })}
                    className="w-full bg-[#282828] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold rounded-lg"
                >
                  Publish Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: SETTINGS & ADMIN INFO */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              <h1 className="text-xl font-bold tracking-tight">YouTube Studio Settings & Admin Info</h1>

              {/* Admin Information Card */}
              <div className="p-5 bg-[#282828] border border-[#3f3f3f] rounded-xl space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#383838]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ff0000] text-white font-bold flex items-center justify-center">
                      OP
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Om Patel</h3>
                      <span className="text-neutral-400">Master Super Administrator</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-semibold border border-emerald-500/20">
                    Active Authority
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Administrator Email:</span>
                    <strong className="text-white font-mono">{adminAccount.email}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Clearance:</span>
                    <strong className="text-emerald-400">Full Channel Control & Deployment</strong>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <form onSubmit={handleChangePassword} className="p-5 bg-[#282828] border border-[#3f3f3f] rounded-xl space-y-4 text-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Update Studio Password</span>
                </div>

                {passError && (
                  <div className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg">
                    {passError}
                  </div>
                )}
                {passSuccess && (
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg">
                    {passSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="Current password"
                      className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Repeat new"
                      className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold rounded-lg"
                >
                  Save New Password
                </button>
              </form>

              {/* GitHub / Vercel Environment Variables Note */}
              <div className="p-5 bg-[#282828] border border-[#3f3f3f] rounded-xl space-y-2 text-xs">
                <h4 className="font-bold text-white">Vercel & GitHub Deployment Variables</h4>
                <div className="bg-[#191919] p-3 rounded-lg font-mono text-neutral-300 space-y-1">
                  <div>VITE_APP_URL="https://your-youtube-clone.vercel.app"</div>
                  <div>ADMIN_EMAIL="ompatel787877@gmail.com"</div>
                  <div>STORAGE_PROVIDER="supabase-or-local"</div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE / UPLOAD VIDEO MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#282828] border border-[#3f3f3f] rounded-2xl p-6 text-white my-auto shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingVideo ? 'Edit Video Details' : 'Upload Video to Channel'}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);

                handleSaveVideo({
                  id: editingVideo?.id,
                  title: fd.get('title') as string,
                  slug: fd.get('slug') as string,
                  videoType: fd.get('videoType') as VideoType,
                  videoUrl: fd.get('videoUrl') as string,
                  thumbnailUrl: fd.get('thumbnailUrl') as string,
                  duration: fd.get('duration') as string,
                  description: fd.get('description') as string,
                  published: fd.get('published') === 'on',
                });
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-neutral-400 mb-1">Title (Required)</label>
                <input
                  name="title"
                  required
                  defaultValue={editingVideo?.title || ''}
                  placeholder="Add a title that describes your video"
                  className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Video Format / Type</label>
                  <select
                    name="videoType"
                    defaultValue={editingVideo?.videoType || 'long'}
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white text-xs"
                  >
                    <option value="long">Video (16:9)</option>
                    <option value="short">Shorts (9:16)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Duration (mm:ss)</label>
                  <input
                    name="duration"
                    defaultValue={editingVideo?.duration || '03:45'}
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Video File URL (Direct MP4 or YouTube embed link)</label>
                <input
                  name="videoUrl"
                  required
                  defaultValue={editingVideo?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
                  className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Thumbnail URL</label>
                <input
                  name="thumbnailUrl"
                  defaultValue={editingVideo?.thumbnailUrl || ASSETS.heroAutomotive}
                  className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingVideo?.description || ''}
                  placeholder="Tell viewers about your video..."
                  className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white text-xs resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={editingVideo ? editingVideo.published : true}
                  className="w-4 h-4 rounded text-red-600"
                />
                <span className="text-neutral-200">Set visibility to Public</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#3f3f3f]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingVideo(null);
                  }}
                  className="px-4 py-2 rounded-lg text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold"
                >
                  {editingVideo ? 'Save Changes' : 'Upload Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
