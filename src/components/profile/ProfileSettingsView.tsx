import React, { useState } from 'react';
import {
  User,
  Store,
  ShieldCheck,
  Camera,
  Phone,
  Mail,
  MapPin,
  Lock,
  Bell,
  Fingerprint,
  Check,
  Save,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';

interface ProfileSettingsViewProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  language,
  setLanguage,
}) => {
  const { user, updateUserProfile } = useAuth();
  const isBn = language === 'bn';
  const isCustomer = user?.accountType === 'customer';

  const [name, setName] = useState<string>(user?.name || '');
  const [nameBn, setNameBn] = useState<string>(user?.nameBn || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [email, setEmail] = useState<string>(
    user?.email || (isCustomer ? 'tanvir971hasan@gmail.com' : 'shahid.telecom@upayagent.bd')
  );
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);

  const [businessName, setBusinessName] = useState<string>(user?.businessName || '');
  const [shopAddress, setShopAddress] = useState<string>(
    user?.shopAddress || (isBn ? 'গণেশতলা মোড়, সদর বাজার, দিনাজপুর' : 'Goneshtola Mor, Sadar Bazar, Dinajpur')
  );
  const [operatingHours, setOperatingHours] = useState<string>(user?.operatingHours || '08:00 AM - 11:00 PM');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState<string>(user?.tradeLicenseNumber || 'TRD-DNJ-2024-8841');

  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(user?.notificationEnabled ?? true);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(user?.biometricEnabled ?? true);
  const [dailyLimit, setDailyLimit] = useState<number>(25000);

  const [currentPin, setCurrentPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [pinMessage, setPinMessage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      nameBn,
      phone,
      email,
      avatarUrl,
      businessName,
      shopAddress,
      operatingHours,
      tradeLicenseNumber,
      notificationEnabled,
      biometricEnabled,
    });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#3B82F6'],
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      setPinMessage(isBn ? 'নতুন পিন অবশ্যই ৪ ডিজিটের হতে হবে।' : 'New PIN must be exactly 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage(isBn ? 'নতুন পিন নিশ্চিতকরণ মেলেনি।' : 'PIN confirmation does not match.');
      return;
    }
    setPinMessage(isBn ? 'পিন সফলভাবে আপডেট হয়েছে!' : 'PIN successfully updated!');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => setPinMessage(null), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          isCustomer
            ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500'
            : 'bg-gradient-to-r from-blue-600 via-amber-400 to-emerald-400'
        }`} />
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group shrink-0">
            <div className={`w-24 h-24 rounded-3xl overflow-hidden border-2 flex items-center justify-center font-bold text-3xl shadow-sm ${
              avatarUrl
                ? 'border-amber-400 bg-slate-950'
                : isCustomer
                ? 'border-amber-400 bg-amber-400 text-slate-950'
                : 'border-blue-500 bg-blue-600 text-white'
            }`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{name ? name[0] : (isCustomer ? 'C' : 'B')}</span>
              )}
            </div>
            <label
              htmlFor="profile-avatar-upload"
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md cursor-pointer transition transform active:scale-95 border-2 border-white dark:border-slate-900"
              title={isBn ? 'ছবি পরিবর্তন' : 'Change Photo'}
            >
              <Camera className="w-4 h-4" />
              <input
                id="profile-avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center sm:text-left flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isBn ? nameBn || name : name}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isCustomer
                  ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30'
                  : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30'
              }`}>
                {isCustomer
                  ? (isBn ? 'গ্রাহক অ্যাকাউন্ট' : 'Customer Account')
                  : (isBn ? `${user?.role?.toUpperCase()} বিজনেস` : `${user?.role?.toUpperCase()} Business`)}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{user?.kycTier || 'Tier 2'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono text-slate-700 dark:text-slate-300">{phone}</span>
              <span className="text-slate-400">•</span>
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>{isBn ? user?.zoneBn : user?.zone}</span>
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 flex items-center shrink-0">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isBn ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                !isBn ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Form Grid */}
      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Basic & Contact Information */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-4 h-4 text-amber-500" />
            <span>{isBn ? 'ব্যক্তিগত তথ্য' : 'Personal & Contact Details'}</span>
          </div>
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                {isBn ? 'নাম (ইংরেজি):' : 'Full Name (English):'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                {isBn ? 'নাম (বাংলা):' : 'Full Name (Bangla):'}
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                {isBn ? 'মোবাইল নম্বর:' : 'Mobile Number:'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                {isBn ? 'ইমেইল:' : 'Email Address:'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Business Information or Wallet Limits */}
        {!isCustomer ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
              <Store className="w-4 h-4 text-blue-500" />
              <span>{isBn ? 'ব্যবসার বিবরণ' : 'Shop & Commercial Details'}</span>
            </div>
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  {isBn ? 'প্রতিষ্ঠানের নাম:' : 'Business / Shop Name:'}
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  {isBn ? 'ট্রেড লাইসেন্স নম্বর:' : 'Trade License Number:'}
                </label>
                <input
                  type="text"
                  value={tradeLicenseNumber}
                  onChange={(e) => setTradeLicenseNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  {isBn ? 'দোকানের ঠিকানা:' : 'Shop Address / Location:'}
                </label>
                <input
                  type="text"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  {isBn ? 'কাজের সময়সূচি:' : 'Operating Hours:'}
                </label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="08:00 AM - 11:00 PM"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{isBn ? 'ওয়ালেট লিমিট ও নোটিফিকেশন' : 'Wallet Preferences & Limits'}</span>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{isBn ? 'দৈনিক ব্যয়ের সর্বোচ্চ সীমা:' : 'Daily Spending Limit:'}</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">৳ {dailyLimit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        {isBn ? 'এসএমএস ও পুশ নোটিফিকেশন' : 'SMS & Push Notifications'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {isBn ? 'তাৎক্ষণিক লেনদেন ও অফার অ্যালার্ট' : 'Instant transactional and offer alerts'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationEnabled}
                    onChange={(e) => setNotificationEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        {isBn ? 'বায়োমেট্রিক কুইক লগইন' : 'Biometric Quick Login'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {isBn ? 'আঙুলের ছাপ দিয়ে দ্রুত অনুমোদন' : 'Authenticate using device biometric hardware'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={biometricEnabled}
                    onChange={(e) => setBiometricEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card 3: Security & PIN Management */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>{isBn ? 'গোপন পিন পরিবর্তন' : 'Change Secret PIN'}</span>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                {isBn ? 'বর্তমান ৪-ডিজিটের পিন:' : 'Current 4-digit PIN:'}
              </label>
              <input
                type="password"
                maxLength={4}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-mono tracking-widest focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  {isBn ? 'নতুন পিন:' : 'New PIN:'}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-mono tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                  {isBn ? 'নিশ্চিত করুন:' : 'Confirm PIN:'}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-mono tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
            {pinMessage && (
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{pinMessage}</span>
              </p>
            )}
            <button
              type="button"
              onClick={handleUpdatePin}
              disabled={!currentPin || !newPin || !confirmPin}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
            >
              {isBn ? 'পিন পরিবর্তন করুন' : 'Update Security PIN'}
            </button>
          </div>
        </div>

        {/* Card 4: Responsible AI & Privacy Compliance Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{isBn ? 'প্রাইভেসি ও কমপ্লায়েন্স স্থিতি' : 'Privacy & Compliance Status'}</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'ব্যক্তিগত তথ্য কখনোই বিক্রি করা হয় না' : 'PII Never Sold or Traded'}</span>
              </span>
              <p className="text-[11px] text-slate-500">
                {isBn
                  ? 'আপনার ডেটা কেবল আর্থিক লেনদেনের উদ্দেশ্যে সর্বোচ্চ সুরক্ষায় সংরক্ষিত।'
                  : 'Personal data is strictly used for delivery of MFS transactions with no commercial trading.'}
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isBn ? 'জোন-লেভেল লোকেশন সম্মতি' : 'Zone-Level Consent Tracking'}</span>
              </span>
              <p className="text-[11px] text-slate-500">
                {isBn
                  ? 'লোকেশন কেবল কাছের অফার ও এজেন্ট দূরত্ব জানার জন্য ব্যবহারকারীর স্পষ্ট সম্মতিতে ব্যবহৃত হয়।'
                  : 'Location access is strictly opt-in and bound to merchant proximity calculation.'}
              </p>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            {saveSuccess ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isBn ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে!' : 'Profile updated successfully!'}</span>
              </span>
            ) : (
              <span>{isBn ? 'পরিবর্তন সম্পন্ন হলে সেভ বাটনে চাপুন।' : 'Click save to commit profile updates.'}</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
