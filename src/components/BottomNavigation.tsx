import React from 'react';
import { Home, Compass, Heart, Image as ImageIcon, UserCheck } from 'lucide-react';
import { playTempleBell } from '../utils/audio';

interface BottomNavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, sectionId: 'root' },
    { id: 'explore', label: 'Explore', icon: Compass, sectionId: 'events-section' },
    { id: 'donate', label: 'Donate', icon: Heart, sectionId: 'donation-section' },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, sectionId: 'gallery-section' },
    { id: 'committee', label: 'Profile', icon: UserCheck, sectionId: 'committee-section' },
  ];

  const handleTabClick = (item: typeof navItems[0]) => {
    playTempleBell();
    onSelectTab(item.id);
    if (item.id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(item.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#250303]/95 backdrop-blur-lg border-t border-[#d9a441]/30 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`flex flex-col items-center justify-center py-1 transition-all group cursor-pointer ${
                isActive ? 'text-[#ffd76a]' : 'text-[#baa07c] hover:text-[#ffd76a]'
              }`}
            >
              <div
                className={`relative p-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#590a0a] shadow-[0_0_12px_rgba(255,215,106,0.35)] scale-110'
                    : 'group-hover:scale-105'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-[#ffd76a] stroke-[2.3]' : 'stroke-[1.7]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#ffd76a] rounded-full shadow-[0_0_6px_#ffd76a]"></span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 font-medium transition-colors ${
                  isActive ? 'text-[#ffd76a] font-bold' : 'text-[#b09772]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
