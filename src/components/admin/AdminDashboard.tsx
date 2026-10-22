import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  Film, 
  BarChart2, 
  Sliders, 
  Inbox, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Check, 
  Upload, 
  Save, 
  CheckCircle2, 
  Flame,
  Search,
  Sparkles,
  Link2,
  HardDrive,
  Database,
  Info,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { VideoItem, Category, CreatorProfile, SiteSettings, ProjectInquiry, VideoType } from '../../types';
import { StorageService, ASSETS } from '../../services/storage';
import { formatViews, formatRelativeTime, formatDriveImageUrl, getCleanYouTubeEmbedUrl, resolveVideoPlayback } from '../../utils/format';
import { IndexedDbMediaService } from '../../services/indexedDbMedia';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onDataUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  onDataUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'content' | 'categories' | 'customization' | 'inquiries' | 'storage'
  >('content');

  const [videos, setVideos] = useState<VideoItem[]>(() => StorageService.getVideos());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [profile, setProfile] = useState<CreatorProfile>(() => StorageService.getProfile());
  const [settings, setSettings] = useState<SiteSettings>(() => StorageService.getSettings());
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>(() => StorageService.getInquiries());
  
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Modal State
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields in Modal
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formType, setFormType] = useState<VideoType>('long');
  const [formVideoSource, setFormVideoSource] = useState<'url' | 'local'>('url');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formThumbnailSource, setFormThumbnailSource] = useState<'drive_url' | 'local'>('drive_url');
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('');
  const [formDuration, setFormDuration] = useState('03:45');
  const [formDescription, setFormDescription] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formCategory, setFormCategory] = useState('cat-video-editing');
  const [formPublished, setFormPublished] = useState(true);

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

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
    onDataUpdated();
  };

  // Open modal for new video
  const openNewVideoModal = () => {
    setEditingVideo(null);
    setFormTitle('');
    setFormSlug('');
    setFormType('long');
    setFormVideoSource('url');
    setFormVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
    setFormThumbnailSource('drive_url');
    setFormThumbnailUrl(ASSETS.heroAutomotive);
    setFormDuration('03:45');
    setFormDescription('');
    setFormClient('');
    setFormCategory('cat-video-editing');
    setFormPublished(true);
    setIsModalOpen(true);
  };

  // Open modal for editing existing video
  const openEditVideoModal = (video: VideoItem) => {
    setEditingVideo(video);
    setFormTitle(video.title);
    setFormSlug(video.slug);
    setFormType(video.videoType);
    setFormVideoSource(video.videoUrl.startsWith('data:') || video.videoUrl.startsWith('blob:') ? 'local' : 'url');
    setFormVideoUrl(video.videoUrl);
    setFormThumbnailSource(video.thumbnailUrl.startsWith('data:') ? 'local' : 'drive_url');
    setFormThumbnailUrl(video.thumbnailUrl);
    setFormDuration(video.duration);
    setFormDescription(video.description);
    setFormClient(video.clientName || '');
    setFormCategory(video.categoryIds[0] || 'cat-video-editing');
    setFormPublished(video.published);
    setIsModalOpen(true);
  };

  // Handle local video file upload from device
  const handleLocalVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileKey = `video-blob-${Date.now()}`;
        const objectUrl = await IndexedDbMediaService.saveMediaBlob(fileKey, file);
        setFormVideoUrl(objectUrl);
        setFormVideoSource('local');
        showNotice(`Local video "${file.name}" saved to persistent media storage!`);
      } catch (err) {
        const objectUrl = URL.createObjectURL(file);
        setFormVideoUrl(objectUrl);
        setFormVideoSource('local');
        showNotice(`Local video "${file.name}" loaded!`);
      }
    }
  };

  // Handle local thumbnail upload from device
  const handleLocalThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormThumbnailUrl(reader.result);
          setFormThumbnailSource('local');
          showNotice(`Thumbnail image loaded from device!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formVideoUrl.trim()) {
      showNotice('Please provide a video title and video source', 'error');
      return;
    }

    // Convert Drive link if provided
    const finalThumbnail = formThumbnailSource === 'drive_url'
      ? formatDriveImageUrl(formThumbnailUrl.trim())
      : formThumbnailUrl;

    const newVideo: VideoItem = {
      id: editingVideo?.id || `vid-${Date.now()}`,
      title: formTitle.trim(),
      slug: formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: formDescription.trim(),
      videoType: formType,
      videoSourceType: 'direct',
      videoUrl: formVideoUrl.trim(),
      thumbnailUrl: finalThumbnail || ASSETS.heroAutomotive,
      posterUrl: finalThumbnail || ASSETS.heroAutomotive,
      duration: formDuration.trim() || '02:30',
      views: editingVideo?.views || 1000,
      likes: editingVideo?.likes || 120,
      published: formPublished,
      featured: editingVideo?.featured || false,
      displayOrder: editingVideo?.displayOrder || videos.length + 1,
      publishedAt: editingVideo?.publishedAt || new Date().toISOString().split('T')[0],
      categoryIds: [formCategory],
      channelName: profile.displayName,
      channelAvatar: profile.avatarUrl,
      channelSubscribers: profile.subscribersCount,
      channelHandle: profile.handle,
      commentsCount: editingVideo?.commentsCount || 0,
      clientName: formClient.trim(),
    };

    StorageService.saveVideo(newVideo);
    refreshData();
    setIsModalOpen(false);
    showNotice(`Video "${newVideo.title}" saved successfully!`);
  };

  // Delete video
  const handleDeleteVideo = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      StorageService.deleteVideo(id);
      refreshData();
      showNotice(`Video deleted.`);
    }
  };

  // Toggle publish
  const handleTogglePublish = (video: VideoItem) => {
    const updated = { ...video, published: !video.published };
    StorageService.saveVideo(updated);
    refreshData();
    showNotice(`"${video.title}" ${updated.published ? 'published' : 'saved to drafts'}.`);
  };

  // Profile avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const updated = { ...profile, avatarUrl: reader.result };
          setProfile(updated);
          StorageService.saveProfile(updated);
          refreshData();
          showNotice('Channel avatar updated from your device!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile banner upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const updated = { ...profile, bannerUrl: reader.result };
          setProfile(updated);
          StorageService.saveProfile(updated);
          refreshData();
          showNotice('Channel banner updated from your device!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);
  const totalLikes = videos.reduce((acc, v) => acc + (v.likes || 0), 0);
  const pendingInquiries = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col font-sans select-none">
      
      {/* 1. TOP STUDIO BAR (DIRECT /zero ENTRY - NO PASSWORD REQUIRED) */}
      <header className="h-14 bg-[#282828] border-b border-[#3f3f3f] px-4 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <svg className="w-7 h-5 fill-[#ff0000]" viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M27.4 3.1c-.3-1.2-1.2-2.1-2.4-2.4C22.9 0 14 0 14 0S5.1 0 3 .7C1.8 1 0.9 1.9.6 3.1 0 5.2 0 10 0 10s0 4.8.6 6.9c.3 1.2 1.2 2.1 2.4 2.4 2.1.7 11 .7 11 .7s8.9 0 11-.7c1.2-.3 2.1-1.2 2.4-2.4.6-2.1.6-6.9.6-6.9s0-4.8-.6-6.9z" />
              <polygon points="11.2,14.3 18.5,10 11.2,5.7" fill="#ffffff" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-white">Zero Studio</span>
          </div>
          <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
            /zero Direct Admin
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openNewVideoModal}
            className="px-3.5 py-1.5 rounded-full bg-[#ff0000] hover:bg-[#cc0000] text-white text-xs font-semibold flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Video</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="px-3 py-1.5 rounded-lg bg-[#383838] hover:bg-[#484848] text-xs font-medium text-white flex items-center gap-1.5"
            title="Return to public website"
          >
            <span>Exit to Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Notice Toast */}
      {notice && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 ${
          notice.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice.message}</span>
        </div>
      )}

      {/* 2. MAIN STUDIO WORKSPACE */}
      <div className="flex-1 flex w-full">
        
        {/* Left Studio Sidebar Navigation */}
        <aside className="w-60 bg-[#282828] border-r border-[#3f3f3f] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#3f3f3f] flex flex-col items-center text-center">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-neutral-600 mb-2"
            />
            <h4 className="font-bold text-sm text-white truncate max-w-full">{profile.displayName}</h4>
            <span className="text-xs text-neutral-400">{profile.handle}</span>
          </div>

          <nav className="flex-1 p-2 space-y-0.5 text-xs font-medium overflow-y-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'content' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4" />
                <span>All Videos & Shorts</span>
              </div>
              <span className="bg-[#1f1f1f] text-neutral-300 px-1.5 py-0.5 rounded font-mono text-[10px]">
                {videos.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('customization')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'customization' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Channel & Branding</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'categories' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Pill Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'inquiries' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
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
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'dashboard' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview Metrics</span>
            </button>

            <button
              onClick={() => setActiveTab('storage')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'storage' ? 'bg-[#383838] text-[#ff0000] font-bold' : 'text-neutral-300 hover:bg-[#383838] hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Database & Storage Info</span>
            </button>
          </nav>

          <div className="p-3 border-t border-[#3f3f3f] text-[11px] text-neutral-400">
            <span className="text-emerald-400 font-semibold block">● Direct /zero Session Active</span>
            <span>Zero login friction</span>
          </div>
        </aside>

        {/* Right Main Panel */}
        <main className="flex-1 bg-[#1f1f1f] p-4 sm:p-6 overflow-y-auto">
          
          {/* TAB 1: ALL VIDEOS & SHORTS */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Videos & Shorts Management</h1>
                  <p className="text-xs text-neutral-400">
                    Upload from local device, embed YouTube cleanly without logos, or paste Drive links.
                  </p>
                </div>
                <button
                  onClick={openNewVideoModal}
                  className="px-4 py-2 rounded-lg bg-[#ff0000] hover:bg-[#cc0000] text-white text-xs font-bold flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload / Add Video</span>
                </button>
              </div>

              {/* Video List */}
              <div className="bg-[#282828] border border-[#3f3f3f] rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-12 gap-3 p-3 border-b border-[#3f3f3f] text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                  <div className="col-span-6">Video / Project</div>
                  <div className="col-span-2">Format</div>
                  <div className="col-span-2">Status</div>
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
                          <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">{formatViews(vid.views)} · {vid.likes} likes</span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          vid.videoType === 'short' ? 'bg-red-500/20 text-red-400' : 'bg-neutral-800 text-neutral-300'
                        }`}>
                          {vid.videoType === 'short' ? '9:16 Short' : '16:9 Video'}
                        </span>
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

                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditVideoModal(vid)}
                          className="p-1.5 rounded hover:bg-[#484848] text-neutral-300 hover:text-white"
                          title="Edit video"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.id, vid.title)}
                          className="p-1.5 rounded hover:bg-red-900/40 text-red-400"
                          title="Delete video"
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

          {/* TAB 2: CHANNEL & BRANDING */}
          {activeTab === 'customization' && (
            <div className="max-w-2xl space-y-5">
              <h1 className="text-xl font-bold tracking-tight">Channel & Website Branding</h1>
              
              {/* Avatar and Banner from Device */}
              <div className="p-4 bg-[#282828] border border-[#3f3f3f] rounded-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Profile Images (Upload Directly from Device)
                </h3>
                
                <div className="flex items-center gap-4">
                  <img src={profile.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-neutral-600" />
                  <div>
                    <span className="text-xs text-neutral-300 block mb-1">Channel Avatar Photo</span>
                    <input
                      ref={avatarFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#383838] hover:bg-[#484848] text-white rounded text-xs flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Avatar from Device</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#383838]">
                  <span className="text-xs text-neutral-300 block mb-1">Channel Panoramic Banner</span>
                  <input
                    ref={bannerFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#383838] hover:bg-[#484848] text-white rounded text-xs flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Banner from Device</span>
                  </button>
                </div>
              </div>

              {/* Info Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  StorageService.saveProfile(profile);
                  refreshData();
                  showNotice('Channel branding saved!');
                }}
                className="space-y-4 text-xs bg-[#282828] border border-[#3f3f3f] p-4 rounded-xl"
              >
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Channel Name</label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Channel Handle</label>
                  <input
                    type="text"
                    value={profile.handle}
                    onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Subscriber Count Text</label>
                  <input
                    type="text"
                    value={profile.subscribersCount}
                    onChange={(e) => setProfile({ ...profile, subscribersCount: e.target.value })}
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Short Introduction</label>
                  <input
                    type="text"
                    value={profile.shortBio}
                    onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Full Biography & Creative Approach</label>
                  <textarea
                    rows={4}
                    value={profile.fullBio}
                    onChange={(e) => setProfile({ ...profile, fullBio: e.target.value })}
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold rounded-lg text-xs"
                >
                  Save Channel Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4 max-w-xl">
              <h1 className="text-xl font-bold tracking-tight">Category Taxonomy</h1>
              <p className="text-xs text-neutral-400">These pills appear at the top of the YouTube feed.</p>
              
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <div key={cat.id} className="p-3 bg-[#282828] border border-[#3f3f3f] rounded-lg flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{cat.name}</span>
                    <span className="font-mono text-neutral-400">Order #{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CLIENT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold tracking-tight">Client Project Inquiries</h1>
                <span className="text-xs font-mono text-neutral-400">{inquiries.length} total</span>
              </div>

              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-4 bg-[#282828] border border-[#3f3f3f] rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-[#383838]">
                      <div>
                        <strong className="text-white text-sm">{inq.name}</strong>
                        <span className="text-neutral-400 ml-2 font-mono">({inq.email})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-mono font-bold">{inq.budgetRange}</span>
                        <button
                          onClick={() => {
                            StorageService.deleteInquiry(inq.id);
                            refreshData();
                            showNotice('Inquiry removed');
                          }}
                          className="p-1 text-neutral-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-neutral-200">{inq.message}</p>
                    {inq.referenceUrl && (
                      <div className="text-neutral-400 text-[11px]">
                        Reference: <a href={inq.referenceUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{inq.referenceUrl}</a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: OVERVIEW METRICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5 max-w-4xl">
              <h1 className="text-xl font-bold tracking-tight">Platform Telemetry</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-[#282828] border border-[#3f3f3f] rounded-xl">
                  <span className="text-neutral-400 block mb-1">Total Views</span>
                  <div className="text-2xl font-bold text-white font-mono">{formatViews(totalViews)}</div>
                </div>
                <div className="p-4 bg-[#282828] border border-[#3f3f3f] rounded-xl">
                  <span className="text-neutral-400 block mb-1">Total Likes</span>
                  <div className="text-2xl font-bold text-white font-mono">{formatViews(totalLikes)}</div>
                </div>
                <div className="p-4 bg-[#282828] border border-[#3f3f3f] rounded-xl">
                  <span className="text-neutral-400 block mb-1">Total Videos</span>
                  <div className="text-2xl font-bold text-white font-mono">{videos.length}</div>
                </div>
                <div className="p-4 bg-[#282828] border border-[#3f3f3f] rounded-xl">
                  <span className="text-neutral-400 block mb-1">Pending Leads</span>
                  <div className="text-2xl font-bold text-amber-400 font-mono">{pendingInquiries}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DATABASE & STORAGE EXPLANATION (Answers user request: "And tell me this all data will store in database or something else") */}
          {activeTab === 'storage' && (
            <div className="max-w-3xl space-y-6 text-xs text-neutral-300">
              <h1 className="text-xl font-bold tracking-tight text-white">How Your Data is Stored</h1>

              <div className="p-5 bg-[#282828] border border-[#3f3f3f] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <HardDrive className="w-5 h-5 text-emerald-400" />
                  <span>Current Storage Mode: Zero-Config Client Database (Active)</span>
                </div>
                <p className="leading-relaxed">
                  Right now, all your uploaded videos, thumbnail images, channel customization, likes, comments, and inquiries are stored permanently in the **Browser Storage Engine (`localStorage`)**.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#1f1f1f] rounded-lg border border-[#383838]">
                    <strong className="text-white block mb-1">✓ Benefits of Local Storage:</strong>
                    <ul className="space-y-1 list-disc list-inside text-neutral-400">
                      <li>100% Free forever (no hosting fees or database tier bills).</li>
                      <li>Instant real-time performance without API latency.</li>
                      <li>Zero setup required: works right out of the box on Vercel.</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-[#1f1f1f] rounded-lg border border-[#383838]">
                    <strong className="text-white block mb-1">⚡ Cloud Database Option (Supabase):</strong>
                    <p className="text-neutral-400">
                      If you want edits made on your computer to automatically sync live to any visitor visiting from their phone across the world, connect a free Supabase PostgreSQL database using the provided <code className="text-white bg-[#111] px-1 rounded">supabase/schema.sql</code> file!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. UPLOAD / EDIT VIDEO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#282828] border border-[#3f3f3f] rounded-2xl p-6 text-white my-auto shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingVideo ? 'Edit Video Details' : 'Upload / Add Video to Portfolio'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Video Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Hypercar Night Drive Film"
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Custom Slug</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="auto-generated-from-title"
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Format & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Video Format</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as VideoType)}
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  >
                    <option value="long">Video (16:9 Landscape)</option>
                    <option value="short">Shorts (9:16 Vertical)</option>
                    <option value="featured_project">Commercial Showcase</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Duration (mm:ss)</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="03:45"
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2.5 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Video Source (File upload from device OR YouTube clean link) */}
              <div className="p-3 bg-[#1f1f1f] border border-[#383838] rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-white flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-[#ff0000]" />
                    <span>Video Stream Source</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormVideoSource('url')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                        formVideoSource === 'url' ? 'bg-[#ff0000] text-white' : 'bg-[#282828] text-neutral-400'
                      }`}
                    >
                      YouTube / Direct Link
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormVideoSource('local');
                        videoFileInputRef.current?.click();
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                        formVideoSource === 'local' ? 'bg-[#ff0000] text-white' : 'bg-[#282828] text-neutral-400'
                      }`}
                    >
                      Upload from Device
                    </button>
                  </div>
                </div>

                <input
                  ref={videoFileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleLocalVideoUpload}
                  className="hidden"
                />

                <input
                  type="text"
                  required
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="Paste YouTube link, Google Drive link, or MP4 URL"
                  className="w-full bg-[#282828] border border-[#3f3f3f] rounded-lg p-2 text-white font-mono"
                />

                {/* Live Video Test Preview */}
                {formVideoUrl && (
                  <div className="p-3 bg-[#161616] border border-[#333333] rounded-xl space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Live Test Player (Verify Playback Before Saving)</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono uppercase bg-[#222] px-2 py-0.5 rounded">
                        {resolveVideoPlayback(formVideoUrl).type}
                      </span>
                    </div>

                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-[#2f2f2f]">
                      {(() => {
                        const pb = resolveVideoPlayback(formVideoUrl);
                        if (pb.type === 'youtube' || pb.type === 'drive' || pb.type === 'vimeo') {
                          return (
                            <iframe
                              src={pb.embedUrl}
                              title="Live Test Preview"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full border-0"
                            />
                          );
                        }
                        return (
                          <video
                            src={pb.directUrl}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        );
                      })()}
                    </div>
                    <span className="text-[10px] text-neutral-400 block">
                      ✓ Supported: YouTube (watch/shorts/embed), Google Drive video share links, Vimeo, or local device files.
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Source (Upload from device OR Google Drive link) */}
              <div className="p-3 bg-[#1f1f1f] border border-[#383838] rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Thumbnail Image (Device Upload or Google Drive Link)</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormThumbnailSource('drive_url')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                        formThumbnailSource === 'drive_url' ? 'bg-amber-500 text-black' : 'bg-[#282828] text-neutral-400'
                      }`}
                    >
                      Google Drive Link
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormThumbnailSource('local');
                        thumbFileInputRef.current?.click();
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                        formThumbnailSource === 'local' ? 'bg-amber-500 text-black' : 'bg-[#282828] text-neutral-400'
                      }`}
                    >
                      Upload from Device
                    </button>
                  </div>
                </div>

                <input
                  ref={thumbFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLocalThumbnailUpload}
                  className="hidden"
                />

                <input
                  type="text"
                  required
                  value={formThumbnailUrl}
                  onChange={(e) => setFormThumbnailUrl(e.target.value)}
                  placeholder="Paste Google Drive link (e.g. https://drive.google.com/file/d/.../view) or image link"
                  className="w-full bg-[#282828] border border-[#3f3f3f] rounded-lg p-2 text-white font-mono"
                />
                
                {/* Thumbnail Preview */}
                {formThumbnailUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={formatDriveImageUrl(formThumbnailUrl)}
                      alt="Thumbnail Preview"
                      className="w-24 aspect-video rounded-lg object-cover border border-[#3f3f3f]"
                    />
                    <span className="text-[11px] text-emerald-400">✓ Thumbnail preview loaded</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Tell viewers about your editing techniques, cameras, or music used..."
                  className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2 text-white resize-none"
                />
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Client or Brand (Optional)</label>
                <input
                  type="text"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  placeholder="e.g. Apex Automotive, Nike, Personal Showreel"
                  className="w-full bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-2 text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600"
                />
                <span className="text-neutral-200">Set visibility to Public on website</span>
              </label>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#3f3f3f]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold"
                >
                  {editingVideo ? 'Update Video' : 'Add to Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
