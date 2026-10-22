import { VideoItem, Category, CreatorProfile, SiteSettings, ProjectInquiry, CommentItem } from '../types';

// Asset references generated via generate_image
export const ASSETS = {
  heroAutomotive: '/src/assets/images/hero_automotive_edit_1792601742628.jpg',
  shortGlitch: '/src/assets/images/short_cyber_glitch_1792601743227.jpg',
  projectDocumentary: '/src/assets/images/project_documentary_grade_1792601742619.jpg',
  creatorAvatar: '/src/assets/images/creator_avatar_editor_1792601743062.jpg',
};

// Video editing portfolio category filters
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-all', name: 'All Work', slug: 'all', displayOrder: 0 },
  { id: 'cat-shorts', name: 'Shorts & Reels', slug: 'shorts', displayOrder: 1 },
  { id: 'cat-commercials', name: 'Commercials & Ads', slug: 'commercials', displayOrder: 2 },
  { id: 'cat-color-grading', name: 'Color Grading', slug: 'color-grading', displayOrder: 3 },
  { id: 'cat-documentaries', name: 'Documentary & Travel', slug: 'documentary', displayOrder: 4 },
  { id: 'cat-youtube', name: 'YouTube Retainers', slug: 'youtube-edits', displayOrder: 5 },
  { id: 'cat-sound', name: 'Sound Design', slug: 'sound-design', displayOrder: 6 },
  { id: 'cat-music', name: 'Music Videos', slug: 'music-videos', displayOrder: 7 },
];

