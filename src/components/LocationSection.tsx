import React, { useState } from 'react';
import { MapPin, Navigation, Copy, Check, Car, ShieldAlert, Phone, Clock, Compass } from 'lucide-react';
import { PandalData } from '../data/pandalData';
import { playTempleBell } from '../utils/audio';

interface LocationSectionProps {
  data: PandalData;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    playTempleBell();
    const fullAddress = `${data.name} ${data.subName}, ${data.address}, ${data.landmark}, ${data.city} - ${data.pincode}`;
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGetDirections = () => {
    playTempleBell();
    const query = encodeURIComponent(`${data.name} Durga Puja Samiti, ${data.landmark}, Lucknow`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <section id="location-section" className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 scroll-mt-20">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-[#ffd76a]/60 text-sm hidden sm:inline">✤ ———</span>
        <span className="text-xl">📍</span>
        <h2 className="font-marcellus text-2xl sm:text-3xl font-bold tracking-wide gold-gradient-text text-center">
          Visit Our Pandal
        </h2>
        <span className="text-xl">📍</span>
        <span className="text-[#ffd76a]/60 text-sm hidden sm:inline">——— ✤</span>
      </div>

      <p className="text-center font-body text-xs sm:text-sm text-[#d4af37]/80 mb-6 max-w-lg mx-auto">
        Located centrally in Lucknow with designated parking and senior citizen access gates.
      </p>

      {/* Main Location Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#3a0606] to-[#200202] border border-[#d9a441]/35 p-5 sm:p-7 shadow-2xl space-y-5">
        {/* Address Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-[#d9a441]/25">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#590a0a] border border-[#ffd76a]/50 text-[#ffd76a] shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-marcellus text-base sm:text-lg font-bold text-[#fff7e6]">
                {data.address}
              </h3>
              <p className="font-body text-xs text-[#d9a441] mt-0.5">
                Landmark: {data.landmark} • {data.city} ({data.pincode})
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGetDirections}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ffd76a] to-[#d9a441] hover:from-[#ffe082] text-[#2a0404] font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </button>

            <button
              onClick={handleCopyAddress}
              className="p-2 sm:px-3 sm:py-2 rounded-full bg-[#590a0a] hover:bg-[#781010] border border-[#ffd76a]/40 text-[#ffd76a] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy Full Address"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Stylized Interactive Map Preview */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#d9a441]/40 shadow-inner bg-[#160202]">
          {/* Decorative Map SVG Graphic */}
          <svg className="w-full h-full object-cover opacity-80" viewBox="0 0 800 450" fill="none">
            {/* Dark Map Canvas Background */}
            <rect width="800" height="450" fill="#1e0404" />

            {/* River Gomti Curve */}
            <path
              d="M0 380 Q 200 320 400 360 T 800 300"
              stroke="#0f3b4c"
              strokeWidth="45"
              fill="none"
              strokeLinecap="round"
            />
            <text x="500" y="340" fill="#22d3ee" fontSize="12" fontFamily="sans-serif" opacity="0.6">Gomti Riverfront Park</text>

            {/* Major Arterial Roads */}
            <path d="M50 0 L150 450" stroke="#3d1414" strokeWidth="18" />
            <path d="M0 200 L800 200" stroke="#3d1414" strokeWidth="22" />
            <path d="M400 0 L400 450" stroke="#481818" strokeWidth="26" />
            <path d="M250 100 L650 350" stroke="#3d1414" strokeWidth="14" />

            {/* Sector Blocks */}
            <rect x="220" y="80" width="140" height="90" rx="8" fill="#2d0808" stroke="#521212" strokeWidth="2" />
            <rect x="440" y="80" width="160" height="90" rx="8" fill="#2d0808" stroke="#521212" strokeWidth="2" />
            <rect x="220" y="230" width="140" height="90" rx="8" fill="#2d0808" stroke="#521212" strokeWidth="2" />
            <rect x="440" y="230" width="160" height="90" rx="8" fill="#2d0808" stroke="#521212" strokeWidth="2" />

            {/* Road Names */}
            <text x="410" y="40" fill="#a87c4f" fontSize="11" fontFamily="sans-serif">Lohia Path</text>
            <text x="30" y="190" fill="#a87c4f" fontSize="11" fontFamily="sans-serif">Viram Khand Main Ave</text>

            {/* Pandal Compound Highlight */}
            <rect x="340" y="140" width="130" height="110" rx="12" fill="#580c0c" stroke="#ffd76a" strokeWidth="2.5" />
            <circle cx="405" cy="195" r="28" fill="#ffd76a" fillOpacity="0.15" className="animate-ping" />
            <circle cx="405" cy="195" r="14" fill="#ffd76a" fillOpacity="0.3" />
            
            {/* Pandal Pin Icon */}
            <circle cx="405" cy="190" r="10" fill="#dc2626" stroke="#ffd76a" strokeWidth="2" />
            <circle cx="405" cy="190" r="3" fill="#fff" />
            <text x="405" y="222" fill="#ffd76a" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              SHREE SHAKTI PANDAL
            </text>
          </svg>

          {/* Floating Map Overlays */}
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#d9a441]/40 text-[11px] text-[#ffd76a] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Pandal Location Guide</span>
          </div>

          <div className="absolute bottom-3 right-3">
            <button
              onClick={handleGetDirections}
              className="px-3.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-[#ffd76a] text-xs font-semibold border border-[#ffd76a]/60 shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Open in Google Maps</span>
              <Navigation className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Gate & Logistics Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Parking */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-[#d9a441]/20 space-y-1">
            <div className="flex items-center gap-2 text-[#ffd76a]">
              <Car className="w-4 h-4" />
              <h4 className="font-semibold text-xs uppercase tracking-wider">Gate 2 Parking</h4>
            </div>
            <p className="text-[11px] text-[#eedec5]">
              {data.parkingInfo.gate2Status}
            </p>
          </div>

          {/* Pedestrian Entry */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-[#d9a441]/20 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400">
              <Navigation className="w-4 h-4" />
              <h4 className="font-semibold text-xs uppercase tracking-wider">Gate 1 Entry</h4>
            </div>
            <p className="text-[11px] text-[#eedec5]">
              {data.parkingInfo.gate1Status}
            </p>
          </div>

          {/* Accessible / VIP */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-[#d9a441]/20 space-y-1">
            <div className="flex items-center gap-2 text-amber-300">
              <Compass className="w-4 h-4" />
              <h4 className="font-semibold text-xs uppercase tracking-wider">Gate 3 Special Access</h4>
            </div>
            <p className="text-[11px] text-[#eedec5]">
              {data.parkingInfo.gate3Status}
            </p>
          </div>

          {/* Emergency Helpline */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-[#d9a441]/20 space-y-1">
            <div className="flex items-center gap-2 text-rose-400">
              <Phone className="w-4 h-4" />
              <h4 className="font-semibold text-xs uppercase tracking-wider">24x7 Helpline</h4>
            </div>
            <p className="text-[11px] text-[#eedec5]">
              {data.parkingInfo.helpline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
