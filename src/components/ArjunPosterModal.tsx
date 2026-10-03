import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Send,
  Code2,
  Database,
  Layout,
  Server,
  Zap,
  Brain,
  Clock,
  Shield,
  Infinity as InfinityIcon,
  Star,
  CheckCircle2,
  Laptop,
  Smartphone,
  MessageSquare,
  Mail,
  Share2,
  Crown
} from 'lucide-react';
import { playTempleBell } from '../utils/audio';

interface ArjunPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArjunPosterModal: React.FC<ArjunPosterModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'Web Apps' | 'Mobile Apps' | 'Website' | 'SaaS'>('Web Apps');
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [activeCardDetail, setActiveCardDetail] = useState<string | null>(null);
  const [laptopCodeRunning, setLaptopCodeRunning] = useState(false);
  const [laptopOutput, setLaptopOutput] = useState<string | null>(null);

  // Quick project inquiry form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryType, setInquiryType] = useState('Custom Web Application');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    playTempleBell();
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handlePillClick = (pill: string) => {
    playTempleBell();
    setSelectedPill(selectedPill === pill ? null : pill);
  };

  const handleRunCode = () => {
    playTempleBell();
    setLaptopCodeRunning(true);
    setLaptopOutput('Compiling Arjun\'s solution...');
    setTimeout(() => {
      setLaptopCodeRunning(false);
      setLaptopOutput('🚀 Output: 100% Scalable & Responsive App Ready! Client Delighted ✨');
    }, 900);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    playTempleBell();
    setInquirySent(true);
    
    // Construct WhatsApp prefilled message
    const msg = encodeURIComponent(
      `Hi Arjun! I saw your profile on Shree Shakti Durga Puja Pandal.\n\nName: ${inquiryName || 'Client'}\nProject: ${inquiryType}\nDetails: ${inquiryMessage || 'Looking to discuss a new software project.'}`
    );
    const whatsappUrl = `https://wa.me/919970000000?text=${msg}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 600);
  };

  const servicesDetails = {
    'Web Apps': {
      title: 'Full-Stack Modern Web Applications',
      desc: 'Built with React 19, TypeScript, Next.js, and high-performance server APIs with realtime capabilities.',
      metric: '⚡ Sub-second load times & 99.9% uptime',
    },
    'Mobile Apps': {
      title: 'Cross-Platform Android & iOS Apps',
      desc: 'Smooth native-feel animations, offline caching, push notifications, and intuitive mobile ergonomics.',
      metric: '📱 60 FPS silky smooth interactions',
    },
    Website: {
      title: 'High-Converting Devotional & Business Websites',
      desc: 'SEO-optimized, ultra-responsive modern landing pages that captivate visitors and drive engagement.',
      metric: '🌟 Perfect 100 Lighthouse Performance Scores',
    },
    SaaS: {
      title: 'End-to-End Scalable SaaS Platforms',
      desc: 'Subscription billing, multi-tenant databases, role-based dashboards, and enterprise-grade security.',
      metric: '🛡️ Production-ready architecture',
    },
  };

  const pillDetails: Record<string, { title: string; skills: string[]; icon: any }> = {
    Frontend: {
      title: 'Frontend Engineering',
      skills: ['React 19', 'Next.js 15', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'Vite', 'Framer Motion'],
      icon: Layout,
    },
    Backend: {
      title: 'Backend Architecture',
      skills: ['Node.js', 'Express', 'RESTful APIs', 'GraphQL', 'Python', 'Authentication / JWT', 'Microservices'],
      icon: Server,
    },
    Database: {
      title: 'Database Management',
      skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase Firestore', 'Redis Caching', 'Prisma / Drizzle ORM'],
      icon: Database,
    },
    'UI/UX': {
      title: 'UI/UX & Product Design',
      skills: ['Figma Prototyping', 'Modern Glassmorphism', 'Responsive Design', 'Design Systems', 'Micro-interactions'],
      icon: Code2,
    },
  };

  const whyWorkCards = [
    {
      id: 'clean-code',
      icon: Zap,
      title: 'Clean Code',
      subtitle: 'Maintainable & Scalable',
      color: 'text-amber-400',
      detail: 'Modular, well-documented architecture adhering to strict TypeScript types and enterprise standards.',
    },
    {
      id: 'problem-solver',
      icon: Brain,
      title: 'Problem Solver',
      subtitle: 'Finds the Best Solutions',
      color: 'text-purple-400',
      detail: 'Analytical mindset turning complex client bottlenecks into effortless, elegant digital workflows.',
    },
    {
      id: 'on-time',
      icon: Clock,
      title: 'On Time',
      subtitle: 'Always Committed',
      color: 'text-cyan-400',
      detail: 'Agile sprints with transparent milestones, daily progress tracking, and zero surprise delays.',
    },
    {
      id: 'client-focused',
      icon: Shield,
      title: 'Client Focused',
      subtitle: 'Your Satisfaction First',
      color: 'text-amber-300',
      detail: 'Collaborative development where your vision and business goals are the #1 priority throughout.',
    },
    {
      id: 'support',
      icon: InfinityIcon,
      title: 'Long Term Support',
      subtitle: 'Even After Delivery',
      color: 'text-emerald-400',
      detail: 'Post-launch maintenance, cloud monitoring, feature updates, and peace of mind for your business.',
    },
    {
      id: 'affordable',
      icon: Star,
      title: 'Affordable',
      subtitle: 'Best Quality at Fair Price',
      color: 'text-yellow-400',
      detail: 'High-end Silicon Valley-grade code quality priced reasonably for startups, businesses, and communities.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 backdrop-blur-2xl bg-black/85 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto custom-scrollbar animate-fade-in"
      onClick={onClose}
    >
      {/* POSTER CARD CONTAINER: Matches user's uploaded poster style */}
      <div
        className="relative w-full max-w-4xl my-auto rounded-3xl bg-gradient-to-b from-[#0a0f1d] via-[#060a14] to-[#04060d] border-2 border-[#1e2c4a] shadow-[0_0_50px_rgba(255,215,106,0.25)] p-4 sm:p-6 md:p-8 text-[#fff7e6] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 60px rgba(56, 189, 248, 0.15), 0 0 100px rgba(255, 215, 106, 0.1)',
        }}
      >
        {/* Glow Spheres & Mandir Corner Motifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-cyan-500/15 via-purple-500/5 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-radial from-amber-500/15 via-rose-500/5 to-transparent blur-3xl pointer-events-none"></div>

        {/* Top Control Bar */}
        <div className="relative z-10 flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] font-mono tracking-wider text-emerald-400 uppercase font-semibold">
              Available for Projects & Digital Seva
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] text-amber-300 font-bold">
              🌟 Official Pandal Web Developer
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(window.location.href, 'profile-link')}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs"
              title="Share Developer Profile"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#ffd76a] transition-all cursor-pointer"
              aria-label="Close Poster"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN POSTER BODY (2 COLUMNS: Profile Left, Services Right) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Avatar, Crown, Bio, Social buttons (approx 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              {/* Profile Avatar with Glowing Halo & Floating Crown */}
              <div className="flex items-start gap-4 mb-3">
                <div className="relative group shrink-0">
                  {/* Floating Golden Crown */}
                  <div className="absolute -top-3.5 -left-1 z-20 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-bounce">
                    <Crown className="w-7 h-7 fill-amber-400 text-amber-300" />
                  </div>

                  {/* Golden Halo Ring Avatar */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.6)] relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    <img
                      src="/src/assets/images/arjun_avatar_1790242444969.jpg"
                      alt="Arjun Kushwaha"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0f1d] shadow-md"></div>
                </div>

                {/* Handwritten Tagline matching poster */}
                <div className="pt-2">
                  <span className="font-marcellus text-amber-300 text-xs sm:text-sm font-semibold tracking-wide italic block leading-tight drop-shadow-sm">
                    Let's Build Something Great Together ✨
                  </span>
                  <p className="text-[11px] text-white/60 mt-1">
                    Passionate Creator & Full-Stack Specialist
                  </p>
                </div>
              </div>

              {/* Name & Title */}
              <div className="mb-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  Arjun Kushwaha
                </h1>
                <div className="flex items-center gap-1.5 text-amber-400 font-mono text-sm sm:text-base font-semibold mt-0.5">
                  <span className="text-cyan-400 font-bold">&lt;/&gt;</span>
                  <span>Web & App Developer</span>
                </div>
              </div>

              {/* Interactive Stack Pills (Frontend, Backend, Database, UI/UX) */}
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { name: 'Frontend', bg: 'bg-blue-600/30 text-blue-300 border-blue-500/50 hover:bg-blue-600/50' },
                  { name: 'Backend', bg: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 hover:bg-emerald-600/50' },
                  { name: 'Database', bg: 'bg-purple-600/30 text-purple-300 border-purple-500/50 hover:bg-purple-600/50' },
                  { name: 'UI/UX', bg: 'bg-amber-600/30 text-amber-300 border-amber-500/50 hover:bg-amber-600/50' },
                ].map((pill) => (
                  <button
                    key={pill.name}
                    onClick={() => handlePillClick(pill.name)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                      pill.bg
                    } ${selectedPill === pill.name ? 'ring-2 ring-white scale-105' : ''}`}
                    title={`Click to view ${pill.name} skills`}
                  >
                    <span>{pill.name}</span>
                    <span className="text-[10px] opacity-70">▾</span>
                  </button>
                ))}
              </div>

              {/* Expanded Skills Detail Drawer if pill clicked */}
              {selectedPill && pillDetails[selectedPill] && (
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-3 animate-fade-in text-xs">
                  <div className="flex items-center justify-between font-semibold text-amber-300 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      {React.createElement(pillDetails[selectedPill].icon, { className: 'w-4 h-4' })}
                      {pillDetails[selectedPill].title}
                    </span>
                    <button
                      onClick={() => setSelectedPill(null)}
                      className="text-white/50 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {pillDetails[selectedPill].skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-white/90"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio Statement matching poster */}
              <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed mb-4">
                I build modern websites, web apps and mobile apps that are fast, secure and user-friendly. Let's turn your idea into reality! ✨
              </p>
            </div>

            {/* Interactive Social & Contact Links matching poster */}
            <div className="space-y-2">
              {/* Instagram */}
              <a
                href="https://instagram.com/arjun_kushwaha_07"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playTempleBell()}
                className="group flex items-center justify-between p-2.5 rounded-2xl bg-[#101726] hover:bg-[#18233a] border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
                    <span className="text-sm">📸</span>
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] text-white/60">Instagram</div>
                    <div className="text-xs font-semibold text-white group-hover:text-pink-300">
                      @arjun_kushwaha_07
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-white/50 group-hover:text-pink-400">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/arjunkushwaha"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playTempleBell()}
                className="group flex items-center justify-between p-2.5 rounded-2xl bg-[#101726] hover:bg-[#18233a] border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                    in
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] text-white/60">LinkedIn</div>
                    <div className="text-xs font-semibold text-white group-hover:text-blue-300">
                      linkedin.com/in/arjunkushwaha
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-white/50 group-hover:text-blue-400">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>

              {/* Website / Portfolio */}
              <a
                href="https://arjunkushwaha.dev"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playTempleBell()}
                className="group flex items-center justify-between p-2.5 rounded-2xl bg-[#101726] hover:bg-[#18233a] border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-sm shrink-0">
                    <span className="text-sm">🌐</span>
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] text-white/60">Website / Portfolio</div>
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                      arjunkushwaha.dev
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-white/50 group-hover:text-cyan-400">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>

              {/* Email direct button with 1-click copy */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="mailto:kushwahaarjun9970@gmail.com"
                  className="flex-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">kushwahaarjun9970@gmail.com</span>
                </a>

                <button
                  onClick={() => handleCopy('kushwahaarjun9970@gmail.com', 'email')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 transition-all cursor-pointer"
                  title="Copy Email"
                >
                  {copiedItem === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Custom Software Development, Checklist, Laptop & Phone, CTA (approx 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              {/* Top Bulb Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-amber-400/30 text-amber-300 text-xs font-medium mb-2 shadow-xs">
                <span>💡</span>
                <span>Get Your Dream Software</span>
              </div>

              {/* Main Heading */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                Custom Software Development
              </h2>

              {/* Interactive Services Selector Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 my-2.5">
                {(['Web Apps', 'Mobile Apps', 'Website', 'SaaS'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      playTempleBell();
                      setActiveTab(tab);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-[0_0_15px_rgba(251,191,36,0.4)] border-amber-400'
                        : 'bg-white/5 text-white/70 hover:text-white border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Selected Service Detail Preview */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-3 text-xs">
                <div className="font-bold text-amber-300 mb-0.5">{servicesDetails[activeTab].title}</div>
                <div className="text-white/80 leading-relaxed">{servicesDetails[activeTab].desc}</div>
                <div className="text-[11px] text-cyan-400 font-mono mt-1 font-semibold">
                  {servicesDetails[activeTab].metric}
                </div>
              </div>

              {/* Features Checklist with Glowing Green Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                {[
                  'Responsive & Modern UI/UX',
                  'Fast & Secure Code',
                  'On-Time Delivery',
                  'Affordable Pricing',
                  'Full Support',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs sm:text-[13px] text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Slogan & Formula */}
              <div className="flex items-center justify-between flex-wrap gap-2 my-3 py-1">
                <span className="font-marcellus text-amber-300 text-sm sm:text-base font-semibold italic drop-shadow-sm">
                  Your Idea + My Code = Your Success 🚀
                </span>

                {/* Big CTA: Let's Discuss */}
                <button
                  onClick={() => {
                    playTempleBell();
                    setIsDiscussionOpen(!isDiscussionOpen);
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs sm:text-sm tracking-wide flex items-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.5)] active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Let's Discuss →</span>
                </button>
              </div>

              {/* QUICK INQUIRY MODAL / ACCORDION */}
              {isDiscussionOpen && (
                <form
                  onSubmit={handleSendInquiry}
                  className="p-4 rounded-2xl bg-[#0e1626] border border-amber-400/40 my-3 animate-fade-in text-xs space-y-2.5 shadow-xl"
                >
                  <div className="flex items-center justify-between font-bold text-amber-300">
                    <span>Discuss Your Dream Project With Arjun</span>
                    <button
                      type="button"
                      onClick={() => setIsDiscussionOpen(false)}
                      className="text-white/50 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-white/70 block mb-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/70 block mb-1">Project Type</label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                      >
                        <option>Custom Web Application</option>
                        <option>Mobile App (Android/iOS)</option>
                        <option>Business / Puja Website</option>
                        <option>SaaS Platform</option>
                        <option>UI/UX Design & Redesign</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-white/70 block mb-1">Brief Description / Idea</label>
                    <textarea
                      rows={2}
                      placeholder="Tell me what you are looking to build..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send to Arjun via WhatsApp</span>
                    </button>
                    <a
                      href={`mailto:kushwahaarjun9970@gmail.com?subject=Project Inquiry from ${encodeURIComponent(inquiryName || 'Client')}&body=${encodeURIComponent(inquiryMessage)}`}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>Email</span>
                    </a>
                  </div>
                </form>
              )}
            </div>

            {/* Interactive Tech Icons & 3D Laptop Preview Mockup */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {/* Tech Badges matching poster (React, Node.js, MySQL, Clean Code) */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  onClick={() => handlePillClick('Frontend')}
                  className="p-2.5 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-sm"
                  title="React 19 & Next.js"
                >
                  <span className="font-bold text-xs">⚛️ React</span>
                </button>
                <button
                  onClick={() => handlePillClick('Backend')}
                  className="p-2.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-sm"
                  title="Node.js & Express"
                >
                  <span className="font-bold text-xs">🟩 Node.js</span>
                </button>
                <button
                  onClick={() => handlePillClick('Database')}
                  className="p-2.5 rounded-2xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-400 flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-sm"
                  title="MySQL & Postgres"
                >
                  <span className="font-bold text-xs">🐬 MySQL</span>
                </button>
                <button
                  onClick={() => handlePillClick('UI/UX')}
                  className="p-2.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-400 flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-sm"
                  title="Clean Architecture & UI/UX"
                >
                  <span className="font-bold text-xs">&lt;/&gt; Code</span>
                </button>
              </div>

              {/* Interactive Laptop & Code Terminal Mockup */}
              <div
                onClick={handleRunCode}
                className="group relative flex-1 w-full rounded-2xl bg-[#090d18] border border-cyan-500/30 p-3 shadow-xl hover:border-cyan-400 transition-all cursor-pointer overflow-hidden"
                title="Click to Run Arjun's Code!"
              >
                {/* Laptop Top Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] text-white/50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-mono text-white/70 ml-2">arjun.config.ts</span>
                  </div>
                  <span className="font-mono text-cyan-400 text-[10px] group-hover:underline">
                    {laptopCodeRunning ? 'Running...' : '▶ Click to Run Demo'}
                  </span>
                </div>

                {/* Code Body */}
                <pre className="font-mono text-[11px] text-white/90 py-2 leading-relaxed overflow-x-auto custom-scrollbar">
                  <code>
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-yellow-300">dreamApp</span> ={' '}
                    <span className="text-purple-400">await</span> arjun.
                    <span className="text-cyan-400">build</span>({'{'}
                    {'\n'}  clientSatisfaction:{' '}
                    <span className="text-emerald-400">100</span>,
                    {'\n'}  speed:{' '}
                    <span className="text-amber-300">'Ultra-Fast'</span>,
                    {'\n'}  quality:{' '}
                    <span className="text-cyan-300">'Premium'</span>
                    {'\n'}
                    {'}'});
                  </code>
                </pre>

                {/* Dynamic Output */}
                {laptopOutput && (
                  <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 animate-fade-in">
                    {laptopOutput}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION ("Why Work With Me?") */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-amber-400/60 text-xs hidden sm:inline">✦ ———</span>
            <h3 className="font-marcellus text-base sm:text-lg font-bold text-amber-300 tracking-wide text-center">
              Why Work With Me?
            </h3>
            <span className="text-amber-400/60 text-xs hidden sm:inline">——— ✦</span>
          </div>

          {/* 6 Feature Value Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {whyWorkCards.map((card) => {
              const IconComp = card.icon;
              const isSelected = activeCardDetail === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    playTempleBell();
                    setActiveCardDetail(isSelected ? null : card.id);
                  }}
                  className={`group p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                    isSelected
                      ? 'bg-[#18233a] border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-105'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-amber-400/40'
                  }`}
                  title="Click to view details"
                >
                  <div className={`p-2 rounded-xl bg-white/5 mb-1.5 ${card.color} group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-white leading-tight">{card.title}</h4>
                  <p className="text-[10px] text-white/60 leading-tight mt-0.5">{card.subtitle}</p>
                </div>
              );
            })}
          </div>

          {/* Card Detail Tooltip / Modal Drawer */}
          {activeCardDetail && (
            <div className="mt-3 p-3 rounded-2xl bg-[#121c2f] border border-amber-400/40 text-center text-xs text-white/90 animate-fade-in shadow-lg">
              <span className="text-amber-300 font-bold">
                {whyWorkCards.find((c) => c.id === activeCardDetail)?.title}:
              </span>{' '}
              {whyWorkCards.find((c) => c.id === activeCardDetail)?.detail}
            </div>
          )}

          {/* Bottom Slogan */}
          <div className="flex items-center justify-center gap-3 mt-4 text-xs font-marcellus text-amber-300/90 tracking-widest italic">
            <span>Build</span>
            <span>•</span>
            <span>Grow</span>
            <span>•</span>
            <span>Succeed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