export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c-1',
    authorName: 'Marcus V.',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    authorHandle: '@marcus_cine',
    content: 'The speed ramps and audio ducking at 01:24 are insane! What plug-ins do you use for the motion blur on transitions?',
    timestamp: '2 days ago',
    likes: 42,
  },
  {
    id: 'c-2',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    authorHandle: '@elenacolorist',
    content: 'That Kodak 2383 LUT recreation in ACES color space is spot on. Clean skin tone line preservation in the highlights!',
    timestamp: '5 days ago',
    likes: 18,
  },
  {
    id: 'c-3',
    authorName: 'Liam Chen',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
    authorHandle: '@liamcreates',
    content: 'Bro you literally never miss. Need a full tutorial on the sound design layering you did for this commercial.',
    timestamp: '1 week ago',
    likes: 31,
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'HYPERCAR NOCTURNE: 4K Commercial Night Run Edit (ARRI Alexa Mini LF)',
    slug: 'hypercar-nocturne-commercial-night-run',
    description: 'A cinematic nocturnal automotive commercial spec film edited in DaVinci Resolve Studio & Premiere Pro. Custom ACEScc color grading pipeline, rhythmic velocity curves matched to a sub-bass sound design score, and anamorphic lens flare simulation.\n\n00:00 - Intro & Engine Ignition\n00:45 - High Speed Tunnel Run\n01:30 - Rain Reflections & Neon Grading\n02:40 - Final Master Climax\n\nDirected & Edited by Alex Vance\nSound Design: Foley FX & Sub Drops\nMastered in Rec.709 & HDR DCI-P3',
    videoType: 'featured_project',
    videoSourceType: 'direct',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: ASSETS.heroAutomotive,
    posterUrl: ASSETS.heroAutomotive,
    duration: '03:45',
    views: 482000,
    likes: 34200,
    dislikes: 120,
    published: true,
    featured: true,
    displayOrder: 1,
    publishedAt: '2026-10-14',
    categoryIds: ['cat-cinematic', 'cat-automotive', 'cat-color-grading'],
    channelName: 'Alex Vance Film & Color',
    channelAvatar: ASSETS.creatorAvatar,
    channelSubscribers: '248K',
    channelHandle: '@alexvance',
    isSubscribed: true,
    commentsCount: 384,
    comments: INITIAL_COMMENTS,
    clientName: 'Apex Motorworks',
    clientContribution: 'Lead Editor, Sound Designer & Master Colorist',
    techniquesUsed: [
      'DaVinci Resolve ACEScc Color Pipeline',
      'Non-linear Speed Ramping & Optical Flow',
      'Multi-layer Foley & Binaural Engine Sound Design',
      'Custom Film Halation & 35mm Grain Emulation'
    ],
    beforeAfterGrade: {
      beforeUrl: ASSETS.heroAutomotive,
      afterUrl: ASSETS.heroAutomotive,
      beforeLabel: 'Flat LOG-C Profile',
      afterLabel: 'Final Film Grade (Kodak 2383 D65)',
      description: 'Extracted maximum dynamic range in the highlights, balanced rain reflection speculars, and sculpted deep cool shadows.'
    }
  },
  {
    id: 'short-1',
    title: '3 Sound Design Layers That Make Edits Hit 10x Harder 🔥 #shorts',
    slug: '3-sound-design-layers-for-punchy-edits',
    description: 'Stop using single whooshes! Combine sub-drops, tactile whoosh-hits, and textured ambient risers to make your video transitions visceral. #editing #davinciresolve #sounddesign',
    videoType: 'short',
    videoSourceType: 'direct',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: ASSETS.shortGlitch,
    posterUrl: ASSETS.shortGlitch,
    duration: '00:48',
    views: 1245000,
    likes: 98400,
    dislikes: 310,
    published: true,
    featured: true,
    displayOrder: 2,
    publishedAt: '2026-10-18',
    categoryIds: ['cat-shorts', 'cat-sound', 'cat-video-editing'],
    channelName: 'Alex Vance Film & Color',
    channelAvatar: ASSETS.creatorAvatar,
    channelSubscribers: '248K',
    channelHandle: '@alexvance',
    isSubscribed: true,
    commentsCount: 890,
    comments: [
      {
        id: 'cs-1',
        authorName: 'Jake R.',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake',
        authorHandle: '@jake_fx',
        content: 'That sub-bass drop at the end gave me chills. Great tip!',
        timestamp: '1 day ago',
        likes: 120,
      }
    ],
    clientName: 'Creator Tip',
    techniquesUsed: ['Kinetic Typography', 'Glitch Compositing', 'Audio Frequency Separation']
  },
  {
    id: 'short-2',
    title: 'Cyberpunk Kinetic Typography Reel (After Effects Breakdown) ⚡',
    slug: 'cyberpunk-kinetic-typography-after-effects',
    description: 'Fast-paced streetwear and music festival promo video breakdown featuring displacement maps, chromatic aberration, and beat syncing. #motiongraphics #aftereffects',
    videoType: 'short',
    videoSourceType: 'direct',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: ASSETS.shortGlitch,
    posterUrl: ASSETS.shortGlitch,
    duration: '00:35',
    views: 893000,
    likes: 67200,
    dislikes: 180,
    published: true,
    featured: true,
    displayOrder: 3,
    publishedAt: '2026-10-12',
    categoryIds: ['cat-shorts', 'cat-after-effects', 'cat-video-editing'],
    channelName: 'Alex Vance Film & Color',
    channelAvatar: ASSETS.creatorAvatar,
    channelSubscribers: '248K',
    channelHandle: '@alexvance',
    isSubscribed: true,
    commentsCount: 420,
  },
  {
    id: 'short-3',
    title: 'How to Match Two Different Cameras in 30 Seconds 🎨',
    slug: 'color-grading-shot-matching-quick-tip',
    description: 'How to use waveform RGB parade and vector scope to seamlessly match Sony and Canon footage under changing sunlight. #colorgrading #tutorial',
    videoType: 'short',
    videoSourceType: 'direct',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: ASSETS.projectDocumentary,
    posterUrl: ASSETS.projectDocumentary,
    duration: '00:54',
    views: 1560000,
    likes: 124000,
    dislikes: 420,
    published: true,
    featured: true,
    displayOrder: 4,
    publishedAt: '2026-10-09',
    categoryIds: ['cat-shorts', 'cat-color-grading', 'cat-davinci'],
    channelName: 'Alex Vance Film & Color',
    channelAvatar: ASSETS.creatorAvatar,
    channelSubscribers: '248K',
    channelHandle: '@alexvance',
    isSubscribed: true,
    commentsCount: 910,
  },
  {
    id: 'vid-2',
    title: 'SILENT PEAKS: 4K Cinematic Scottish Highlands Documentary Short',
    slug: 'silent-peaks-scottish-highlands-documentary',
    description: 'Award-winning nature and climate documentary short exploring remote valleys and historic mountain trails of the Scottish Highlands.\n\nPaced with deliberate contemplation, rich organic acoustic soundscapes, and natural golden hour grades on RED 8K Monstro sensor.\n\nGraded in DaVinci Resolve with custom film emulation.\nAudio mix mastered for 5.1 Surround & Stereo binaural delivery.',
    videoType: 'long',
    videoSourceType: 'direct',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: ASSETS.projectDocumentary,
    posterUrl: ASSETS.projectDocumentary,
    duration: '14:28',
    views: 341000,
    likes: 28900,
    dislikes: 90,
    published: true,
    featured: true,
    displayOrder: 5,
    publishedAt: '2026-09-28',
    categoryIds: ['cat-cinematic', 'cat-documentaries', 'cat-color-grading'],
    channelName: 'Terra Vision Cinema',
    channelAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Terra',
    channelSubscribers: '512K',
    channelHandle: '@terravision',
    isSubscribed: false,
    commentsCount: 512,
    comments: [
      {
        id: 'c-4',
        authorName: 'Sarah Jenkins',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        authorHandle: '@sarahj_photo',
        content: 'The mist rolling over the glen at 08:12 is pure poetry. Incredible color work!',
        timestamp: '3 weeks ago',
        likes: 85,
      }
    ],
    clientName: 'Nordic Terra Films',
    clientContribution: 'Assembly Editor, Finishing & Master Colorist',
    techniquesUsed: [
      'Documentary Story Pacing & Archival Integration',
      'RED Raw 8K Footage Optimization',
      'Spatial Stereo-to-5.1 Audio Mastering',
      'Custom LUT Generation for Broadcast Delivery'
    ]
  },
  {
    id: 'vid-3',
    title: 'The Ultimate Video Editing Studio Tour 2026 — DaVinci & OLED Suite',
    slug: 'ultimate-video-editing-rig-2026-studio-tour',
    description: 'Full walkthrough of my post-production suite: custom DaVinci color grading console, dual calibrated OLED reference displays, Genelec studio monitors, and high-speed NVMe RAID arrays for instant 8K real-time playback.\n\n00:00 - Introduction & Studio Architecture\n02:30 - Color Grading Panel & OLED Displays\n06:15 - Audio Interface & Acoustic Treatment\n11:00 - Cable Management & Storage Arrays\n15:45 - Software Ecosystem & Shortcuts',
    videoType: 'long',
    videoSourceType: 'direct',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: ASSETS.creatorAvatar,
    posterUrl: ASSETS.creatorAvatar,
    duration: '18:15',
    views: 678000,
    likes: 54100,
    dislikes: 210,
    published: true,
    featured: false,
    displayOrder: 6,
    publishedAt: '2026-09-15',
    categoryIds: ['cat-gear', 'cat-video-editing'],
    channelName: 'Alex Vance Film & Color',
    channelAvatar: ASSETS.creatorAvatar,
    channelSubscribers: '248K',
    channelHandle: '@alexvance',
    isSubscribed: true,
    commentsCount: 940,
  },
  {
    id: 'vid-4',
    title: 'KAI URBAN: Autumn 2026 High-Energy Streetwear Campaign',
    slug: 'kai-urban-autumn-winter-2026-fashion-campaign',
    description: 'Fast-paced, stylish commercial edit for a contemporary Japanese-inspired streetwear line. Combining 16mm film footage with high-framerate RED footage, split screens, and bespoke audio transitions.\n\nClient: KAI Brand Lab\nDirector: Kenji Sato\nEditor: Alex Vance',
    videoType: 'featured_project',
    videoSourceType: 'direct',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: ASSETS.shortGlitch,
    posterUrl: ASSETS.shortGlitch,
    duration: '01:30',
    views: 924000,
    likes: 81000,
    dislikes: 150,
    published: true,
    featured: true,
    displayOrder: 7,
    publishedAt: '2026-10-02',
    categoryIds: ['cat-music-videos', 'cat-after-effects', 'cat-cinematic'],
    channelName: 'KAI Brand Lab Official',
    channelAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=KAI',
    channelSubscribers: '180K',
    channelHandle: '@kaiofficial',
    isSubscribed: false,
    commentsCount: 620,
    clientName: 'KAI Brand Lab',
    clientContribution: 'Creative Editor & Motion Designer',
    techniquesUsed: ['16mm Film Grain & Gate Weave', 'Rhythmic Match Cuts', 'Soundtrack Syncing'],
  }
];

