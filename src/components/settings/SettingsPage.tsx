import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Palette,
  Camera,
  Phone,
  Mail,
  MapPin,
  Lock,
  KeyRound,
  Fingerprint,
  Check,
  Save,
  Sparkles,
  AlertCircle,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldAlert,
  Smartphone,
  CheckCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Language } from '../../types';

interface SettingsPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  role: 'customer' | 'business';
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  language,
  setLanguage,
  role,
}) => {
  const { user, updateUserProfile } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const isBn = language === 'bn';
  const isCustomer = role === 'customer';

  // Active Settings Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance'>('profile');

  // Profile Form States
  const [name, setName] = useState<string>(user?.name || '');
  const [nameBn, setNameBn] = useState<string>(user?.nameBn || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [email, setEmail] = useState<string>(
    user?.email || (isCustomer ? 'tanvir971hasan@gmail.com' : 'shahid.telecom@upayagent.bd')
  );
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);
  const [selectedAvatarPreset, setSelectedAvatarPreset] = useState<number | null>(null);

  // Business Specific Details
  const [businessName, setBusinessName] = useState<string>(user?.businessName || '');
  const [tradeLicense, setTradeLicense] = useState<string>(user?.tradeLicenseNumber || 'TRD-DNJ-2024-8841');
  const [shopAddress, setShopAddress] = useState<string>(
    user?.shopAddress || (isBn ? 'গণেশতলা মোড়, সদর বাজার, দিনাজপুর' : 'Goneshtola Mor, Sadar Bazar, Dinajpur')
  );

  // Security Form States
  const [currentPin, setCurrentPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [showCurrentPin, setShowCurrentPin] = useState<boolean>(false);
  const [showNewPin, setShowNewPin] = useState<boolean>(false);
  const [showConfirmPin, setShowConfirmPin] = useState<boolean>(false);

  // Security Toggles
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(user?.biometricEnabled ?? true);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(true);
  const [smsAlerts, setSmsAlerts] = useState<boolean>(true);

  // UI Feedback States
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState<string | null>(null);
  const [securityErrorMsg, setSecurityErrorMsg] = useState<string | null>(null);

  // Preset Avatars for Instant Selection
  const avatarPresets = [
    { id: 1, label: 'Avatar 1', bg: 'bg-amber-400 text-slate-950', initials: name ? name[0] : 'U' },
    { id: 2, label: 'Avatar 2', bg: 'bg-blue-600 text-white', initials: name ? name[0] : 'U' },
    { id: 3, label: 'Avatar 3', bg: 'bg-emerald-600 text-white', initials: name ? name[0] : 'U' },
    { id: 4, label: 'Avatar 4', bg: 'bg-purple-600 text-white', initials: name ? name[0] : 'U' },
    { id: 5, label: 'Avatar 5', bg: 'bg-slate-900 text-amber-400 border border-amber-400', initials: name ? name[0] : 'U' },
  ];

  // Image Upload Simulation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setSelectedAvatarPreset(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Save Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setProfileSuccessMsg(isBn ? 'সঠিক ইমেইল ঠিকানা দিন' : 'Please enter a valid email address');
      return;
    }
    if (phone.length < 10) {
      setProfileSuccessMsg(isBn ? 'সঠিক ফোন নম্বর দিন' : 'Please enter a valid phone number');
      return;
    }

    updateUserProfile({
      name,
      nameBn,
      phone,
      email,
      avatarUrl,
      businessName,
      tradeLicenseNumber: tradeLicense,
      shopAddress,
      biometricEnabled,
    });

    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#F59E0B', '#FBBF24', '#10B981'],
    });

    setProfileSuccessMsg(isBn ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে!' : 'Profile updated successfully!');
    setTimeout(() => setProfileSuccessMsg(null), 3500);
  };

  // PIN / Password Update Handler
  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityErrorMsg(null);
    setSecuritySuccessMsg(null);

    if (!currentPin) {
      setSecurityErrorMsg(isBn ? 'বর্তমান পিন প্রদান করুন।' : 'Current PIN is required.');
      return;
    }
    if (newPin.length < 4 || newPin.length > 6) {
      setSecurityErrorMsg(isBn ? 'নতুন পিন অবশ্যই ৪ থেকে ৬ ডিজিটের হতে হবে।' : 'New PIN must be between 4 and 6 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setSecurityErrorMsg(isBn ? 'নতুন পিন ও কনফার্ম পিন মেলেনি।' : 'PIN confirmation does not match.');
      return;
    }

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#10B981', '#F59E0B'],
    });

    setSecuritySuccessMsg(
      isBn
        ? 'পিন সফলভাবে পরিবর্তিত হয়েছে! পরবর্তী লেনদেনে নতুন পিন ব্যবহার করুন।'
        : 'PIN changed successfully! Use your new PIN for future transactions.'
    );
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => setSecuritySuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden transition-colors">
        {/* Signature Yellow Brand Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-2xl shrink-0 border border-amber-400/30">
              <User className="w-7 h-7 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {isBn ? 'অ্যাকাউন্ট ও সিস্টেম সেটিংস' : 'Account Settings'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                  {isCustomer ? (isBn ? 'গ্রাহক' : 'Customer') : (isBn ? 'বিজনেস স্যুট' : 'Business Suite')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isBn
                  ? 'আপনার প্রোফাইল তথ্য, নিরাপত্তা পিন ও অ্যাপ্লিকেশন থিম পরিবর্তন করুন।'
                  : 'Manage your personal profile, security PIN, and application appearance.'}
              </p>
            </div>
          </div>

          {/* Quick Language Toggle in Header */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 self-start md:self-center">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isBn
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                !isBn
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{isBn ? '১. প্রোফাইল তথ্য' : '1. Profile Settings'}</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isBn ? '২. নিরাপত্তা ও পিন' : '2. Security & PIN'}</span>
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>{isBn ? '৩. থিম ও রঙ' : '3. Appearance & Theme'}</span>
          </button>
        </div>
      </div>

      {/* 1. PROFILE SETTINGS TAB */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {profileSuccessMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          {/* Profile Overview & Picture Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group shrink-0">
                <div className={`w-28 h-28 rounded-3xl overflow-hidden border-2 flex items-center justify-center font-black text-3xl shadow-lg transition-transform ${
                  avatarUrl
                    ? 'border-amber-400 bg-slate-950'
                    : selectedAvatarPreset !== null
                    ? avatarPresets.find((p) => p.id === selectedAvatarPreset)?.bg
                    : 'border-amber-400 bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-200 text-slate-950'
                }`}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{name ? name[0] : (isCustomer ? 'T' : 'S')}</span>
                  )}
                </div>
                <label
                  htmlFor="settings-avatar-upload"
                  className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md cursor-pointer transition transform active:scale-95 border-2 border-white dark:border-slate-900"
                  title={isBn ? 'ছবি পরিবর্তন' : 'Upload photo'}
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="settings-avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isBn ? 'প্রোফাইল ছবি' : 'Profile Picture'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isBn
                      ? 'নিজের ছবি আপলোড করুন অথবা ফিনটেক কালার প্রিসেট বেছে নিন।'
                      : 'Upload a custom photo or choose from vibrant fintech avatar colors.'}
                  </p>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">
                    {isBn ? 'প্রিসেট:' : 'Presets:'}
                  </span>
                  {avatarPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatarPreset(preset.id);
                        setAvatarUrl(undefined);
                      }}
                      className={`w-7 h-7 rounded-xl ${preset.bg} flex items-center justify-center text-xs font-bold shadow-sm transition hover:scale-110 cursor-pointer ${
                        selectedAvatarPreset === preset.id && !avatarUrl
                          ? 'ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-slate-900'
                          : ''
                      }`}
                      title={preset.label}
                    >
                      {preset.initials}
                    </button>
                  ))}
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl(undefined)}
                      className="text-[11px] font-bold text-red-500 hover:underline ml-2 cursor-pointer"
                    >
                      {isBn ? 'মুছুন' : 'Remove'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                  <User className="w-4 h-4 text-amber-500" />
                  <span>{isBn ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}</span>
                </div>
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      {isBn ? 'পুরো নাম (ইংরেজি):' : 'Full Name (English):'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      {isBn ? 'পুরো নাম (বাংলা):' : 'Full Name (Bengali):'}
                    </label>
                    <input
                      type="text"
                      value={nameBn}
                      onChange={(e) => setNameBn(e.target.value)}
                      placeholder="যেমন: তানভীর আহমেদ"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      {isBn ? 'মোবাইল নম্বর:' : 'Mobile Number (Account ID):'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="01711-XXXXXX"
                        className="w-full pl-9 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      {isBn ? 'ইমেইল ঠিকানা:' : 'Email Address:'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="user@example.com"
                        className="w-full pl-9 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account KYC & Entity Details */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>{isBn ? 'কেওয়াইসি ও এলাকা বিবরণ' : 'Account Verification & Location'}</span>
                </div>
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      {isBn ? 'কেওয়াইসি ভেরিফিকেশন স্ট্যাটাস:' : 'KYC Verification Status:'}
                    </label>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <CheckCheck className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-slate-900 dark:text-white">{user?.kycTier || 'Tier 2 (Full KYC)'}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-400">
                        {isBn ? 'যাচাইকৃত' : 'Verified'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      {isBn ? 'নির্ধারিত ক্লাস্টার / জোন:' : 'Primary Cluster / Zone:'}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        readOnly
                        value={isBn ? user?.zoneBn || 'দিনাজপুর সদর' : user?.zone || 'Dinajpur Sadar'}
                        className="w-full pl-9 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-600 dark:text-slate-400 cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>
                  {!isCustomer && (
                    <>
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                          {isBn ? 'ট্রেড লাইসেন্স নম্বর:' : 'Trade License Number:'}
                        </label>
                        <input
                          type="text"
                          value={tradeLicense}
                          onChange={(e) => setTradeLicense(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                          {isBn ? 'দোকান / ব্যবসার ঠিকানা:' : 'Shop / Business Address:'}
                        </label>
                        <input
                          type="text"
                          value={shopAddress}
                          onChange={(e) => setShopAddress(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 transition transform active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isBn ? 'প্রোফাইল পরিবর্তন সংরক্ষণ করুন' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. SECURITY SETTINGS TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {securitySuccessMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{securitySuccessMsg}</span>
            </div>
          )}
          {securityErrorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-800 dark:text-red-300 rounded-2xl p-4 flex items-center gap-3 text-xs font-bold animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{securityErrorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Change Password / PIN Form Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>{isBn ? 'নিরাপত্তা পিন পরিবর্তন করুন' : 'Change Security PIN / Password'}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn
                  ? 'আপনার পিন বা পাসওয়ার্ড গোপন রাখুন। কখনো কারো সাথে শেয়ার করবেন না।'
                  : 'Your PIN or password protects your wallet transactions. Never share it with anyone.'}
              </p>

              <form onSubmit={handleUpdateSecurity} className="space-y-4 text-xs">
                {/* Current PIN */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    {isBn ? 'বর্তমান পিন (Current PIN):' : 'Current PIN:'}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showCurrentPin ? 'text' : 'password'}
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value)}
                      maxLength={6}
                      placeholder="••••"
                      required
                      className="w-full pl-9 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono tracking-widest focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPin(!showCurrentPin)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New PIN */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    {isBn ? 'নতুন পিন (New PIN):' : 'New PIN:'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showNewPin ? 'text' : 'password'}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      maxLength={6}
                      placeholder="••••"
                      required
                      className="w-full pl-9 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono tracking-widest focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New PIN */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    {isBn ? 'নতুন পিন নিশ্চিত করুন:' : 'Confirm New PIN:'}
                  </label>
                  <div className="relative">
                    <Check className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showConfirmPin ? 'text' : 'password'}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      maxLength={6}
                      placeholder="••••"
                      required
                      className="w-full pl-9 pr-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono tracking-widest focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 transition transform active:scale-95 cursor-pointer"
                >
                  {isBn ? 'পিন পরিবর্তন নিশ্চিত করুন' : 'Confirm PIN Change'}
                </button>
              </form>
            </div>

            {/* Advanced Security & Verification Controls Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>{isBn ? 'সিকিউরিটি ফিচার ও নিরাপত্তা টগল' : 'Security Verification & Toggles'}</span>
              </div>

              {/* Biometric Toggle Switch */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {isBn ? 'বায়োমেট্রিক লগইন (আঙুলের ছাপ)' : 'Biometric Quick Access'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? 'ডিভাইস সেন্সর দিয়ে দ্রুত পেমেন্ট অনুমোদন' : 'Authorize quick transactions with biometrics'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBiometricEnabled(!biometricEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    biometricEnabled ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-slate-950 transform transition-transform absolute top-1 ${
                      biometricEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Two-Factor Authentication Switch */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {isBn ? 'টু-ফ্যাক্টর এসএমএস যাচাই (2FA)' : 'Two-Factor SMS Verification'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? 'অচেনা ডিভাইসে লগইনে ওটিপি যাচাই' : 'Require OTP confirmation on untrusted devices'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    twoFactorAuth ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-slate-950 transform transition-transform absolute top-1 ${
                      twoFactorAuth ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Instant Fraud Anomaly Protection notice */}
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{isBn ? 'এআই প্রতারণা প্রতিরোধ সক্রিয়' : 'AI Fraud Shield Active'}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-amber-300/80">
                  {isBn
                    ? 'উপায়পালস এআই লেনদেনের ভেলোসিটি প্যাটার্ন পর্যবেক্ষণ করে গ্রাহকের আর্থিক নিরাপত্তা নিশ্চিত করে।'
                    : 'UpayPulse AI automatically monitors anomalous velocity patterns and restricts suspicious money movements.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. APPEARANCE SETTINGS TAB */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Palette className="w-4 h-4 text-amber-500" />
                <span>{isBn ? 'থিম ও ডিসপ্লে কাস্টমাইজেশন' : 'Theme Mode Customization'}</span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300">
                {isBn
                  ? `বর্তমান: ${themeMode === 'light' ? 'লাইট মোড' : themeMode === 'dark' ? 'ডার্ক মোড' : 'সিস্টেম'}`
                  : `Active: ${themeMode.toUpperCase()}`}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn
                ? 'আপনার পছন্দসই ভিউ বেছে নিন। লাইট মোডে পরিষ্কার সাদা সারফেস ও হলুদ অ্যাকসেন্ট এবং ডার্ক মোডে ডিপ স্লেট ব্যাকগ্রাউন্ড প্রদর্শিত হয়।'
                : 'Select your preferred visual appearance. Changes apply instantly and are saved permanently.'}
            </p>

            {/* 3 Interactive Theme Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Option 1: Light Mode */}
              <div
                onClick={() => setThemeMode('light')}
                className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between ${
                  themeMode === 'light'
                    ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-400/5 shadow-md shadow-amber-400/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
                      <Sun className="w-5 h-5" />
                    </div>
                    {themeMode === 'light' && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-slate-950">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {isBn ? 'লাইট মোড (Light Mode)' : 'Light Mode'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {isBn
                      ? 'উজ্জ্বল সাদা ব্যাকগ্রাউন্ড, উচ্চ কনট্রাস্ট এবং সিগনেচার হলুদ অ্যাকসেন্ট।'
                      : 'Clean white surfaces, high-contrast dark text, and signature yellow highlights.'}
                  </p>
                </div>
              </div>

              {/* Option 2: Dark Mode */}
              <div
                onClick={() => setThemeMode('dark')}
                className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between ${
                  themeMode === 'dark'
                    ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-400/5 shadow-md shadow-amber-400/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-sm border border-slate-700">
                      <Moon className="w-5 h-5" />
                    </div>
                    {themeMode === 'dark' && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-slate-950">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {isBn ? 'ডার্ক মোড (Dark Mode)' : 'Dark Mode'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {isBn
                      ? 'রাতের ব্যবহারের জন্য আরামদায়ক গভীর স্লেট ব্যাকগ্রাউন্ড ও সোনালি আলো।'
                      : 'Deep slate background with vibrant gold highlights, comfortable for night viewing.'}
                  </p>
                </div>
              </div>

              {/* Option 3: System Default */}
              <div
                onClick={() => setThemeMode('system')}
                className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between ${
                  themeMode === 'system'
                    ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-400/5 shadow-md shadow-amber-400/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shadow-sm border border-blue-500/20">
                      <Laptop className="w-5 h-5" />
                    </div>
                    {themeMode === 'system' && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-slate-950">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {isBn ? 'সিস্টেম ডিফল্ট (System)' : 'System Default'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {isBn
                      ? 'আপনার ফোন বা কম্পিউটারের অপারেটিং সিস্টেম সেটিংসের সাথে স্বয়ংক্রিয়ভাবে মিলবে।'
                      : 'Automatically matches your operating system or browser light/dark setting.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
