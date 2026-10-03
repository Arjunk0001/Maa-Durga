export interface HeroSlide {
  id: string;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  category: 'Pratima' | 'Pandal' | 'Aarti' | 'Cultural' | 'Community';
  caption: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  photo: string;
  bio: string;
  responsibility: string;
  joinedYear: number;
  isArjun?: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  subRole?: string;
  photo: string;
  shift: string;
  status: 'Active' | 'On Duty' | 'Coordination';
  isArjun?: boolean;
  badge?: string;
}

export interface PandalEvent {
  id: string;
  date: string;
  dayLabel: string;
  time: string;
  title: string;
  category: 'Puja' | 'Cultural' | 'Dance' | 'Aarti' | 'Visarjan';
  iconName: string;
  venue: string;
  description: string;
}

export interface LiveUpdate {
  id: string;
  time: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'live' | 'alert' | 'info' | 'prasad';
  isLive: boolean;
  crowdLevel?: 'Low' | 'Moderate' | 'Heavy';
}

export interface FeaturedMedia {
  enabled: boolean;
  type: 'image' | 'video';
  url: string;
  title?: string;
  subtitle?: string;
}

export interface PandalData {
  name: string;
  subName: string;
  tagline: string;
  location: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  establishedYear: number;
  yearsOfCelebration: number;
  communityMembers: number;
  volunteerCount: number;
  totalEvents: number;
  currentTheme: string;
  themeDescription: string;
  aboutText: string;
  fullDescription: string;
  heroImages: HeroSlide[];
  galleryImages: GalleryItem[];
  keyMembers: CommitteeMember[];
  allCommittee: CommitteeMember[];
  volunteers: Volunteer[];
  events: PandalEvent[];
  liveUpdates: LiveUpdate[];
  donationAmounts: number[];
  parkingInfo: {
    gate1Status: string;
    gate2Status: string;
    gate3Status: string;
    wheelchairAccessible: boolean;
    emergencyContact: string;
    helpline: string;
  };
  upiId?: string;
  payeeName?: string;
  featuredMedia?: FeaturedMedia;
}