export const INITIAL_PROFILE: CreatorProfile = {
  id: 'profile-1',
  displayName: 'Alex Vance',
  handle: '@alexvance',
  professionalTitle: 'Senior Video Editor & Master Colorist',
  avatarUrl: ASSETS.creatorAvatar,
  bannerUrl: ASSETS.heroAutomotive,
  shortBio: 'Commercial narrative editor, ACES colorist, and motion designer. 250M+ total views across global campaigns.',
  fullBio: 'With 8+ years in commercial post-production, I craft high-retention video content, broadcast-grade color grading, and visceral sound design for brands, agencies, and top creators worldwide.',
  subscribersCount: '248K',
  experienceYears: 8,
  projectsCompleted: 140,
  skills: [
    'Commercial Narrative Editing',
    'ACES Color Grading (DaVinci Resolve)',
    'High-Retention Short-form Pacing',
    'Tactile Sound Design & Foley Mixing',
    'Kinetic Typography & Motion Graphics',
    'Multi-Camera Assembly & Sync'
  ],
  tools: [
    { name: 'DaVinci Resolve Studio', category: 'Color', proficiency: 98, experienceYears: 7 },
    { name: 'Adobe Premiere Pro', category: 'NLE', proficiency: 95, experienceYears: 8 },
    { name: 'Adobe After Effects', category: 'VFX & Motion', proficiency: 90, experienceYears: 6 },
    { name: 'Avid Media Composer', category: 'NLE', proficiency: 85, experienceYears: 5 },
    { name: 'Blender 3D', category: '3D', proficiency: 80, experienceYears: 4 },
  ],
  email: 'alexvance.edits@gmail.com',
  whatsapp: '+1 (555) 382-9014',
  location: 'Los Angeles, CA / Remote Worldwide',
  availabilityStatus: 'available',
  availabilityText: 'Available for Q4/2026 Commercial Bookings',
  preferredProjectTypes: [
    'Commercial Brand Films & Ads',
    'High-End Documentaries & YouTube Series',
    'Viral Short-Form Retention Campaigns'
  ],
  socialLinks: [
    { platform: 'youtube', url: 'https://youtube.com', label: 'YouTube (248K)' },
    { platform: 'instagram', url: 'https://instagram.com', label: 'Instagram' },
    { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
    { platform: 'vimeo', url: 'https://vimeo.com', label: 'Vimeo' },
  ]
};

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'Zero Edits',
  tagline: 'Senior Commercial Video Editor & Master Colorist',
  logoText: 'Zero Edits',
  accentColor: 'red',
  theme: 'dark',
  heroVideoId: 'vid-1',
  footerText: '© 2026 Zero Edits · Professional Commercial Post-Production & Color Grading Studio',
  contactSettings: {
    enableInquiries: true,
    directEmail: 'ompatel787877@gmail.com',
    whatsappNumber: '+1 (555) 382-9014',
    bookingNotice: 'Currently accepting select commercial and episodic editing projects.'
  },
  sectionVisibility: {
    heroSection: true,
    shortsShelf: true,
    recentVideos: true,
    featuredProjects: true,
    statsStrip: true,
    hireCallToAction: true
  }
};

