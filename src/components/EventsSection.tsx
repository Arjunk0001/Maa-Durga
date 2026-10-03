import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Flame, Music, Sparkles, Lamp, Waves, BellRing, Check } from 'lucide-react';
import { PandalEvent } from '../data/pandalData';
import { playTempleBell } from '../utils/audio';

interface EventsSectionProps {
  events: PandalEvent[];
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const [activeEventModal, setActiveEventModal] = useState<PandalEvent | null>(null);
  const [remindedEvents, setRemindedEvents] = useState<string[]>([]);

  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Music':
        return <Music className="w-5 h-5 text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-yellow-300" />;
      case 'Lamp':
        return <Lamp className="w-5 h-5 text-orange-400" />;
      case 'Waves':
        return <Waves className="w-5 h-5 text-cyan-400" />;
      default:
        return <Calendar className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleReminder = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playTempleBell();
    if (!remindedEvents.includes(eventId)) {
      setRemindedEvents((prev) => [...prev, eventId]);
    } else {
      setRemindedEvents((prev) => prev.filter((id) => id !== eventId));
    }
  };

  return (
    <section id="events-section" className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 scroll-mt-20">
      {/* Heading with Lotus */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪷</span>
          <h2 className="font-marcellus text-xl sm:text-2xl font-bold tracking-wide gold-gradient-text">
            Upcoming Events
          </h2>
        </div>
        <button
          onClick={() => {
            playTempleBell();
            setActiveEventModal(events[0]);
          }}
          className="text-xs font-semibold text-[#ffd76a] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List of Event Cards (matching user mockup style) */}
      <div className="space-y-2.5">
        {events.map((event) => {
          const isReminded = remindedEvents.includes(event.id);
          return (
            <div
              key={event.id}
              onClick={() => {
                playTempleBell();
                setActiveEventModal(event);
              }}
              className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#380606] via-[#480808] to-[#2d0505] border border-[#d9a441]/25 hover:border-[#ffd76a]/70 hover:shadow-[0_0_15px_rgba(217,164,65,0.2)] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-[#220303] border border-[#d9a441]/40 text-center shrink-0 group-hover:border-[#ffd76a] transition-colors">
                  <span className="font-marcellus text-base sm:text-lg font-bold text-[#ffd76a] leading-none">
                    {event.date.split(' ')[0]}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase text-[#f1ddbe] leading-none mt-0.5">
                    {event.date.split(' ')[1]}
                  </span>
                </div>

                {/* Event Icon */}
                <div className="p-2 rounded-lg bg-black/30 border border-[#d9a441]/20 shrink-0">
                  {getEventIcon(event.iconName)}
                </div>

                {/* Event Info */}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-marcellus text-sm sm:text-base font-bold text-[#fff7e6] group-hover:text-[#ffd76a] transition-colors">
                      {event.title}
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.2 rounded-full bg-[#590a0a] text-[10px] text-[#ffd76a] font-medium">
                      {event.dayLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#d9a441]/80 mt-0.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>

              {/* Right Arrow & Reminder Trigger */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleReminder(event.id, e)}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    isReminded
                      ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-400'
                      : 'bg-black/20 text-[#ffd76a]/60 hover:text-[#ffd76a] border border-transparent hover:border-[#ffd76a]/40'
                  }`}
                  title={isReminded ? 'Reminder Set' : 'Set Event Reminder'}
                  aria-label="Set reminder"
                >
                  {isReminded ? <Check className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
                </button>
                <ChevronRight className="w-4 h-4 text-[#ffd76a]/60 group-hover:text-[#ffd76a] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* EVENT DETAIL MODAL */}
      {activeEventModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveEventModal(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-gradient-to-b from-[#400707] to-[#250303] border border-[#ffd76a]/60 p-6 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#d9a441]/30">
              <span className="px-3 py-1 rounded-full bg-[#590a0a] text-[#ffd76a] text-xs font-semibold uppercase">
                {activeEventModal.date} • {activeEventModal.dayLabel}
              </span>
              <button
                onClick={() => setActiveEventModal(null)}
                className="text-[#ffd76a] text-sm hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>

            <h3 className="font-marcellus text-xl font-bold text-[#fff7e6] mt-4">
              {activeEventModal.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-[#ffd76a] my-2">
              <Clock className="w-4 h-4" />
              <span>{activeEventModal.time}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#eedec5] mb-4">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>{activeEventModal.venue}</span>
            </div>

            <p className="font-body text-xs sm:text-sm text-[#e8d2b0] leading-relaxed mb-5 bg-black/30 p-3.5 rounded-xl border border-[#d9a441]/20">
              {activeEventModal.description}
            </p>

            <button
              onClick={() => {
                const title = encodeURIComponent(`Durga Puja: ${activeEventModal.title}`);
                const details = encodeURIComponent(activeEventModal.description);
                const loc = encodeURIComponent(`Shree Shakti Pandal, ${activeEventModal.venue}, Lucknow`);
                const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${loc}`;
                window.open(googleCalUrl, '_blank');
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#ffd76a] to-[#d9a441] text-[#2a0404] font-semibold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_15px_rgba(255,215,106,0.5)] active:scale-95 transition-all text-center block cursor-pointer"
            >
              Add to Google Calendar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
