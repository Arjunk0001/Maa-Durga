import React, { useState } from 'react';
import { X, Send, CheckCircle2, Phone, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { CommitteeMember } from '../data/pandalData';
import { playTempleBell, playShankhDhwani } from '../utils/audio';
import { submitInquiry } from '../utils/inquiryStorage';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: CommitteeMember | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  member,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    purpose: 'Puja & Bhog Sponsorship (पूजा व भोग सेवा)',
    message: '',
  });

  if (!isOpen) return null;

  const targetPhone = member?.phone || '+919450023412';
  const cleanPhoneForWa = targetPhone.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    setIsSubmitting(true);
    playTempleBell();

    await submitInquiry({
      memberName: member?.name || 'श्री शक्ति दुर्गा पूजा समिति प्रबंधन',
      memberRole: member?.role || 'कार्यकारिणी समिति',
      memberPhone: member?.phone,
      senderName: form.name.trim(),
      senderPhone: form.phone.trim(),
      purpose: form.purpose,
      message: form.message.trim(),
    });

    setIsSubmitting(false);
    setSubmitted(true);
    playShankhDhwani();
  };

  const getWhatsAppMessageUrl = () => {
    const text = `जय माँ दुर्गा! 🙏
प्रणाम ${member ? member.name + ' जी' : 'समिति'},\n
मेरा नाम: ${form.name}
फ़ोन नंबर: ${form.phone}
विषय/प्रयोजन: ${form.purpose}
संदेश: ${form.message || 'मैं दुर्गा पूजा उत्सव के संदर्भ में आपसे जुड़ना चाहता हूँ।'}`;

    return `https://wa.me/${cleanPhoneForWa}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#380606] to-[#1a0202] border border-[#ffd76a]/60 p-6 sm:p-7 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#ffd76a] cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🪔</span>
              <h3 className="font-marcellus text-xl font-bold text-[#fff7e6]">
                समिति से संपर्क व पूछताछ
              </h3>
            </div>

            {member && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-[#d9a441]/40">
                <img
                  src={member.photo}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#ffd76a]"
                />
                <div>
                  <span className="text-xs font-bold text-[#fff4d1] block">{member.name}</span>
                  <span className="text-[11px] text-[#ffd76a] block">{member.role}</span>
                  {member.phone && (
                    <span className="text-[10px] text-[#ecd6b3]/80 block font-mono">{member.phone}</span>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#eedec5] block mb-1.5">
                आपका शुभ नाम (Full Name) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. राहुल शर्मा"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[#d9a441]/40 text-[#fff7e6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd76a]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#eedec5] block mb-1.5">
                फ़ोन / WhatsApp नंबर *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[#d9a441]/40 text-[#fff7e6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd76a]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#eedec5] block mb-1.5">
                पूछताछ का विषय (Inquiry Purpose)
              </label>
              <select
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#250303] border border-[#d9a441]/40 text-[#fff7e6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd76a]"
              >
                <option value="Puja & Bhog Sponsorship (पूजा व भोग सेवा)">Puja & Bhog Sponsorship (पूजा व भोग सेवा)</option>
                <option value="Senior Citizen Special Darshan (वरिष्ठ नागरिक दर्शन)">Senior Citizen Special Darshan (वरिष्ठ नागरिक दर्शन)</option>
                <option value="Cultural Performance Participation (सांस्कृतिक प्रस्तुति)">Cultural Performance Participation (सांस्कृतिक प्रस्तुति)</option>
                <option value="Stall & Food Kiosk Allocation (मेला स्टॉल व खानपान)">Stall & Food Kiosk Allocation (मेला स्टॉल व खानपान)</option>
                <option value="General Festival Inquiry (सामान्य पूछताछ)">General Festival Inquiry (सामान्य पूछताछ)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#eedec5] block mb-1.5">
                संदेश या विवरण (Message)
              </label>
              <textarea
                rows={3}
                placeholder="अपनी बात या आवश्यकता यहाँ लिखें..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[#d9a441]/40 text-[#fff7e6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd76a]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd76a] via-[#e5b94f] to-[#d9a441] text-[#2a0404] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(255,215,106,0.6)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#2a0404]" />
                  <span>संदेश भेजा जा रहा है...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#2a0404]" />
                  <span>संदेश भेजें (Submit Inquiry)</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-3 animate-fade-in">
            <div className="w-14 h-14 bg-emerald-600/90 rounded-full flex items-center justify-center text-white mx-auto shadow-lg border-2 border-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-marcellus text-xl font-bold text-emerald-300">
                संदेश समिति को प्राप्त हो गया!
              </h3>
              <p className="text-xs sm:text-sm text-[#fff4d1] mt-1.5 font-serif">
                सादर धन्यवाद {form.name}! आपकी पूछताछ सुरक्षित दर्ज कर ली गई है। समिति पदाधिकारी शीघ्र ही आपसे <span className="font-mono text-amber-300">{form.phone}</span> पर संपर्क करेंगे।
              </p>
            </div>

            {/* Direct Connect Options */}
            <div className="pt-2 space-y-2.5">
              <a
                href={getWhatsAppMessageUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>WhatsApp पर तुरंत संदेश भेजें</span>
              </a>

              {member?.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#590a0a] hover:bg-[#781010] text-[#ffd76a] font-bold text-xs flex items-center justify-center gap-2 border border-[#d9a441]/40 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>सीधे फ़ोन करें: {member.phone}</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#ffd76a] text-xs font-semibold cursor-pointer transition-colors"
            >
              बंद करें (Close)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
