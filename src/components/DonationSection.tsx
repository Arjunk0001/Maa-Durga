import React, { useState } from 'react';
import { Heart, CheckCircle2, QrCode, CreditCard, Landmark, ArrowRight, X, Sparkles, Printer, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';
import { playTempleBell, playShankhDhwani } from '../utils/audio';

interface DonationSectionProps {
  onSuccessToast?: (msg: string) => void;
  upiId?: string;
  payeeName?: string;
  donationAmounts?: number[];
}

export const DonationSection: React.FC<DonationSectionProps> = ({
  onSuccessToast,
  upiId: propUpiId,
  payeeName: propPayeeName,
  donationAmounts: propDonationAmounts,
}) => {
  const presets = propDonationAmounts && propDonationAmounts.length > 0 ? propDonationAmounts : [51, 101, 501, 1001, 2001];
  const upiId = propUpiId || 'ak6412883@okhdfcbank';
  const payeeName = propPayeeName || 'Shree Shakti Durga Puja Samiti';

  const [selectedAmount, setSelectedAmount] = useState<number>(presets.includes(501) ? 501 : presets[0] || 501);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'processing' | 'success'>('method');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    receiptId: string;
    amount: number;
    name: string;
    date: string;
    upiId: string;
  } | null>(null);

  const handleSelectPreset = (amount: number) => {
    playTempleBell();
    setSelectedAmount(amount);
    setIsCustom(false);
  };

  const handleCustomClick = () => {
    playTempleBell();
    setIsCustom(true);
  };

  const currentDonationAmount = isCustom
    ? parseInt(customAmount, 10) || 501
    : selectedAmount;

  // Build standard UPI Deep Link URL with payee and selected amount
  const buildUpiUrl = (appScheme: string = 'upi') => {
    const note = encodeURIComponent('Durga Puja Samarpan');
    const pn = encodeURIComponent(payeeName);
    const params = `pa=${upiId}&pn=${pn}&am=${currentDonationAmount}&cu=INR&tn=${note}`;
    
    if (appScheme === 'gpay') {
      return `tez://upi/pay?${params}`;
    }
    if (appScheme === 'phonepe') {
      return `phonepe://pay?${params}`;
    }
    if (appScheme === 'paytm') {
      return `paytmmp://pay?${params}`;
    }
    return `upi://pay?${params}`;
  };

  const genericUpiUrl = buildUpiUrl('upi');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(genericUpiUrl)}`;

  const handleLaunchUpi = (appScheme: string = 'upi') => {
    playTempleBell();
    const url = buildUpiUrl(appScheme);
    
    // Attempt opening UPI app
    window.location.href = url;
    
    // Also open modal so user sees the QR code as backup & can claim 80G receipt
    setTimeout(() => {
      setIsModalOpen(true);
    }, 400);
  };

  const handleOpenDonateModal = () => {
    playTempleBell();
    setPaymentStep('method');
    setIsModalOpen(true);
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    playTempleBell();
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleConfirmPayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      const generatedId = `DP2026${Math.floor(1000 + Math.random() * 9000)}`;
      const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      setReceiptData({
        receiptId: generatedId,
        amount: currentDonationAmount,
        name: donorName || 'Devotee',
        date: today,
        upiId,
      });
      setPaymentStep('success');
      playTempleBell();
      playShankhDhwani();
      if (onSuccessToast) {
        onSuccessToast(`Pooja donation of ₹${currentDonationAmount} registered!`);
      }
    }, 1200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <section id="donation-section" className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 scroll-mt-20">
      {/* Devotional Parchment/Maroon Support Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#4a0808] via-[#3a0606] to-[#250303] border border-[#ffd76a]/40 p-5 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glowing Diya Illustration in the corner */}
        <div className="absolute right-4 top-4 sm:right-8 sm:top-8 opacity-90 pointer-events-none">
          <div className="relative flex flex-col items-center">
            {/* Diya Flame */}
            <div className="animate-flame w-5 h-8 bg-gradient-to-t from-red-600 via-amber-400 to-yellow-100 rounded-full [clip-path:polygon(50%_0%,100%_65%,75%_100%,25%_100%,0%_65%)] shadow-[0_0_20px_#ffd76a]"></div>
            {/* Brass Bowl */}
            <div className="w-12 h-4 bg-gradient-to-r from-[#ffd76a] via-[#d9a441] to-[#8c5a14] rounded-b-full shadow-lg -mt-0.5"></div>
            <div className="w-16 h-2 bg-[#ffd76a]/20 rounded-full blur-xs mt-0.5"></div>
          </div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center gap-2 mb-2">
          <span className="text-xl">🪷</span>
          <h2 className="font-marcellus text-xl sm:text-2xl font-bold tracking-wide gold-gradient-text">
            Support Our Puja (दान एवं सहयोग)
          </h2>
        </div>

        <p className="relative z-10 font-body text-xs sm:text-sm text-[#f0dfc5] max-w-lg mb-4 leading-relaxed">
          Your contribution helps us keep our sacred tradition alive and brings daily bhog prasad, grand illumination, and Maa Durga's divine blessings to thousands of devotees.
        </p>

        {/* Official Samiti UPI Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1b0202] border border-[#ffd76a]/40 text-xs mb-5">
          <span className="text-[#ffd76a] font-semibold">Samiti Official UPI:</span>
          <span className="font-mono text-[#fff7e6] font-bold">{upiId}</span>
          <button
            onClick={handleCopyUpiId}
            className="p-1 rounded-md hover:bg-[#3d0606] text-[#ffd76a] transition-all cursor-pointer"
            title="Copy UPI ID"
          >
            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Preset Amount Buttons */}
        <div className="relative z-10 grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-4">
          {presets.map((amount) => (
            <button
              key={amount}
              onClick={() => handleSelectPreset(amount)}
              className={`py-2.5 px-2 rounded-xl text-center font-marcellus text-sm sm:text-base font-bold transition-all cursor-pointer ${
                !isCustom && selectedAmount === amount
                  ? 'bg-gradient-to-r from-[#ffd76a] to-[#d9a441] text-[#2a0404] shadow-[0_0_15px_rgba(255,215,106,0.4)] scale-105'
                  : 'bg-[#2a0404]/80 text-[#f3e3be] hover:bg-[#590a0a] border border-[#d9a441]/30'
              }`}
            >
              ₹{amount.toLocaleString('en-IN')}
            </button>
          ))}

          {/* Custom Amount Button */}
          <button
            onClick={handleCustomClick}
            className={`py-2.5 px-2 rounded-xl text-center font-marcellus text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isCustom
                ? 'bg-gradient-to-r from-[#ffd76a] to-[#d9a441] text-[#2a0404] shadow-[0_0_15px_rgba(255,215,106,0.4)] scale-105'
                : 'bg-[#2a0404]/80 text-[#f3e3be] hover:bg-[#590a0a] border border-[#d9a441]/30'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Custom Input Field */}
        {isCustom && (
          <div className="relative z-10 mb-5 max-w-xs animate-fade-in">
            <label className="text-xs text-[#ffd76a] font-medium block mb-1">
              Enter Custom Amount (₹):
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#ffd76a] font-bold text-base">₹</span>
              <input
                type="number"
                min="11"
                placeholder="5000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-[#1d0303] border border-[#ffd76a] text-[#fff7e6] text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd76a]"
              />
            </div>
          </div>
        )}

        {/* Primary Donate CTA Buttons: Direct UPI App Launch & Modal Details */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3">
          {/* Main Direct UPI App Trigger */}
          <a
            href={genericUpiUrl}
            onClick={() => {
              playTempleBell();
              setTimeout(() => setIsModalOpen(true), 400);
            }}
            className="flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#16a34a] via-[#15803d] to-[#14532d] hover:from-[#22c55e] hover:to-[#16a34a] text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] active:scale-95 transition-all cursor-pointer border border-[#ffd76a]/60 text-center"
          >
            <Smartphone className="w-5 h-5 text-[#ffd76a]" />
            <span>Pay ₹{currentDonationAmount.toLocaleString('en-IN')} via UPI App</span>
          </a>

          {/* Scan QR / 80G Receipt Details */}
          <button
            onClick={handleOpenDonateModal}
            className="px-6 py-3.5 rounded-2xl bg-[#2a0404] hover:bg-[#3d0606] text-[#ffd76a] font-semibold text-xs sm:text-sm border border-[#ffd76a]/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR & Tax Receipt</span>
          </button>
        </div>

        {/* Instant UPI App Icons */}
        <div className="relative z-10 flex items-center gap-2 mt-4 pt-3 border-t border-[#d9a441]/20 flex-wrap">
          <span className="text-[11px] text-[#eedec5]/80">Pay instantly via:</span>
          
          <button
            onClick={() => handleLaunchUpi('gpay')}
            className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/70 border border-[#ffd76a]/30 text-[11px] text-[#ffd76a] font-medium flex items-center gap-1 cursor-pointer transition-all"
          >
            <span>Google Pay</span>
          </button>

          <button
            onClick={() => handleLaunchUpi('phonepe')}
            className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/70 border border-[#ffd76a]/30 text-[11px] text-[#ffd76a] font-medium flex items-center gap-1 cursor-pointer transition-all"
          >
            <span>PhonePe</span>
          </button>

          <button
            onClick={() => handleLaunchUpi('paytm')}
            className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/70 border border-[#ffd76a]/30 text-[11px] text-[#ffd76a] font-medium flex items-center gap-1 cursor-pointer transition-all"
          >
            <span>Paytm</span>
          </button>

          <button
            onClick={() => handleLaunchUpi('upi')}
            className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/70 border border-[#ffd76a]/30 text-[11px] text-[#ffd76a] font-medium flex items-center gap-1 cursor-pointer transition-all"
          >
            <span>BHIM UPI</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="relative z-10 flex items-center gap-4 mt-3 text-[11px] text-[#ffd76a]/75 flex-wrap">
          <span>🔒 100% Direct to Mandir UPI ({upiId})</span>
          <span>•</span>
          <span>80G Tax Exemption</span>
          <span>•</span>
          <span>Instant Digital Receipt</span>
        </div>
      </div>

      {/* DONATION & PAYMENT MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#380606] via-[#240303] to-[#140101] border border-[#ffd76a]/60 p-5 sm:p-6 shadow-2xl text-left max-h-[92vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#ffd76a] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: PAYMENT METHOD & DONOR DETAILS */}
            {paymentStep === 'method' && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🙏</span>
                  <h3 className="font-marcellus text-xl font-bold text-[#fff7e6]">
                    Contribute ₹{currentDonationAmount.toLocaleString('en-IN')}
                  </h3>
                </div>

                <p className="text-xs text-[#ffd76a] mb-4">
                  Payment recipient: <span className="font-mono font-bold text-[#fff7e6]">{upiId}</span>
                </p>

                {/* Scannable Dynamic UPI QR Code Card */}
                <div className="p-3.5 rounded-2xl bg-[#1b0202] border border-[#ffd76a]/40 mb-4 flex flex-col items-center text-center">
                  <div className="p-2 rounded-xl bg-white shadow-lg mb-2">
                    <img
                      src={qrCodeUrl}
                      alt="UPI QR Code"
                      className="w-40 h-40 object-contain"
                    />
                  </div>

                  <p className="text-[11px] text-[#ffd76a] font-medium">
                    Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)
                  </p>
                  <p className="text-[10px] text-[#eedec5]/70 mt-0.5">
                    Pre-filled with ₹{currentDonationAmount} for {payeeName}
                  </p>

                  <div className="flex items-center gap-2 mt-2 w-full">
                    <a
                      href={genericUpiUrl}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#15803d] hover:from-[#22c55e] hover:to-[#16a34a] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Open in UPI App</span>
                    </a>

                    <button
                      onClick={handleCopyUpiId}
                      className="px-3 py-2 rounded-xl bg-[#2a0404] hover:bg-[#450707] border border-[#ffd76a]/40 text-[#ffd76a] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields for 80G Receipt */}
                <div className="space-y-2.5 mb-4">
                  <div>
                    <label className="text-[11px] text-[#eedec5] block mb-1">Donor Name / Devotee Name (For 80G Receipt)</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Chandra & Family"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[#d9a441]/40 text-[#fff7e6] text-xs focus:outline-none focus:border-[#ffd76a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#eedec5] block mb-1">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[#d9a441]/40 text-[#fff7e6] text-xs focus:outline-none focus:border-[#ffd76a]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#eedec5] block mb-1">Email for Receipt</label>
                      <input
                        type="email"
                        placeholder="devotee@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[#d9a441]/40 text-[#fff7e6] text-xs focus:outline-none focus:border-[#ffd76a]"
                      />
                    </div>
                  </div>
                </div>

                {/* Confirm Action */}
                <button
                  onClick={handleConfirmPayment}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#ffd76a] to-[#d9a441] text-[#2a0404] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_15px_rgba(255,215,106,0.5)] active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>I Have Completed Payment / Generate Receipt</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: PROCESSING SIMULATION */}
            {paymentStep === 'processing' && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full border-3 border-[#ffd76a] border-t-transparent animate-spin"></div>
                <h4 className="font-marcellus text-lg text-[#fff7e6]">
                  Verifying Sacred Contribution...
                </h4>
                <p className="text-xs text-[#d9a441]">Recording donation to {upiId} & generating 80G tax receipt</p>
              </div>
            )}

            {/* STEP 3: DONATION SUCCESS & PRINTABLE RECEIPT */}
            {paymentStep === 'success' && receiptData && (
              <div className="space-y-4 text-center animate-fade-in">
                <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="font-marcellus text-xl font-bold text-emerald-300">
                  ✓ Donation Registered & Blessed
                </h3>

                <p className="text-xs text-[#fff4d1]">
                  Thank you for supporting <br />
                  <strong className="font-marcellus text-sm text-[#ffd76a]">
                    Shree Shakti Durga Puja Samiti
                  </strong>
                </p>

                {/* Printable Receipt Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#250303] to-[#150101] border border-[#d9a441]/40 text-left text-xs space-y-2 shadow-inner">
                  <div className="flex justify-between pb-2 border-b border-[#d9a441]/20">
                    <span className="text-[#d9a441]">Receipt ID:</span>
                    <span className="font-mono font-bold text-[#ffd76a]">{receiptData.receiptId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#eedec5]">Donor:</span>
                    <span className="font-semibold text-white">{receiptData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#eedec5]">Amount:</span>
                    <span className="font-bold text-emerald-400 text-sm">₹{receiptData.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#eedec5]">Recipient UPI:</span>
                    <span className="font-mono text-[#ffd76a]">{receiptData.upiId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#eedec5]">Date:</span>
                    <span className="text-white">{receiptData.date}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#d9a441]/20">
                    <span className="text-[#eedec5]">Status:</span>
                    <span className="text-emerald-400 font-semibold">Verified / 80G Tax Exempt</span>
                  </div>
                </div>

                {/* Actions: Download / Print */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handlePrintReceipt}
                    className="flex-1 py-2.5 rounded-xl bg-[#590a0a] hover:bg-[#781010] border border-[#ffd76a]/40 text-[#ffd76a] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save Receipt</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setPaymentStep('method');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd76a] to-[#d9a441] text-[#2a0404] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
