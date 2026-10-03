/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CommitteeMember } from './data/pandalData';
import { getStoredPandalData, subscribeToLivePandalData } from './utils/pandalStorage';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { QuickActionGrid } from './components/QuickActionGrid';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { KeyMembersSection } from './components/KeyMembersSection';
import { EventsSection } from './components/EventsSection';
import { LiveUpdatesSection } from './components/LiveUpdatesSection';
import { VolunteersSection } from './components/VolunteersSection';
import { DonationSection } from './components/DonationSection';
import { LocationSection } from './components/LocationSection';
import { DevotionalFooter } from './components/DevotionalFooter';
import { BottomNavigation } from './components/BottomNavigation';
import { SideDrawer } from './components/SideDrawer';
import { VirtualDarshanModal } from './components/VirtualDarshanModal';
import { ContactModal } from './components/ContactModal';
import { ArjunPosterModal } from './components/ArjunPosterModal';
import { AdminPortal } from './components/AdminPortal';
import { AdminPinModal } from './components/AdminPinModal';
import { NotificationsModal } from './components/NotificationsModal';
import { FeaturedMediaSection } from './components/FeaturedMediaSection';
import { playTempleBell } from './utils/audio';
import { isSamitiAdminAuthenticated, setSamitiAdminAuthenticated } from './utils/adminAuth';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [pandalState, setPandalState] = useState(() => getStoredPandalData());
  const [splashFinished, setSplashFinished] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDarshanOpen, setIsDarshanOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isArjunPosterOpen, setIsArjunPosterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [adminLoginMode, setAdminLoginMode] = useState<'super_admin' | 'admin'>('admin');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedContactMember, setSelectedContactMember] = useState<CommitteeMember | null>(null);

  const handleOpenAdminPortal = () => {
    playTempleBell();
    if (isSamitiAdminAuthenticated()) {
      setIsAdminOpen(true);
    } else {
      setAdminLoginMode('admin');
      setIsAdminPinModalOpen(true);
    }
  };

  const handleOpenSuperAdminPortal = () => {
    playTempleBell();
    if (isSamitiAdminAuthenticated()) {
      setIsAdminOpen(true);
    } else {
      setAdminLoginMode('super_admin');
      setIsAdminPinModalOpen(true);
    }
  };

  // Sync with Firestore real-time onSnapshot listener + local storage events
  useEffect(() => {
    // 1. Real-time Firestore sync
    const unsubscribeFirestore = subscribeToLivePandalData((liveData) => {
      setPandalState(liveData);
    });

    // 2. Custom storage change event
    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setPandalState(customEvent.detail);
      } else {
        setPandalState(getStoredPandalData());
      }
    };

    window.addEventListener('pandalDataChanged', handleStorageChange);
    return () => {
      unsubscribeFirestore();
      window.removeEventListener('pandalDataChanged', handleStorageChange);
    };
  }, []);

  // Scroll spy for bottom navigation
  useEffect(() => {
    if (!splashFinished) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const donationEl = document.getElementById('donation-section');
      const galleryEl = document.getElementById('gallery-section');
      const eventsEl = document.getElementById('events-section');
      const committeeEl = document.getElementById('committee-section');

      if (donationEl && scrollPos >= donationEl.offsetTop && scrollPos < donationEl.offsetTop + donationEl.offsetHeight) {
        setActiveBottomTab('donate');
      } else if (galleryEl && scrollPos >= galleryEl.offsetTop && scrollPos < galleryEl.offsetTop + galleryEl.offsetHeight) {
        setActiveBottomTab('gallery');
      } else if (eventsEl && scrollPos >= eventsEl.offsetTop && scrollPos < eventsEl.offsetTop + eventsEl.offsetHeight) {
        setActiveBottomTab('explore');
      } else if (committeeEl && scrollPos >= committeeEl.offsetTop && scrollPos < committeeEl.offsetTop + committeeEl.offsetHeight) {
        setActiveBottomTab('committee');
      } else {
        setActiveBottomTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [splashFinished]);

  const handleScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenContact = (member?: CommitteeMember) => {
    setSelectedContactMember(member || null);
    setIsContactOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#220303] text-[#fff8ea] flex flex-col selection:bg-[#d9a441]/40 selection:text-[#ffd76a] relative">
      {/* 0–5 SECONDS SPLASH SCREEN WITH TEMPLE DOOR OPENING */}
      {!splashFinished && (
        <SplashScreen
          onOpenComplete={() => {
            setSplashFinished(true);
          }}
        />
      )}

      {/* Subtle Devotional Background Pattern & Ambient Radiance */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffd76a_0.8px,transparent_0.8px)] [background-size:32px_32px] opacity-10"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-radial from-[#d9a441]/10 to-transparent blur-3xl pointer-events-none"></div>

      {/* TOP HEADER */}
      <Header
        onOpenDrawer={() => {
          playTempleBell();
          setIsDrawerOpen(true);
        }}
        onOpenNotifications={() => {
          playTempleBell();
          setIsNotificationsOpen(true);
        }}
        onOpenAdmin={handleOpenAdminPortal}
        liveCount={pandalState.liveUpdates.filter((u) => u.isLive).length}
      />

      {/* MAIN SINGLE-PAGE PANDAL STORY CANVAS */}
      <main className="flex-1 w-full pb-16">
        {/* 1. HERO CAROUSEL */}
        <HeroCarousel
          slides={pandalState.heroImages}
          onOpenDarshan={() => setIsDarshanOpen(true)}
          onOpenLightbox={() => handleScrollTo('gallery-section')}
        />

        {/* 2. QUICK ACTION ICON GRID */}
        <QuickActionGrid
          onScrollTo={handleScrollTo}
          onOpenDarshan={() => setIsDarshanOpen(true)}
          onOpenDonation={() => handleScrollTo('donation-section')}
        />

        {/* DYNAMIC FEATURED MEDIA (VIDEO / IMAGE HIGHLIGHT) */}
        <FeaturedMediaSection media={pandalState.featuredMedia} />

        {/* 3. ABOUT OUR PANDAL */}
        <AboutSection data={pandalState} />

        {/* 4. MAA DURGA GALLERY */}
        <GallerySection items={pandalState.galleryImages} />

        {/* 5. OUR KEY MEMBERS & COMMITTEE */}
        <KeyMembersSection
          keyMembers={pandalState.keyMembers}
          allCommittee={pandalState.allCommittee}
          onOpenContact={handleOpenContact}
          onOpenArjunPoster={() => setIsArjunPosterOpen(true)}
        />

        {/* 6. UPCOMING FESTIVAL EVENTS */}
        <EventsSection events={pandalState.events} />

        {/* 7. LIVE UPDATES & NOTIFICATIONS */}
        <LiveUpdatesSection updates={pandalState.liveUpdates} />

        {/* 8. OUR VOLUNTEERS & REGISTRATION */}
        <VolunteersSection
          volunteers={pandalState.volunteers}
          onOpenArjunPoster={() => setIsArjunPosterOpen(true)}
        />

        {/* 9. SUPPORT OUR PUJA (DONATION PLATFORM) */}
        <DonationSection
          upiId={pandalState.upiId}
          payeeName={pandalState.payeeName}
          donationAmounts={pandalState.donationAmounts}
        />

        {/* 10. VISIT OUR PANDAL / LOCATION GUIDE */}
        <LocationSection data={pandalState} />
      </main>

      {/* 11. BOTTOM DEVOTIONAL SHLOKA SECTION & FOOTER */}
      <DevotionalFooter
        onOpenSuperAdmin={handleOpenSuperAdminPortal}
        onOpenAdmin={handleOpenAdminPortal}
      />

      {/* FLOATING ADMIN QUICK LAUNCH CHIP (DESKTOP & MOBILE) */}
      <div className="fixed bottom-20 right-4 z-30 hidden sm:block">
        <button
          onClick={handleOpenAdminPortal}
          className="group px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#590a0a] to-[#3a0606] border-2 border-[#d9a441] text-[#ffd76a] shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(255,215,106,0.5)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          title="समिति प्रबंधन कक्ष • Admin Portal"
        >
          <div className="p-1 rounded-lg bg-[#ffd76a] text-[#3a0606]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left leading-tight">
            <span className="block text-[11px] font-bold text-[#ffd76a]">Admin Portal</span>
            <span className="block text-[9px] text-[#ecd6b3]/80">समिति प्रबंधन</span>
          </div>
        </button>
      </div>

      {/* 12. FIXED BOTTOM NAVIGATION BAR */}
      <BottomNavigation
        activeTab={activeBottomTab}
        onSelectTab={setActiveBottomTab}
      />

      {/* SIDE DRAWER */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleScrollTo}
        onOpenDarshan={() => {
          setIsDrawerOpen(false);
          setIsDarshanOpen(true);
        }}
        onOpenVolunteer={() => {
          setIsDrawerOpen(false);
          handleScrollTo('volunteers-section');
        }}
        onOpenDonation={() => {
          setIsDrawerOpen(false);
          handleScrollTo('donation-section');
        }}
        onOpenArjunPoster={() => {
          setIsDrawerOpen(false);
          setIsArjunPosterOpen(true);
        }}
        onOpenAdmin={() => {
          setIsDrawerOpen(false);
          handleOpenAdminPortal();
        }}
        onOpenSuperAdmin={() => {
          setIsDrawerOpen(false);
          handleOpenSuperAdminPortal();
        }}
        onOpenNotifications={() => {
          setIsDrawerOpen(false);
          playTempleBell();
          setIsNotificationsOpen(true);
        }}
      />

      {/* LIVE TEMPLE NOTIFICATIONS & BULLETINS MODAL */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        updates={pandalState.liveUpdates}
        pandalState={pandalState}
        onNavigateToSection={handleScrollTo}
      />

      {/* VIRTUAL DARSHAN MODAL */}
      <VirtualDarshanModal
        isOpen={isDarshanOpen}
        onClose={() => setIsDarshanOpen(false)}
      />

      {/* CONTACT COMMITTEE MODAL */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        member={selectedContactMember}
      />

      {/* ARJUN KUSHWAHA INTERACTIVE DEVELOPER POSTER MODAL */}
      <ArjunPosterModal
        isOpen={isArjunPosterOpen}
        onClose={() => setIsArjunPosterOpen(false)}
      />

      {/* SAMITI ADMIN & SUPER ADMIN LOGIN MODAL */}
      <AdminPinModal
        isOpen={isAdminPinModalOpen}
        initialMode={adminLoginMode}
        onClose={() => setIsAdminPinModalOpen(false)}
        onSuccess={() => {
          setIsAdminPinModalOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* SAMITI ADMIN PORTAL MODAL */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onLogout={() => {
          setSamitiAdminAuthenticated(false);
          setIsAdminOpen(false);
        }}
        pandalState={pandalState}
        onUpdatePandalState={setPandalState}
      />
    </div>
  );
}
