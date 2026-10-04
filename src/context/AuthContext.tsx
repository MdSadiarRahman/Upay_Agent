import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, LoginCredentials, UserAccountType, BusinessRole } from '../types/auth';

export const DEMO_USERS: Record<string, AuthUser> = {
  customer: {
    id: 'usr-cust-01',
    name: 'Tanvir Ahmed',
    nameBn: 'তানভীর আহমেদ',
    phone: '01711-234567',
    role: 'customer',
    accountType: 'customer',
    kycTier: 'Tier 2',
    isKycVerified: true,
    zone: 'Dinajpur Sadar (Goneshtola)',
    zoneBn: 'দিনাজপুর সদর (গণেশতলা)',
    walletBalance: 4500,
    email: 'tanvir971hasan@gmail.com',
  },
  agent: {
    id: 'usr-agent-14',
    name: 'Md. Shahidul Islam',
    nameBn: 'মো. শহিদুল ইসলাম',
    phone: '01812-987654',
    role: 'agent',
    accountType: 'business',
    kycTier: 'Tier 3 (Enterprise)',
    isKycVerified: true,
    zone: 'Goneshtola Mor, Sadar Bazar',
    zoneBn: 'গণেশতলা মোড়, সদর বাজার',
    associatedEntityId: 'sadar-14',
    businessName: 'Shahid Telecom (Agent Sadar-14)',
    businessNameBn: 'শহিদ টেলিকম (এজেন্ট সদর-১৪)',
    cashBalance: 18000,
    eFloatBalance: 65000,
    tradeLicenseNumber: 'TRD-DNJ-2024-8841',
    email: 'shahid.telecom@upayagent.bd',
  },
  merchant: {
    id: 'usr-merch-01',
    name: 'Dr. Rafiqur Rahman',
    nameBn: 'ডা. রফিকুর রহমান',
    phone: '01913-554433',
    role: 'merchant',
    accountType: 'business',
    kycTier: 'Tier 3 (Enterprise)',
    isKycVerified: true,
    zone: 'Station Road, Dinajpur Sadar',
    zoneBn: 'স্টেশন রোড, দিনাজপুর সদর',
    associatedEntityId: 'merch-01',
    businessName: 'Rahman Pharmacy',
    businessNameBn: 'রহমান ফার্মেসি',
    walletBalance: 14200,
    tradeLicenseNumber: 'DRG-DNJ-2023-1102',
    email: 'rahman.pharmacy@upaymerchant.bd',
  },
  operator: {
    id: 'usr-op-4029',
    name: 'Anwar Hossain',
    nameBn: 'আনোয়ার হোসেন',
    phone: '01710-004029',
    role: 'operator',
    accountType: 'business',
    kycTier: 'Tier 3 (Enterprise)',
    isKycVerified: true,
    zone: 'Dinajpur Central Operations Hub',
    zoneBn: 'দিনাজপুর সেন্ট্রাল অপারেশন হাব',
    businessName: 'Upay MFS Cluster Headquarters',
    businessNameBn: 'উপায় এমএফএস ক্লাস্টার হেডকোয়ার্টার্স',
    tradeLicenseNumber: 'MFS-SUPERVISOR-4029',
    email: 'anwar.hossain@upay.com.bd',
  },
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoUser: (key: 'customer' | 'agent' | 'merchant' | 'operator') => void;
  updateUserBalance: (delta: number) => void;
  updateUserCashBalance: (delta: number) => void;
  updateUserProfile: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check local storage or start with default demo customer for instant exploration
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('upaypulse_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    return DEMO_USERS.customer;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('upaypulse_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('upaypulse_auth_user');
    }
  }, [user]);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    if (!credentials.phone || credentials.phone.length < 5) {
      return { success: false, error: 'সঠিক মোবাইল নম্বর প্রদান করুন (Invalid mobile number)' };
    }
    if (!credentials.pin || credentials.pin.length < 4) {
      return { success: false, error: '৪ ডিজিটের গোপন পিন নম্বর প্রদান করুন (4-digit PIN required)' };
    }

    if (credentials.accountType === 'customer') {
      const loggedUser: AuthUser = {
        ...DEMO_USERS.customer,
        phone: credentials.phone.includes('-') ? credentials.phone : '01711-234567',
      };
      setUser(loggedUser);
      return { success: true };
    } else {
      const role = credentials.businessRole || 'agent';
      const template = DEMO_USERS[role] || DEMO_USERS.agent;
      const loggedUser: AuthUser = {
        ...template,
        phone: credentials.phone.includes('-') ? credentials.phone : template.phone,
      };
      setUser(loggedUser);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchDemoUser = (key: 'customer' | 'agent' | 'merchant' | 'operator') => {
    setUser(DEMO_USERS[key]);
  };

  const updateUserBalance = (delta: number) => {
    if (!user) return;
    if (user.walletBalance !== undefined) {
      setUser({ ...user, walletBalance: Math.max(0, user.walletBalance + delta) });
    }
  };

  const updateUserCashBalance = (delta: number) => {
    if (!user) return;
    if (user.cashBalance !== undefined) {
      setUser({ ...user, cashBalance: Math.max(0, user.cashBalance + delta) });
    }
  };

  const updateUserProfile = (updates: Partial<AuthUser>) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchDemoUser,
        updateUserBalance,
        updateUserCashBalance,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
