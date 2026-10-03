import React, { useState, useEffect } from 'react';
import {
  Crown,
  ShieldCheck,
  User,
  Lock,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { verifyDatabaseLogin, verifySuperAdminLogin } from '../firebase/dbAuth';
import { playTempleBell } from '../utils/audio';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'super_admin' | 'admin';
}

export const AdminPinModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'admin',
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'super_admin'>(
    initialMode === 'super_admin' ? 'super_admin' : 'admin'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode === 'super_admin' ? 'super_admin' : 'admin');
      setErrorMsg(null);
      setSuccessMsg(null);
      setUsername('');
      setPassword('');
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('कृपया यूज़रनेम और पासवर्ड दोनों दर्ज करें।');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const result =
      activeTab === 'super_admin'
        ? await verifySuperAdminLogin(username, password)
        : await verifyDatabaseLogin(username, password);

    setIsVerifying(false);

    if (result.success) {
      playTempleBell();
      setSuccessMsg(result.message || 'सत्यापन सफल! स्वागत है।');
      setTimeout(() => {
        onSuccess();
      }, 400);
    } else {
      setErrorMsg(result.message || 'अमान्य क्रेडेंशियल्स! कृपया पुनः प्रयास करें।');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-slate-800">
      <div
        className={`w-full max-w-md bg-white border border-[#e5d8c3] rounded-3xl shadow-2xl overflow-hidden relative ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Top Accent Line */}
        <div className="h-2 bg-gradient-to-r from-[#801313] via-[#d9a441] to-[#801313]" />

        {/* Close Button */}
        <button
          onClick={() => {
            playTempleBell();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Header Icon & Title */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#3a0606] to-[#690d0d] flex items-center justify-center text-[#ffd76a] shadow-lg border border-[#d9a441]/40 mb-3">
              {activeTab === 'super_admin' ? (
                <Crown className="w-6 h-6 text-[#ffd76a]" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-[#ffd76a]" />
              )}
            </div>

            <h3 className="font-marcellus text-xl sm:text-2xl font-bold text-[#3a0606]">
              {activeTab === 'super_admin' ? 'सुपर एडमिन लॉगिन' : 'समिति एडमिन लॉगिन'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-serif">
              श्री शक्ति दुर्गा पूजा समिति • अधिकृत प्रबंधन पोर्टल
            </p>
          </div>

          {/* Interactive Slide Selector (Default: Admin on Left, Super Admin on Right) */}
          <div className="relative flex rounded-xl bg-slate-100 p-1 mb-5 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-[#3a0606] to-[#5a0909] text-[#ffd76a] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>समिति एडमिन</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('super_admin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'super_admin'
                  ? 'bg-gradient-to-r from-[#3a0606] to-[#5a0909] text-[#ffd76a] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>सुपर एडमिन</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                यूज़रनेम
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-[#d9a441]" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="यूज़रनेम दर्ज करें"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d9a441] focus:bg-white transition-all"
                  autoFocus
                  autoCapitalize="none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                पासवर्ड
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-[#d9a441]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="पासवर्ड दर्ज करें"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d9a441] focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="font-semibold leading-tight">{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#4d0808] via-[#750e0e] to-[#4d0808] hover:from-[#610a0a] hover:to-[#610a0a] text-[#ffd76a] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#ffd76a]" />
                  <span>सत्यापन हो रहा है...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#ffd76a]" />
                  <span>
                    {activeTab === 'super_admin'
                      ? 'सुपर एडमिन लॉगिन'
                      : 'समिति पोर्टल में प्रवेश'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Clean Confidentiality Notice */}
          <div className="mt-5 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              🔒 केवल अधिकृत पदाधिकारियों हेतु सुरक्षित
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
