import React from 'react';
import { Sparkles, Video, Image as ImageIcon, Flame } from 'lucide-react';
import { FeaturedMedia } from '../data/pandalData';

interface FeaturedMediaSectionProps {
  media?: FeaturedMedia;
}

/**
 * Transforms standard YouTube links to embed URLs
 */
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube-nocookie.com/embed/${match[2]}?rel=0&modestbranding=1`
    : null;
}

export const FeaturedMediaSection: React.FC<FeaturedMediaSectionProps> = ({ media }) => {
  // CRITICAL REQUIREMENT: If disabled, empty, or removed, return null so zero space is left!
  if (!media || !media.enabled || !media.url || !media.url.trim()) {
    return null;
  }

  const cleanUrl = media.url.trim();
  const isVideo = media.type === 'video';
  const youtubeEmbed = isVideo ? getYouTubeEmbedUrl(cleanUrl) : null;

  return (
    <section className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#2e0505] via-[#1a0202] to-[#120101] border border-[#d9a441]/40 shadow-[0_10px_35px_rgba(0,0,0,0.65)] p-3 sm:p-4">
        {/* Subtle Golden Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d9a441]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Ribbon / Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#ffd76a]/15 text-[#ffd76a] border border-[#d9a441]/30">
              {isVideo ? <Video className="w-4 h-4 text-amber-400" /> : <ImageIcon className="w-4 h-4 text-[#ffd76a]" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ffd76a] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                  {isVideo ? 'विशेष वीडियो दर्शन' : 'विशेष मुख्य आकर्षण'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                  FEATURED
                </span>
              </div>
              {media.title && (
                <h3 className="font-marcellus text-base sm:text-lg font-bold text-[#fff4d1] mt-0.5 leading-tight">
                  {media.title}
                </h3>
              )}
            </div>
          </div>
        </div>

        {/* Media Container */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-black/60 border border-[#d9a441]/25">
          {isVideo ? (
            youtubeEmbed ? (
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-2xl"
                  src={youtubeEmbed}
                  title={media.title || 'Pandal Featured Video'}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={cleanUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full max-h-[520px] rounded-2xl object-contain bg-black"
              >
                आपका ब्राउज़र इस वीडियो फ़ॉर्मेट को सपोर्ट नहीं करता।
              </video>
            )
          ) : (
            <img
              src={cleanUrl}
              alt={media.title || 'Featured Pandal Media'}
              loading="eager"
              decoding="async"
              className="w-full max-h-[520px] object-cover rounded-2xl transition-transform hover:scale-[1.01] duration-300"
            />
          )}
        </div>

        {/* Optional Subtitle / Description */}
        {media.subtitle && (
          <p className="mt-2.5 px-1 text-xs sm:text-sm text-[#f3e3be]/90 font-serif leading-relaxed">
            {media.subtitle}
          </p>
        )}
      </div>
    </section>
  );
};