export const INITIAL_INQUIRIES: ProjectInquiry[] = [
  {
    id: 'inq-1',
    name: 'Sarah Jenkins',
    email: 'sarah@kineticstudios.co',
    projectType: 'Commercial Campaign',
    budgetRange: '$5,000 - $10,000',
    message: 'We are launching a new sustainable electric bike brand next month and need a 60s hero commercial plus 5 cutdowns for YouTube and Instagram.',
    referenceUrl: 'https://vimeo.com',
    status: 'new',
    createdAt: '2026-10-20T14:32:00Z'
  }
];

const KEYS = {
  VIDEOS: 'yt_clone_videos',
  CATEGORIES: 'yt_clone_categories',
  PROFILE: 'yt_clone_profile',
  SETTINGS: 'yt_clone_settings',
  INQUIRIES: 'yt_clone_inquiries',
  LIKED_VIDEOS: 'yt_clone_liked_videos',
  WATCH_LATER: 'yt_clone_watch_later',
  HISTORY: 'yt_clone_history',
  SUBSCRIPTIONS: 'yt_clone_subscriptions',
  ADMIN_SESSION: 'yt_clone_admin_session',
  ADMIN_CREDS: 'yt_clone_admin_creds',
};

export class StorageService {
  static getVideos(): VideoItem[] {
    try {
      const data = localStorage.getItem(KEYS.VIDEOS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_VIDEOS;
  }

  static saveVideos(videos: VideoItem[]): void {
    try {
      localStorage.setItem(KEYS.VIDEOS, JSON.stringify(videos));
    } catch (e) {
      console.warn('LocalStorage save failed, stripping heavy base64 items', e);
      try {
        const trimmed = videos.map((v) => ({
          ...v,
          thumbnailUrl:
            v.thumbnailUrl && v.thumbnailUrl.startsWith('data:') && v.thumbnailUrl.length > 300000
              ? ASSETS.heroAutomotive
              : v.thumbnailUrl,
        }));
        localStorage.setItem(KEYS.VIDEOS, JSON.stringify(trimmed));
      } catch (err) {
        console.error('Storage quota reached', err);
      }
    }
  }

  static getVideoBySlug(slug: string): VideoItem | undefined {
    const list = this.getVideos();
    return list.find((v) => v.slug === slug || v.id === slug);
  }

  static saveVideo(video: VideoItem): void {
    const videos = this.getVideos();
    const index = videos.findIndex((v) => v.id === video.id);
    if (index >= 0) {
      videos[index] = video;
    } else {
      videos.unshift(video);
    }
    this.saveVideos(videos);
  }

  static deleteVideo(id: string): void {
    const videos = this.getVideos().filter((v) => v.id !== id);
    this.saveVideos(videos);
  }

  static addComment(videoId: string, content: string, authorName = 'You', authorHandle = '@user'): CommentItem {
    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      authorName,
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=YouUser',
      authorHandle,
      content,
      timestamp: 'Just now',
      likes: 0,
    };

    const videos = this.getVideos();
    const video = videos.find((v) => v.id === videoId || v.slug === videoId);
    if (video) {
      video.comments = [newComment, ...(video.comments || [])];
      video.commentsCount = (video.commentsCount || 0) + 1;
      this.saveVideos(videos);
    }
    return newComment;
  }

  static toggleLikeVideo(videoId: string): { likes: number; hasLiked: boolean } {
    const videos = this.getVideos();
    const video = videos.find((v) => v.id === videoId || v.slug === videoId);
    let hasLiked = false;
    let likes = 0;

    const likedIds: string[] = JSON.parse(localStorage.getItem(KEYS.LIKED_VIDEOS) || '[]');
    const isAlreadyLiked = likedIds.includes(videoId);

    if (video) {
      if (isAlreadyLiked) {
        video.likes = Math.max(0, (video.likes || 1) - 1);
        hasLiked = false;
        localStorage.setItem(KEYS.LIKED_VIDEOS, JSON.stringify(likedIds.filter((id) => id !== videoId)));
      } else {
        video.likes = (video.likes || 0) + 1;
        hasLiked = true;
        localStorage.setItem(KEYS.LIKED_VIDEOS, JSON.stringify([...likedIds, videoId]));
      }
      likes = video.likes;
      this.saveVideos(videos);
    }

    return { likes, hasLiked };
  }

  static toggleSubscribe(channelName: string): boolean {
    const subs: string[] = JSON.parse(localStorage.getItem(KEYS.SUBSCRIPTIONS) || '[]');
    const isSubscribed = subs.includes(channelName);
    let nextState = false;

    if (isSubscribed) {
      localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify(subs.filter((s) => s !== channelName)));
      nextState = false;
    } else {
      localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify([...subs, channelName]));
      nextState = true;
    }

