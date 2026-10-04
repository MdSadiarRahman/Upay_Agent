export type UserAccountType = 'customer' | 'business';
export type BusinessRole = 'agent' | 'merchant' | 'operator';
export type UserRole = 'customer' | BusinessRole;

export interface AuthUser {
  id: string;
  name: string;
  nameBn: string;
  phone: string;
  role: UserRole;
  accountType: UserAccountType;
  avatarUrl?: string;
  kycTier: 'Tier 1' | 'Tier 2' | 'Tier 3 (Enterprise)';
  isKycVerified: boolean;
  zone: string;
  zoneBn: string;
  walletBalance?: number;
  cashBalance?: number;
  eFloatBalance?: number;
  associatedEntityId?: string; // e.g. 'sadar-14' for agent, 'merch-01' for merchant
  businessName?: string;
  businessNameBn?: string;
  tradeLicenseNumber?: string;
  email?: string;
  shopAddress?: string;
  operatingHours?: string;
  notificationEnabled?: boolean;
  biometricEnabled?: boolean;
}

export interface LoginCredentials {
  accountType: UserAccountType;
  phone: string;
  pin: string;
  businessRole?: BusinessRole;
}
