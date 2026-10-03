import React, { useState } from 'react';
import { PhoneCall, ShieldCheck, ChevronRight, User, Award, X, Mail } from 'lucide-react';
import { CommitteeMember } from '../data/pandalData';
import { playTempleBell } from '../utils/audio';

interface KeyMembersSectionProps {
  keyMembers: CommitteeMember[];
  allCommittee: CommitteeMember[];
  onOpenContact: (member?: CommitteeMember) => void;
  onOpenArjunPoster?: () => void;
}

export const KeyMembersSection: React.FC<KeyMembersSectionProps> = ({
  keyMembers,
  allCommittee,
  onOpenContact,
  onOpenArjunPoster,
}) => {
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
  const [showAllCommittee, setShowAllCommittee] = useState(false);

  const handleMemberClick = (member: CommitteeMember) => {
    playTempleBell();
    if (member.isArjun && onOpenArjunPoster) {
      onOpenArjunPoster();
      return;
    }
    setSelectedMember(member);
  };

  return (
    <section id="committee-section" className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 scroll-mt-20">
      {/* Ornate Heading */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-[#ffd76a]/60 text-sm hidden sm:inline">✤ ———</span>
        <span className="text-xl">🪔</span>
        <h2 className="font-marcellus text-2xl sm:text-3xl font-bold tracking-wide gold-gradient-text text-center">
          Our Key Members
        </h2>
        <span className="text-xl">🪔</span>
        <span className="text-[#ffd76a]/60 text-sm hidden sm:inline">——— ✤</span>
      </div>

      <p className="text-center font-body text-xs sm:text-sm text-[#d4af37]/80 mb-6 max-w-lg mx-auto">
        Dedicated stewards and community leaders preserving festival traditions and seva.
      </p>

      {/* Grid of Key Members (4 across on desktop, 2x2 on mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {keyMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => handleMemberClick(member)}
            className="group relative flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-[#400707] to-[#250303] border border-[#d9a441]/30 hover:border-[#ffd76a] hover:shadow-[0_0_18px_rgba(217,164,65,0.25)] transition-all duration-300 cursor-pointer"
          >
            {/* Arched Top Golden Halo Indicator */}
            <div className="w-10 h-1 bg-[#ffd76a]/40 rounded-full mb-2 group-hover:w-16 group-hover:bg-[#ffd76a] transition-all"></div>

            {/* Profile Photo with Golden Ring */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-[#ffd76a] via-[#d9a441] to-[#781010] shadow-md mb-3">
              <img
                src={member.photo}
                alt={member.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-[#590a0a] rounded-full border border-[#ffd76a] text-[#ffd76a]">
                <Award className="w-3 h-3" />
              </div>
            </div>

            {/* Name */}
            <h3 className="font-marcellus text-sm sm:text-base font-bold text-[#fff7e6] group-hover:text-[#ffd76a] transition-colors line-clamp-1">
              {member.name}
            </h3>

            {/* Role */}
            <span className="text-[11px] sm:text-xs font-medium text-[#ffd76a]/90 tracking-wide uppercase mt-0.5">
              {member.role}
            </span>

            {/* Contact Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playTempleBell();
                onOpenContact(member);
              }}
              className="mt-3 w-8 h-8 rounded-full bg-[#590a0a] hover:bg-[#851313] border border-[#ffd76a]/40 text-[#ffd76a] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
              title={`Contact ${member.name}`}
              aria-label={`Contact ${member.name}`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Expand Committee & Management details */}
      <div className="mt-5 text-center">
        <button
          onClick={() => {
            playTempleBell();
            setShowAllCommittee(!showAllCommittee);
          }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#400707] hover:bg-[#590a0a] border border-[#d9a441]/40 text-[#ffd76a] text-xs font-semibold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>{showAllCommittee ? 'Hide Committee Details' : 'View Full Committee & Management'}</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${showAllCommittee ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Extended Committee Grid */}
      {showAllCommittee && (
        <div className="mt-6 p-4 sm:p-6 rounded-2xl bg-[#300505]/80 border border-[#d9a441]/30 animate-fade-in">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#d9a441]/30 text-[#ffd76a]">
            <ShieldCheck className="w-5 h-5 text-[#ffd76a]" />
            <h3 className="font-marcellus text-lg font-bold">Executive Board & Coordinators</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allCommittee.map((cm) => (
              <div
                key={cm.id}
                onClick={() => handleMemberClick(cm)}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#400707]/60 hover:bg-[#590a0a] border border-[#d9a441]/20 hover:border-[#ffd76a]/60 transition-all cursor-pointer"
              >
                <img
                  src={cm.photo}
                  alt={cm.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-[#ffd76a]"
                />
                <div className="text-left flex-1 min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm text-[#fff4d1] truncate">{cm.name}</h4>
                  <span className="text-[11px] text-[#ffd76a] block truncate">{cm.role}</span>
                  <span className="text-[10px] text-[#cca574] truncate block">Since {cm.joinedYear}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEMBER PROFILE MODAL */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#400707] to-[#250303] border border-[#ffd76a]/60 p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#ffd76a] transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Avatar */}
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#ffd76a] to-[#781010] mx-auto shadow-lg mb-3">
              <img
                src={selectedMember.photo}
                alt={selectedMember.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <h3 className="font-marcellus text-xl font-bold text-[#fff7e6]">
              {selectedMember.name}
            </h3>

            <span className="inline-block px-3 py-1 rounded-full bg-[#590a0a] text-[#ffd76a] text-xs font-semibold uppercase tracking-wider mt-1 border border-[#ffd76a]/40">
              {selectedMember.role}
            </span>

            <div className="my-4 text-left p-3.5 rounded-xl bg-black/30 border border-[#d9a441]/20 text-xs text-[#eedec5] space-y-2">
              <p>
                <strong className="text-[#ffd76a]">Responsibility: </strong>
                {selectedMember.responsibility}
              </p>
              <p>
                <strong className="text-[#ffd76a]">Bio: </strong>
                {selectedMember.bio}
              </p>
              <p className="text-[#d4af37]">
                <strong>Samiti Member Since: </strong>
                {selectedMember.joinedYear}
              </p>
            </div>

            <button
              onClick={() => {
                const member = selectedMember;
                setSelectedMember(null);
                onOpenContact(member);
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#ffd76a] to-[#d9a441] text-[#2a0404] font-semibold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_15px_rgba(255,215,106,0.5)] active:scale-95 transition-all cursor-pointer"
            >
              Send Official Inquiry
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