    // Update videos with this channel
    const videos = this.getVideos().map((v) => {
      if (v.channelName === channelName) {
        return { ...v, isSubscribed: nextState };
      }
      return v;
    });
    this.saveVideos(videos);

    return nextState;
  }

  static addToHistory(video: VideoItem): void {
    try {
      const history: VideoItem[] = JSON.parse(localStorage.getItem(KEYS.HISTORY) || '[]');
      const filtered = history.filter((v) => v.id !== video.id);
      localStorage.setItem(KEYS.HISTORY, JSON.stringify([video, ...filtered].slice(0, 50)));
    } catch {}
  }

  static getHistory(): VideoItem[] {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  }

  static toggleWatchLater(video: VideoItem): boolean {
    const list: VideoItem[] = JSON.parse(localStorage.getItem(KEYS.WATCH_LATER) || '[]');
    const exists = list.some((v) => v.id === video.id);
    if (exists) {
      localStorage.setItem(KEYS.WATCH_LATER, JSON.stringify(list.filter((v) => v.id !== video.id)));
      return false;
    } else {
      localStorage.setItem(KEYS.WATCH_LATER, JSON.stringify([video, ...list]));
      return true;
    }
  }

  static getWatchLater(): VideoItem[] {
    try {
      const data = localStorage.getItem(KEYS.WATCH_LATER);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  }

  static getLikedVideos(): VideoItem[] {
    try {
      const likedIds: string[] = JSON.parse(localStorage.getItem(KEYS.LIKED_VIDEOS) || '[]');
      const all = this.getVideos();
      return all.filter((v) => likedIds.includes(v.id) || likedIds.includes(v.slug));
    } catch {}
    return [];
  }

  // CATEGORIES
  static getCategories(): Category[] {
    try {
      const data = localStorage.getItem(KEYS.CATEGORIES);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_CATEGORIES;
  }

  static saveCategories(categories: Category[]): void {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  }

  // PROFILE
  static getProfile(): CreatorProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_PROFILE;
  }

  static saveProfile(profile: CreatorProfile): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  }

  // SETTINGS
  static getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_SETTINGS;
  }

  static saveSettings(settings: SiteSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }

  // INQUIRIES
  static getInquiries(): ProjectInquiry[] {
    try {
      const data = localStorage.getItem(KEYS.INQUIRIES);
      if (data) return JSON.parse(data);
    } catch {}
    return INITIAL_INQUIRIES;
  }

  static addInquiry(inquiry: Omit<ProjectInquiry, 'id' | 'createdAt' | 'status'>): ProjectInquiry {
    const newInq: ProjectInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    const inquiries = [newInq, ...this.getInquiries()];
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(inquiries));
    return newInq;
  }

  static updateInquiryStatus(id: string, status: ProjectInquiry['status']): void {
    const inquiries = this.getInquiries().map((item) =>
      item.id === id ? { ...item, status } : item
    );
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(inquiries));
  }

  static deleteInquiry(id: string): void {
    const inquiries = this.getInquiries().filter((item) => item.id !== id);
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(inquiries));
  }

  // ADMIN ACCOUNT
  static getAdminAccount() {
    try {
      const data = localStorage.getItem(KEYS.ADMIN_CREDS);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      email: 'ompatel787877@gmail.com',
      passwordHash: 'admin123456',
      name: 'Om Patel (Lead Administrator)'
    };
  }

  static setAdminPassword(newPasswordHash: string): void {
    const acc = this.getAdminAccount();
    acc.passwordHash = newPasswordHash;
    localStorage.setItem(KEYS.ADMIN_CREDS, JSON.stringify(acc));
  }

  static getAdminSession(): boolean {
    return localStorage.getItem(KEYS.ADMIN_SESSION) === 'authenticated';
  }

  static setAdminSession(auth: boolean): void {
    if (auth) {
      localStorage.setItem(KEYS.ADMIN_SESSION, 'authenticated');
    } else {
      localStorage.removeItem(KEYS.ADMIN_SESSION);
    }
  }
}
