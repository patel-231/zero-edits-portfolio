import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Download, 
  Scissors, 
  Bookmark, 
  MoreHorizontal, 
  CheckCircle2, 
  Sliders, 
  Check, 
  Send,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  X,
  Maximize2,
  Tv,
  Code2,
  Copy
} from 'lucide-react';
import { VideoItem, Category, CreatorProfile, SiteSettings, CommentItem } from '../types';
import { formatViews, formatRelativeTime, formatDriveImageUrl, getCleanYouTubeEmbedUrl } from '../utils/format';
import { StorageService } from '../services/storage';

interface VideoWatchPageProps {
  video: VideoItem;
  allVideos: VideoItem[];
  categories: Category[];
  profile: CreatorProfile;
  settings: SiteSettings;
  onSelectVideo: (video: VideoItem) => void;
  onBack: () => void;
  onOpenHireModal: () => void;
}

export const VideoWatchPage: React.FC<VideoWatchPageProps> = ({
  video,
  allVideos,
  categories,
  profile,
  settings,
  onSelectVideo,
  onBack,
  onOpenHireModal,
}) => {
  const [likes, setLikes] = useState(video.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(video.isSubscribed ?? true);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  // Comments state
  const [comments, setComments] = useState<CommentItem[]>(video.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [isCommentInputFocused, setIsCommentInputFocused] = useState(false);

  useEffect(() => {
    setLikes(video.likes);
    setHasLiked(false);
    setHasDisliked(false);
    setIsSubscribed(video.isSubscribed ?? true);
    setComments(video.comments || []);
    setIsDescExpanded(false);
    StorageService.addToHistory(video);
  }, [video.id]);

  const handleLike = () => {
    const result = StorageService.toggleLikeVideo(video.id);
    setLikes(result.likes);
    setHasLiked(result.hasLiked);
    if (result.hasLiked) setHasDisliked(false);
  };

  const handleDislike = () => {
    setHasDisliked(!hasDisliked);
    if (!hasDisliked && hasLiked) {
      setHasLiked(false);
      setLikes(Math.max(0, likes - 1));
    }
  };

  const handleToggleSubscribe = () => {
    const nextState = StorageService.toggleSubscribe(video.channelName);
    setIsSubscribed(nextState);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const posted = StorageService.addComment(video.id, newCommentText.trim());
    setComments([posted, ...comments]);
    setNewCommentText('');
    setIsCommentInputFocused(false);
  };

  const shareUrl = `${window.location.origin}?watch=${video.slug}`;
  const embedCode = `<iframe width="560" height="315" src="${shareUrl}" title="${video.title}" frameborder="0" allowfullscreen></iframe>`;

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const recommendedVideos = allVideos.filter((v) => v.id !== video.id);

  return (
    <div className="max-w-[1780px] mx-auto px-2 sm:px-6 py-4">
      {/* Mobile Back Button */}
      <button
        onClick={onBack}
        className="mb-3 md:hidden inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to feed</span>
      </button>

      {/* THEATER MODE FULL-WIDTH PLAYER CONTAINER */}
      {isTheaterMode && (
        <div className="w-full mb-6">
          <div className="relative aspect-[21/9] min-h-[380px] max-h-[70vh] w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
            {video.videoUrl.endsWith('.mp4') || video.videoUrl.startsWith('blob:') || video.videoUrl.startsWith('data:') ? (
              <video
                src={video.videoUrl}
                poster={formatDriveImageUrl(video.posterUrl || video.thumbnailUrl)}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={getCleanYouTubeEmbedUrl(video.videoUrl) || video.videoUrl.replace('watch?v=', 'embed/')}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
            
            {/* Custom Portfolio Watermark Over Clean Player */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold border border-white/10 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#ff0000]"></span>
              <span>{profile.displayName}</span>
            </div>

            <button
              onClick={() => setIsTheaterMode(false)}
              className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-black/70 hover:bg-black rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm"
            >
              <Tv className="w-4 h-4" />
              <span>Default View</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: MAIN VIDEO & DETAILS (7-8 cols or 8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* Default 16:9 Cinema Player (when not in theater mode) */}
          {!isTheaterMode && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl group">
              {video.videoUrl.endsWith('.mp4') || video.videoUrl.startsWith('blob:') || video.videoUrl.startsWith('data:') ? (
                <video
                  src={video.videoUrl}
                  poster={formatDriveImageUrl(video.posterUrl || video.thumbnailUrl)}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  src={getCleanYouTubeEmbedUrl(video.videoUrl) || video.videoUrl.replace('watch?v=', 'embed/')}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}

              {/* Custom Portfolio Watermark Over Clean Player */}
              <div className="absolute top-3 left-3 z-10 pointer-events-none flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold border border-white/10 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#ff0000]"></span>
                <span>{profile.displayName}</span>
              </div>

              {/* Theater Mode Button on Hover */}
              <button
                onClick={() => setIsTheaterMode(true)}
                className="hidden sm:flex absolute bottom-14 right-4 opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1.5 bg-black/80 hover:bg-black rounded-lg text-white text-xs font-semibold items-center gap-1.5 z-20 backdrop-blur-sm"
                title="Theater mode"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Theater</span>
              </button>
            </div>
          )}

          {/* Video Title */}
          <h1 className="text-lg sm:text-xl font-bold text-[#f1f1f1] leading-snug pt-1">
            {video.title}
          </h1>

          {/* YouTube Action Bar & Channel Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
            
            {/* Channel Info & Subscribe */}
            <div className="flex items-center gap-3">
              <img
                src={video.channelAvatar || profile.avatarUrl}
                alt={video.channelName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover bg-neutral-800"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-[#f1f1f1] truncate">
                    {video.channelName}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 fill-neutral-400/20 shrink-0" />
                </div>
                <span className="text-xs text-[#aaaaaa] block">
                  {video.channelSubscribers || '248K'} subscribers
                </span>
              </div>

              {/* Subscribe button */}
              <button
                onClick={handleToggleSubscribe}
                className={`ml-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                  isSubscribed
                    ? 'bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]'
                    : 'bg-[#f1f1f1] text-[#0f0f0f] hover:bg-white'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>

              {/* Hire Me CTA button */}
              <button
                onClick={onOpenHireModal}
                className="hidden sm:inline-flex px-3.5 py-2 rounded-full text-xs font-semibold bg-[#272727] hover:bg-[#383838] text-amber-400 border border-amber-400/30 items-center gap-1.5 transition-colors"
                title="Send project brief"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hire Editor</span>
              </button>
            </div>

            {/* Right Buttons: Segmented Like/Dislike, Share, Download */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {/* Segmented Like/Dislike Button */}
              <div className="flex items-center bg-[#272727] rounded-full overflow-hidden shrink-0">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold hover:bg-[#383838] transition-colors border-r border-[#3f3f3f] ${
                    hasLiked ? 'text-blue-400' : 'text-[#f1f1f1]'
                  }`}
                  title="I like this"
                >
                  <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                  <span className="tabular-nums font-medium">{formatViews(likes)}</span>
                </button>
                <button
                  onClick={handleDislike}
                  className={`px-3 py-2 text-xs hover:bg-[#383838] transition-colors ${
                    hasDisliked ? 'text-blue-400' : 'text-[#f1f1f1]'
                  }`}
                  title="I dislike this"
                >
                  <ThumbsDown className={`w-4 h-4 ${hasDisliked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Share button */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#272727] hover:bg-[#383838] text-xs font-semibold text-[#f1f1f1] transition-colors shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              {/* Download */}
              <button
                onClick={() => alert('Download video stream ready for production.')}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#272727] hover:bg-[#383838] text-xs font-semibold text-[#f1f1f1] transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              {/* Clip */}
              <button
                onClick={onOpenHireModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#272727] hover:bg-[#383838] text-xs font-semibold text-[#f1f1f1] transition-colors shrink-0"
              >
                <Scissors className="w-4 h-4" />
                <span>Clip / Project</span>
              </button>
            </div>
          </div>

          {/* YouTube Expandable Description Box */}
          <div className="bg-[#272727] hover:bg-[#313131] transition-colors rounded-2xl p-3.5 text-sm text-[#f1f1f1]">
            <div className="flex flex-wrap items-center gap-2 font-bold text-xs text-[#f1f1f1] mb-1.5">
              <span>{formatViews(video.views)}</span>
              <span>•</span>
              <span>{formatRelativeTime(video.publishedAt)}</span>
              <span className="text-[#3ea6ff]">#videoediting #davinciresolve #cinematic</span>
            </div>

            <p className={`text-xs sm:text-sm text-[#f1f1f1] leading-relaxed whitespace-pre-line ${
              isDescExpanded ? '' : 'line-clamp-2'
            }`}>
              {video.description}
            </p>

            {isDescExpanded && (
              <div className="mt-4 pt-3 border-t border-[#3f3f3f] space-y-3 text-xs">
                {video.clientName && (
                  <div>
                    <span className="text-[#aaaaaa] block mb-0.5">Client & Commercial Brand:</span>
                    <strong className="text-white text-sm">{video.clientName}</strong>
                  </div>
                )}
                {video.techniquesUsed && (
                  <div>
                    <span className="text-[#aaaaaa] block mb-1">Post-Production Techniques:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {video.techniquesUsed.map((t) => (
                        <span key={t} className="bg-[#1f1f1f] text-neutral-300 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="mt-2 text-xs font-bold text-[#aaaaaa] hover:text-white"
            >
              {isDescExpanded ? 'Show less' : '...more'}
            </button>
          </div>

          {/* Interactive Before & After Color Grading Comparison */}
          {video.beforeAfterGrade && (
            <div className="bg-[#212121] border border-[#303030] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Sliders className="w-4 h-4" />
                  <span>Color Grading Breakdown: Flat Log vs Final Master</span>
                </div>
                <span className="text-xs font-mono text-neutral-400">{sliderPos}% Final Grade</span>
              </div>

              <div className="relative aspect-video w-full rounded-xl overflow-hidden select-none bg-black">
                {/* Before Image */}
                <img
                  src={video.beforeAfterGrade.beforeUrl}
                  alt="Flat Raw Log Profile"
                  className="absolute inset-0 w-full h-full object-cover filter contrast-75 brightness-110 saturate-50"
                />

                {/* After Graded Image */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={video.beforeAfterGrade.afterUrl}
                    alt="Final Film Grade"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-semibold text-white">
                    {video.beforeAfterGrade.afterLabel || 'Final Master Grade'}
                  </span>
                </div>

                <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-semibold text-neutral-300">
                  {video.beforeAfterGrade.beforeLabel || 'Flat LOG Profile'}
                </span>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center shadow-lg">
                    ↔
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />
              </div>
            </div>
          )}

          {/* YouTube Interactive Comments Section */}
          <div className="pt-4 space-y-5">
            <div className="flex items-center gap-6">
              <h3 className="text-lg font-bold text-white font-sans">
                {comments.length} Comments
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#aaaaaa] font-semibold cursor-pointer">
                <span>Sort by: Top comments</span>
              </div>
            </div>

            {/* Add a comment box */}
            <form onSubmit={handlePostComment} className="flex gap-3">
              <img
                src={profile.avatarUrl}
                alt="You"
                className="w-10 h-10 rounded-full object-cover bg-neutral-800 shrink-0"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={newCommentText}
                  onFocus={() => setIsCommentInputFocused(true)}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-transparent border-b border-[#3f3f3f] focus:border-white text-sm text-[#f1f1f1] placeholder-[#888888] pb-1.5 focus:outline-none transition-colors"
                />
                {isCommentInputFocused && (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setNewCommentText('');
                        setIsCommentInputFocused(false);
                      }}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-[#f1f1f1] hover:bg-[#272727]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-[#3ea6ff] text-[#0f0f0f] hover:bg-[#65b8ff] disabled:opacity-40 disabled:hover:bg-[#3ea6ff]"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 pt-2">
              {comments.map((comm) => (
                <div key={comm.id} className="flex gap-3 text-xs sm:text-sm">
                  <img
                    src={comm.authorAvatar}
                    alt={comm.authorName}
                    className="w-9 h-9 rounded-full object-cover shrink-0 bg-neutral-800"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#f1f1f1] text-xs">
                        {comm.authorHandle}
                      </span>
                      <span className="text-[11px] text-[#aaaaaa]">
                        {comm.timestamp}
                      </span>
                    </div>
                    <p className="text-[#f1f1f1] leading-relaxed text-xs sm:text-sm">
                      {comm.content}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[#aaaaaa]">
                      <button className="flex items-center gap-1 hover:text-white">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-xs">{comm.likes || ''}</span>
                      </button>
                      <button className="hover:text-white">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <button className="text-xs font-semibold hover:text-white ml-2">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: RECOMMENDED UP NEXT VIDEOS (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Related Categories Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <span className="px-3 py-1 bg-[#f1f1f1] text-[#0f0f0f] rounded-lg text-xs font-semibold shrink-0">
              All
            </span>
            <span className="px-3 py-1 bg-[#272727] hover:bg-[#383838] text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer">
              From this channel
            </span>
            <span className="px-3 py-1 bg-[#272727] hover:bg-[#383838] text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer">
              Related
            </span>
          </div>

          {/* Up Next List */}
          <div className="space-y-3">
            {recommendedVideos.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectVideo(item)}
                className="group flex gap-2.5 cursor-pointer p-1 rounded-xl hover:bg-[#272727] transition-colors"
              >
                {/* 16:9 Thumbnail */}
                <div className="relative w-40 aspect-video rounded-xl overflow-hidden bg-[#212121] shrink-0">
                  <img
                    src={formatDriveImageUrl(item.thumbnailUrl)}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 bg-[#000000cc] text-white text-[10px] font-mono px-1 rounded tabular-nums">
                    {item.duration}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#f1f1f1] group-hover:text-white line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <div className="text-xs text-[#aaaaaa] mt-1 flex items-center gap-1">
                    <span className="truncate">{item.channelName}</span>
                    <CheckCircle2 className="w-3 h-3 text-neutral-400 shrink-0" />
                  </div>
                  <div className="text-[11px] text-[#aaaaaa] mt-0.5">
                    <span>{formatViews(item.views)}</span>
                    <span> • </span>
                    <span>{formatRelativeTime(item.publishedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* AUTHENTIC YOUTUBE SHARE DIALOG MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#282828] border border-[#3f3f3f] rounded-2xl p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3f3f3f]">
              <span className="font-bold text-sm">Share video</span>
              <button onClick={() => setIsShareModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out ${video.title}: ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#1f1f1f] hover:bg-[#333333] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  WA
                </div>
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(video.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#1f1f1f] hover:bg-[#333333] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold border border-neutral-700">
                  X
                </div>
                <span>Twitter / X</span>
              </a>

              <button
                onClick={copyEmbed}
                className="p-3 bg-[#1f1f1f] hover:bg-[#333333] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <span>{embedCopied ? 'Code Copied' : 'Embed Code'}</span>
              </button>
            </div>

            {/* Direct Link Copy Box */}
            <div className="pt-2">
              <label className="block text-[11px] text-neutral-400 mb-1">Shareable Video Link</label>
              <div className="flex items-center gap-2 bg-[#1f1f1f] border border-[#3f3f3f] rounded-xl p-1.5">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent text-xs text-white px-2 focus:outline-none"
                />
                <button
                  onClick={copyUrl}
                  className="px-4 py-1.5 bg-[#3ea6ff] hover:bg-[#65b8ff] text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
