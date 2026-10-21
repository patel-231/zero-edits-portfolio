import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  Music,
  CheckCircle2,
  Check
} from 'lucide-react';
import { VideoItem, CreatorProfile } from '../types';
import { formatViews } from '../utils/format';
import { StorageService } from '../services/storage';

interface ShortsPlayerModalProps {
  shorts: VideoItem[];
  currentShort: VideoItem;
  profile: CreatorProfile;
  onClose: () => void;
  onSelectShort: (short: VideoItem) => void;
  onOpenHireModal: () => void;
}

export const ShortsPlayerModal: React.FC<ShortsPlayerModalProps> = ({
  shorts,
  currentShort,
  profile,
  onClose,
  onSelectShort,
  onOpenHireModal,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likes, setLikes] = useState(currentShort.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(currentShort.isSubscribed ?? true);
  const [copied, setCopied] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(currentShort.comments || []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentIndex = shorts.findIndex((s) => s.id === currentShort.id);
  const prevShort = currentIndex > 0 ? shorts[currentIndex - 1] : null;
  const nextShort = currentIndex < shorts.length - 1 ? shorts[currentIndex + 1] : null;

  useEffect(() => {
    setLikes(currentShort.likes);
    setHasLiked(false);
    setHasDisliked(false);
    setIsSubscribed(currentShort.isSubscribed ?? true);
    setComments(currentShort.comments || []);
    setProgress(0);
    setIsPlaying(true);
  }, [currentShort.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowUp' && prevShort) onSelectShort(prevShort);
      if (e.key === 'ArrowDown' && nextShort) onSelectShort(nextShort);
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, prevShort, nextShort, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLike = () => {
    const res = StorageService.toggleLikeVideo(currentShort.id);
    setLikes(res.likes);
    setHasLiked(res.hasLiked);
    if (res.hasLiked) setHasDisliked(false);
  };

  const handleDislike = () => {
    setHasDisliked(!hasDisliked);
    if (!hasDisliked && hasLiked) {
      setHasLiked(false);
      setLikes(Math.max(0, likes - 1));
    }
  };

  const handleSubscribe = () => {
    const next = StorageService.toggleSubscribe(currentShort.channelName);
    setIsSubscribed(next);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}?watch=${currentShort.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const posted = StorageService.addComment(currentShort.id, newComment.trim());
    setComments([posted, ...comments]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Top Left Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-50 p-2 rounded-full hover:bg-[#272727] text-white transition-colors"
        title="Back (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div className="relative flex items-center justify-center w-full max-w-4xl h-full max-h-[92vh]">
        
        {/* Desktop Up/Down Chevrons */}
        <div className="hidden md:flex flex-col gap-3 mr-4">
          <button
            onClick={() => prevShort && onSelectShort(prevShort)}
            disabled={!prevShort}
            className={`p-3 rounded-full bg-[#272727] hover:bg-[#383838] text-white transition-all ${
              !prevShort ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
            }`}
            title="Previous Short"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => nextShort && onSelectShort(nextShort)}
            disabled={!nextShort}
            className={`p-3 rounded-full bg-[#272727] hover:bg-[#383838] text-white transition-all ${
              !nextShort ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
            }`}
            title="Next Short"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* 9:16 Video Player */}
        <div className="relative w-full max-w-[400px] h-full rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center border border-[#272727]">
          <video
            ref={videoRef}
            src={currentShort.videoUrl}
            poster={currentShort.posterUrl || currentShort.thumbnailUrl}
            className="w-full h-full object-cover cursor-pointer"
            autoPlay
            loop
            playsInline
            muted={isMuted}
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
          />

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

          {/* Top Audio Toggle */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 z-10"
            >
              <div className="w-16 h-16 rounded-full bg-black/70 text-white flex items-center justify-center">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Right Floating YouTube Shorts Action Rail */}
          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4 z-20 text-white">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1 group"
              title="Like"
            >
              <div className={`p-3 rounded-full transition-transform active:scale-90 ${
                hasLiked ? 'bg-[#ff0000] text-white' : 'bg-[#272727] hover:bg-[#383838] text-white'
              }`}>
                <ThumbsUp className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-xs font-semibold tabular-nums">{formatViews(likes)}</span>
            </button>

            {/* Dislike */}
            <button
              onClick={handleDislike}
              className="flex flex-col items-center gap-1 group"
              title="Dislike"
            >
              <div className={`p-3 rounded-full transition-transform active:scale-90 ${
                hasDisliked ? 'bg-[#ff0000] text-white' : 'bg-[#272727] hover:bg-[#383838] text-white'
              }`}>
                <ThumbsDown className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Dislike</span>
            </button>

            {/* Comments */}
            <button
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className="flex flex-col items-center gap-1 group"
              title="Comments"
            >
              <div className="p-3 rounded-full bg-[#272727] hover:bg-[#383838] text-white">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold tabular-nums">{comments.length}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1 group"
              title="Share"
            >
              <div className="p-3 rounded-full bg-[#272727] hover:bg-[#383838] text-white">
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
              </div>
              <span className="text-xs font-semibold">{copied ? 'Copied' : 'Share'}</span>
            </button>

            {/* Sound Icon */}
            <div className="p-2.5 rounded-lg bg-[#272727] text-white animate-spin">
              <Music className="w-4 h-4 text-neutral-300" />
            </div>
          </div>

          {/* Bottom Video Metadata */}
          <div className="absolute bottom-0 inset-x-0 p-4 pb-5 z-20 text-white">
            {/* Scrubber progress */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[#ff0000]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Channel info & subscribe button */}
            <div className="flex items-center gap-2.5 mb-2">
              <img
                src={currentShort.channelAvatar || profile.avatarUrl}
                alt={currentShort.channelName}
                className="w-8 h-8 rounded-full object-cover bg-neutral-800"
              />
              <span className="text-xs font-bold text-white truncate">
                {currentShort.channelHandle || '@alexvance'}
              </span>
              <button
                onClick={handleSubscribe}
                className={`ml-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  isSubscribed ? 'bg-[#272727] text-white' : 'bg-white text-black'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Title */}
            <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 leading-snug drop-shadow text-left">
              {currentShort.title}
            </h3>

            {/* Music track ticker */}
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#aaaaaa]">
              <Music className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="truncate">Original Audio · Alex Vance Studio Beats</span>
            </div>
          </div>
        </div>

        {/* Comments Side Drawer if opened */}
        {isCommentsOpen && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#212121] border-l border-[#303030] rounded-r-2xl z-30 p-4 flex flex-col text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#303030]">
              <h3 className="text-sm font-bold">Comments ({comments.length})</h3>
              <button onClick={() => setIsCommentsOpen(false)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
              {comments.map((c) => (
                <div key={c.id} className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-white">{c.authorName}</strong>
                    <span className="text-[10px] text-neutral-400">{c.timestamp}</span>
                  </div>
                  <p className="text-neutral-300">{c.content}</p>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleAddComment} className="pt-2 border-t border-[#303030] flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-[#121212] border border-[#303030] rounded-full px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button type="submit" className="px-3 py-1.5 bg-[#3ea6ff] text-black text-xs font-bold rounded-full">
                Post
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
