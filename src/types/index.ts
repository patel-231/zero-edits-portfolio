export type VideoType = 'short' | 'long' | 'featured_project';
export type VideoSourceType = 'youtube' | 'direct' | 'vimeo';

export interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  content: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
}

export interface BeforeAfterGrade {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  description?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoType: VideoType;
  videoSourceType: VideoSourceType;
  videoUrl: string;
  thumbnailUrl: string;
  posterUrl?: string;
  duration: string;
  views: number;
  likes: number;
  dislikes?: number;
  published: boolean;
  featured: boolean;
  displayOrder: number;
  publishedAt: string;
  categoryIds: string[];
  channelName: string;
  channelAvatar: string;
  channelSubscribers: string;
  channelHandle: string;
  isSubscribed?: boolean;
  commentsCount: number;
  comments?: CommentItem[];
  clientName?: string;
  clientContribution?: string;
  techniquesUsed?: string[];
  beforeAfterGrade?: BeforeAfterGrade;
  testimonial?: {
    client: string;
    role: string;
    quote: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
}

export interface EditingTool {
  name: string;
  category: 'NLE' | 'VFX & Motion' | 'Color' | 'Audio' | '3D';
  proficiency: number; // 1-100
  experienceYears: number;
}

export interface CreatorProfile {
  id: string;
  displayName: string;
  handle: string;
  professionalTitle: string;
  avatarUrl: string;
  bannerUrl: string;
  shortBio: string;
  fullBio: string;
  subscribersCount: string;
  experienceYears: number;
  projectsCompleted: number;
  skills: string[];
  tools: EditingTool[];
  email: string;
  whatsapp: string;
  location: string;
  availabilityStatus: 'available' | 'busy' | 'booked_out';
  availabilityText: string;
  preferredProjectTypes: string[];
  socialLinks: {
    platform: 'youtube' | 'instagram' | 'linkedin' | 'x' | 'github' | 'vimeo';
    url: string;
    label: string;
  }[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  accentColor: 'red' | 'amber' | 'blue' | 'emerald' | 'purple';
  theme: 'dark' | 'light';
  heroVideoId: string;
  footerText: string;
  contactSettings: {
    enableInquiries: boolean;
    directEmail: string;
    whatsappNumber: string;
    bookingNotice?: string;
  };
  sectionVisibility: {
    heroSection: boolean;
    shortsShelf: boolean;
    recentVideos: boolean;
    featuredProjects: boolean;
    statsStrip: boolean;
    hireCallToAction: boolean;
  };
}

export interface ProjectInquiry {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  message: string;
  referenceUrl?: string;
  status: 'new' | 'reviewed' | 'contacted' | 'completed' | 'archived';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor';
  lastLogin?: string;
}
