import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Lock, Globe, Link2, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { Trip, tripService } from '../../services/tripService';

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  onTripUpdated?: (updated: Trip) => void;
}

export const ShareTripModal: React.FC<ShareTripModalProps> = ({
  isOpen,
  onClose,
  trip,
  onTripUpdated,
}) => {
  const [copied, setCopied] = useState(false);
  const [visibility, setVisibility] = useState<'PRIVATE' | 'SHARED_WITH_LINK' | 'PUBLIC'>(
    trip.visibility || 'PRIVATE'
  );
  const [shareToken, setShareToken] = useState<string>(trip.share_token || '');

  const shareUrl = `${window.location.origin}/trips/share/${shareToken || trip.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trip.title} — Norway Itinerary`,
          text: `Check out my Norway travel itinerary on Norway SmartLife!`,
          url: shareUrl,
        });
      } catch (err) {
        console.warn('Share cancelled or not supported:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleVisibilityChange = async (newVisibility: 'PRIVATE' | 'SHARED_WITH_LINK' | 'PUBLIC') => {
    setIsUpdating(true);
    try {
      let token = shareToken;
      if (newVisibility !== 'PRIVATE' && !token) {
        token = (await tripService.getOrGenerateShareToken(trip.id)) || '';
        setShareToken(token);
      }

      await tripService.updateTrip(trip.id, {
        visibility: newVisibility,
        share_token: token || undefined,
      });

      setVisibility(newVisibility);
      if (onTripUpdated) {
        onTripUpdated({ ...trip, visibility: newVisibility, share_token: token });
      }
    } catch (err) {
      console.error('Error changing visibility:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-midnight border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-snow"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-snow/60 hover:text-snow transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-arctic-gold/10 border border-arctic-gold/20 flex items-center justify-center text-arctic-gold">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">Share Your Itinerary</h2>
            <p className="text-xs text-snow/60 mt-0.5">Share with travel companions or family</p>
          </div>
        </div>

        {/* Privacy Selector */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-snow/70">
            Privacy & Access
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleVisibilityChange('PRIVATE')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                visibility === 'PRIVATE'
                  ? 'bg-arctic-gold/10 border-arctic-gold text-arctic-gold'
                  : 'bg-white/5 border-white/10 text-snow/60 hover:text-snow hover:border-white/20'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span className="text-xs font-bold">Private</span>
            </button>

            <button
              type="button"
              onClick={() => handleVisibilityChange('SHARED_WITH_LINK')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                visibility === 'SHARED_WITH_LINK'
                  ? 'bg-fjord-teal/20 border-fjord-teal text-fjord-teal'
                  : 'bg-white/5 border-white/10 text-snow/60 hover:text-snow hover:border-white/20'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span className="text-xs font-bold">With Link</span>
            </button>

            <button
              type="button"
              onClick={() => handleVisibilityChange('PUBLIC')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                visibility === 'PUBLIC'
                  ? 'bg-aurora-violet/20 border-aurora-violet text-aurora-violet'
                  : 'bg-white/5 border-white/10 text-snow/60 hover:text-snow hover:border-white/20'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold">Public</span>
            </button>
          </div>

          <p className="text-[11px] text-snow/50 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-fjord-teal" />
            Shared trips only display itinerary details. Your personal account data remains private.
          </p>
        </div>

        {/* Share Link Box (if link/public) */}
        {visibility !== 'PRIVATE' ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-snow/70 mb-2 block">
                Shareable Link
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="bg-transparent text-xs text-snow/80 px-2 flex-1 outline-none truncate font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-arctic-gold text-deep-night hover:bg-arctic-gold/90'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleNativeShare}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-snow font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share via App
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-snow/80 hover:text-snow font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                Preview
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-xs text-snow/60">
              This trip is currently private. Select <strong>With Link</strong> or <strong>Public</strong> to generate a shareable itinerary link.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