export const pandalData: PandalData = {
  name: "SHREE SHAKTI",
  subName: "Durga Puja Samiti",
  tagline: "Faith • Culture • Togetherness",
  location: "Lucknow, Uttar Pradesh",
  address: "Gomti Nagar Festival Grounds, Sector 4, Viram Khand",
  landmark: "Near Shaheed Smarak & Gomti Riverfront Park",
  city: "Lucknow",
  pincode: "226010",
  establishedYear: 2001,
  yearsOfCelebration: 26,
  communityMembers: 1250,
  volunteerCount: 65,
  totalEvents: 24,
  currentTheme: "Divine Shakti & Bengal Terracotta Heritage",
  themeDescription: "A grand tribute to the timeless Bishnupur terracotta temple architecture fused with Awadhi harmony and divine devotion to Maa Durga.",
  aboutText: "Shree Shakti Durga Puja Samiti is a 25+ years old community organisation dedicated to celebrating Maa Durga's divine blessings, culture and unity. Our pandal is known for its unique themes, vibrant cultural programs and the heartfelt participation of our volunteers and local community.",
  fullDescription: "Founded in 2001 by a passionate assembly of families and devotees in Lucknow, Shree Shakti Durga Puja Samiti has evolved into one of Uttar Pradesh's most respected spiritual and cultural celebrations. Each year, we strive to unite diverse traditions under the compassionate gaze of Maa Durga. From our authentic eco-friendly clay murtis to daily Bhog prasad distributed to over 5,000 visitors daily, our mission is to foster devotional purity, community harmony, art, and youth volunteerism.",
  
  heroImages: [
    {
      id: "h1",
      image: "/src/assets/images/hero_durga_idol_1790202168278.jpg",
      tag: "2026 Theme",
      title: "Divine Shakti",
      subtitle: "Experience the sacred grace of Mahishasuramardini"
    },
    {
      id: "h2",
      image: "/src/assets/images/pandal_architecture_1790202191467.jpg",
      tag: "Sanctum Architecture",
      title: "Terracotta Splendor",
      subtitle: "Handcrafted temple motifs illuminated under golden night skies"
    },
    {
      id: "h3",
      image: "/src/assets/images/dhunuchi_dance_1790202202597.jpg",
      tag: "Sacred Traditions",
      title: "Dhunuchi Naach",
      subtitle: "Rhythmic clay incense dance to the divine beat of Dhak drums"
    },
    {
      id: "h4",
      image: "/src/assets/images/maha_aarti_pandal_1790202214956.jpg",
      tag: "Daily Aarti",
      title: "Maha Sandhya Aarti",
      subtitle: "108 sacred brass lamps offered by thousands of devotees"
    }
  ],

  galleryImages: [
    {
      id: "g1",
      image: "/src/assets/images/hero_durga_idol_1790202168278.jpg",
      title: "Maa Durga Pratima",
      category: "Pratima",
      caption: "Sacred 12-foot traditional idol sculpted in clay with organic natural pigments."
    },
    {
      id: "g2",
      image: "/src/assets/images/pandal_architecture_1790202191467.jpg",
      title: "Grand Pandal Facade",
      category: "Pandal",
      caption: "Illuminated temple spires welcoming devotees into the sanctum."
    },
    {
      id: "g3",
      image: "/src/assets/images/dhunuchi_dance_1790202202597.jpg",
      title: "Dhunuchi Dance Ritual",
      category: "Cultural",
      caption: "Youth and elders participating in the devotional camphor and coconut husk dance."
    },
    {
      id: "g4",
      image: "/src/assets/images/maha_aarti_pandal_1790202214956.jpg",
      title: "Sandhya Maha Aarti",
      category: "Aarti",
      caption: "Evening prayers accompanied by reverberating conch shells and brass bells."
    },
    {
      id: "g5",
      image: "/src/assets/images/splash_durga_divine_1790202180449.jpg",
      title: "Trinetra & Divine Gaze",
      category: "Pratima",
      caption: "The radiant third eye of Goddess Durga radiating strength and auspiciousness."
    },
    {
      id: "g6",
      image: "/src/assets/images/hero_durga_idol_1790202168278.jpg",
      title: "Anandamela & Bhog",
      category: "Community",
      caption: "Community kitchen preparing Khichuri Bhog, Labra, and Payesh prasad."
    }
  ],

  keyMembers: [
    {
      id: "km1",
      name: "Rajesh Kumar",
      role: "President",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      bio: "Guiding the samiti for over 15 years with focus on tradition, sustainability, and harmony.",
      responsibility: "Overall leadership, administration & civic coordination",
      joinedYear: 2008
    },
    {
      id: "km2",
      name: "Amit Sharma",
      role: "Secretary",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      bio: "Oversees daily pandal operations, festival logistics, and volunteer mobilization.",
      responsibility: "Operational management & municipal permissions",
      joinedYear: 2012
    },
    {
      id: "km3",
      name: "Suresh Gupta",
      role: "Treasurer",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
      bio: "Chartered accountant ensuring 100% financial transparency and digital accounting.",
      responsibility: "Finance, audit, receipts & donation stewardship",
      joinedYear: 2015
    },
    {
      id: "km4",
      name: "Pooja Verma",
      role: "Cultural Head",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
      bio: "Classical vocalist organizing classical music recitals, Dhunuchi contests, and drama.",
      responsibility: "Stage events, artist booking & musical curation",
      joinedYear: 2017
    }
  ],

  allCommittee: [
    {
      id: "ac1",
      name: "Rajesh Kumar",
      role: "President",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      bio: "Guiding the samiti for over 15 years with focus on tradition, sustainability, and harmony.",
      responsibility: "Overall leadership, administration & civic coordination",
      joinedYear: 2008
    },
    {
      id: "ac2",
      name: "Amit Sharma",
      role: "General Secretary",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      bio: "Oversees daily pandal operations, festival logistics, and volunteer mobilization.",
      responsibility: "Operational management & municipal permissions",
      joinedYear: 2012
    },
    {
      id: "ac3",
      name: "Suresh Gupta",
      role: "Treasurer",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
      bio: "Chartered accountant ensuring 100% financial transparency and digital accounting.",
      responsibility: "Finance, audit, receipts & donation stewardship",
      joinedYear: 2015
    },
    {
      id: "ac4",
      name: "Pooja Verma",
      role: "Cultural Secretary",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
      bio: "Classical vocalist organizing classical music recitals, Dhunuchi contests, and drama.",
      responsibility: "Stage events, artist booking & musical curation",
      joinedYear: 2017
    },
    {
      id: "ac5",
      name: "Capt. Vikram Singh",
      role: "Security & Crowd Head",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
      bio: "Retired military officer directing pandal crowd safety, fire prevention and perimeter security.",
      responsibility: "Safety protocols, CCTV control & emergency medical response",
      joinedYear: 2018
    },
    {
      id: "ac6",
      name: "Ananya Mukherjee",
      role: "Volunteer Coordinator",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      bio: "Leading 65+ energetic young volunteers across hospitality, prasad queue, and senior citizen aid.",
      responsibility: "Volunteer scheduling, team dispatch & devotee guidance",
      joinedYear: 2020
    },
    {
      id: "ac-arjun",
      name: "Arjun Kushwaha",
      role: "Digital Seva & Tech Lead",
      phone: "+91 94500 23412",
      photo: "/src/assets/images/arjun_avatar_1790242444969.jpg",
      bio: "Web & App Developer who crafted the modern digital pandal, live virtual darshan platform, and IT infrastructure.",
      responsibility: "Digital platform architecture, live darshan streaming & tech volunteerism",
      joinedYear: 2023,
      isArjun: true
    }
  ],

  volunteers: [
    {
      id: "v1",
      name: "Rohit Saxena",
      role: "Queue Management",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      shift: "Morning (8 AM - 2 PM)",
      status: "On Duty"
    },
    {
      id: "v2",
      name: "Neha Banerjee",
      role: "Decoration & Flowers",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      shift: "All Day",
      status: "Active"
    },
    {
      id: "v3",
      name: "Vikas Yadav",
      role: "Security & CCTV",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
      shift: "Evening (4 PM - 11 PM)",
      status: "Active"
    },
    {
      id: "v4",
      name: "Pooja Tiwari",
      role: "Food & Prasad Sewa",
      photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80",
      shift: "Afternoon (12 PM - 5 PM)",
      status: "On Duty"
    }
  ],

  events: [
    {
      id: "e1",
      date: "18 OCT",
      dayLabel: "Shasthi",
      time: "9:00 AM – 11:00 AM",
      title: "Kalash Sthapana & Bodhon",
      category: "Puja",
      iconName: "Flame",
      venue: "Main Garbhagriha Sanctum",
      description: "Invocation ritual marking the welcome of Maa Durga with holy kalash and Vedic shlokas."
    },
    {
      id: "e2",
      date: "19 OCT",
      dayLabel: "Saptami",
      time: "7:00 PM – 10:00 PM",
      title: "Classical Cultural Evening",
      category: "Cultural",
      iconName: "Music",
      venue: "Shakti Open Amphitheatre",
      description: "Renditions of Rabindra Sangeet, sitar recitals, and regional Odissi & Kathak fusion."
    },
    {
      id: "e3",
      date: "20 OCT",
      dayLabel: "Ashtami",
      time: "8:00 PM – 9:30 PM",
      title: "Grand Dhunuchi Dance Contest",
      category: "Dance",
      iconName: "Sparkles",
      venue: "Courtyard Stage",
      description: "Mesmerizing incense dance performed to rhythmic kashi and live dhak percussion beats."
    },
    {
      id: "e4",
      date: "21 OCT",
      dayLabel: "Navami",
      time: "7:30 PM – 9:00 PM",
      title: "Maha Sandhya Aarti & Havan",
      category: "Aarti",
      iconName: "Lamp",
      venue: "Main Sanctum & Courtyard",
      description: "108 lamps lit simultaneously for peace, health and prosperity of the entire city."
    },
    {
      id: "e5",
      date: "22 OCT",
      dayLabel: "Dashami",
      time: "4:00 PM – 6:00 PM",
      title: "Sindoor Khela & Visarjan Shobhayatra",
      category: "Visarjan",
      iconName: "Waves",
      venue: "Procession to Gomti Ghat",
      description: "Auspicious vermilion celebrations followed by the grand immersion yatra with flowers and drums."
    }
  ],

  liveUpdates: [
    {
      id: "u1",
      time: "Just Now",
      timestamp: "07:30 PM",
      title: "Maha Aarti starting in 10 minutes",
      message: "Be there and feel the divine energy! Join in chanting the sacred Mahishasuramardini Stotram.",
      type: "live",
      isLive: true,
      crowdLevel: "Moderate"
    },
    {
      id: "u2",
      time: "2:45 PM",
      timestamp: "02:45 PM",
      title: "Parking Gate 2 is currently available",
      message: "Gate 2 has 80+ open four-wheeler parking slots with designated elderly drop-off.",
      type: "info",
      isLive: false,
      crowdLevel: "Low"
    },
    {
      id: "u3",
      time: "1:30 PM",
      timestamp: "01:30 PM",
      title: "Heavy crowd detected near Gate 1",
      message: "Devotees are advised to use Gate 3 for faster VIP and senior darshan line access.",
      type: "alert",
      isLive: false,
      crowdLevel: "Heavy"
    },
    {
      id: "u4",
      time: "12:15 PM",
      timestamp: "12:15 PM",
      title: "Khichuri Prasad distribution in full swing",
      message: "Hot Bhog Prasad packets are being served at Hall B. Please maintain the queue discipline.",
      type: "prasad",
      isLive: false,
      crowdLevel: "Moderate"
    }
  ],

  donationAmounts: [51, 101, 501, 1001, 2001],

  parkingInfo: {
    gate1Status: "Fast Movement (Pedestrians only)",
    gate2Status: "Vehicular Parking Open (120 spots)",
    gate3Status: "Accessible Gate & VIP Darshan",
    wheelchairAccessible: true,
    emergencyContact: "+91 94500 23412",
    helpline: "1800 120 4455"
  },
  upiId: "ak6412883@okhdfcbank",
  payeeName: "Shree Shakti Durga Puja Samiti",
  featuredMedia: {
    enabled: false,
    type: 'video',
    url: '',
    title: '',
    subtitle: '',
  },
};
