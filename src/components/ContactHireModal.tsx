import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Mail, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles,
  PhoneCall,
  Calendar
} from 'lucide-react';
import { CreatorProfile, SiteSettings, ProjectInquiry } from '../types';
import { StorageService } from '../services/storage';
import { getAccentClasses } from '../utils/format';

interface ContactHireModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CreatorProfile;
  settings: SiteSettings;
  onInquirySubmitted?: () => void;
}

export const ContactHireModal: React.FC<ContactHireModalProps> = ({
  isOpen,
  onClose,
  profile,
  settings,
  onInquirySubmitted,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Commercial Brand Film');
  const [budgetRange, setBudgetRange] = useState('$3,000 - $5,000');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<ProjectInquiry | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const accent = getAccentClasses(settings.accentColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in your name, email, and project brief.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid business email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const saved = StorageService.addInquiry({
        name: name.trim(),
        email: email.trim(),
        projectType,
        budgetRange,
        referenceUrl: referenceUrl.trim(),
        message: message.trim(),
      });

      setIsSubmitting(false);
      setSubmittedInquiry(saved);
      if (onInquirySubmitted) {
        onInquirySubmitted();
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Failed to save inquiry. Please try again.');
    }
  };

  const handleResetAndClose = () => {
    setSubmittedInquiry(null);
    setName('');
    setEmail('');
    setMessage('');
    setReferenceUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#13151c] border border-[#262835] rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#1b1e28] text-neutral-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedInquiry ? (
          /* SUCCESS STATE */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white">Project Inquiry Received</h3>
            <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{submittedInquiry.name}</strong>. Your project brief has been logged in the CineVault system (ID: <span className="font-mono text-xs">{submittedInquiry.id}</span>). Alex will review your requirements and respond within 24 hours.
            </p>

            <div className="p-4 bg-[#171922] rounded-2xl text-left border border-neutral-700/60 max-w-md mx-auto text-xs space-y-1.5">
              <div className="text-neutral-400">
                Project Scope: <span className="text-white font-medium">{submittedInquiry.projectType}</span>
              </div>
              <div className="text-neutral-400">
                Budget Tier: <span className="text-white font-medium">{submittedInquiry.budgetRange}</span>
              </div>
              <div className="text-neutral-400">
                Confirmation sent to: <span className="text-white font-mono">{submittedInquiry.email}</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className={`mt-4 px-6 py-2.5 rounded-full text-sm font-semibold text-white ${accent.bg} ${accent.hoverBg}`}
            >
              Done
            </button>
          </div>
        ) : (
          /* INQUIRY FORM */
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Direct Commercial Booking</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Work With {profile.displayName}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Currently accepting commercial, short-form retention campaigns, and color finishing briefs.
            </p>

            {/* Quick Direct Contacts */}
            <div className="mt-4 flex flex-wrap gap-2.5 text-xs">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1c26] hover:bg-[#222533] text-neutral-300 transition-colors border border-neutral-700/50"
              >
                <Mail className="w-3.5 h-3.5 text-red-400" />
                <span>{profile.email}</span>
              </a>
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1c26] hover:bg-[#222533] text-neutral-300 transition-colors border border-neutral-700/50"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {profile.whatsapp}</span>
              </a>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full px-3.5 py-2.5 bg-[#171922] border border-[#272938] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Business Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jordan@brand.com"
                    className="w-full px-3.5 py-2.5 bg-[#171922] border border-[#272938] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#171922] border border-[#272938] rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    <option value="Commercial Brand Film">Commercial Brand Film</option>
                    <option value="Social Shorts & TikTok Campaign">Social Shorts & TikTok Campaign</option>
                    <option value="Documentary / Feature Finishing">Documentary / Feature Finishing</option>
                    <option value="YouTube Long-Form Series">YouTube Long-Form Series</option>
                    <option value="Color Grading & ACES Mastering">Color Grading & ACES Mastering</option>
                    <option value="Sound Design & Motion Graphics">Sound Design & Motion Graphics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Estimated Budget Tier
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#171922] border border-[#272938] rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    <option value="$1,500 - $3,000">$1,500 - $3,000</option>
                    <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+ Enterprise">$10,000+ Enterprise</option>
                    <option value="Hourly / Consultation">Hourly Consultation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Reference Link or Existing Footage (Optional)
                </label>
                <input
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="https://vimeo.com/... or Google Drive / Frame.io link"
                  className="w-full px-3.5 py-2.5 bg-[#171922] border border-[#272938] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Project Brief & Desired Turnaround *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your footage, target delivery date, editing style desired, and any specific requirements..."
                  className="w-full px-3.5 py-2.5 bg-[#171922] border border-[#272938] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${accent.bg} ${accent.hoverBg}`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
