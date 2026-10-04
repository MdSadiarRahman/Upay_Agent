export type TransactionType =
  | 'send_money'
  | 'cash_out'
  | 'add_money'
  | 'merchant_pay'
  | 'recharge'
  | 'bill_pay'
  | 'received_money'
  | 'rebalance_transfer';

export type TransactionStatus = 'successful' | 'failed' | 'pending';
export type TransactionCategory = 'income' | 'expense';

export interface WalletTransaction {
  id: string; // Trx ID like UP8A9B2C4F
  type: TransactionType;
  category: TransactionCategory;
  titleBn: string;
  titleEn: string;
  amount: number;
  fee: number;
  totalDeducted: number;
  senderId: string;
  senderName: string;
  senderPhone: string;
  receiverId: string;
  receiverName: string;
  receiverPhone: string;
  date: string; // e.g., '03 Oct 2026'
  time: string; // e.g., '02:45 PM'
  timestamp: number;
  status: TransactionStatus;
  failureReason?: string;
  reference?: string;
  extraDetails?: {
    operator?: string;
    connectionType?: 'Prepaid' | 'Postpaid';
    billType?: 'electricity' | 'gas' | 'internet' | 'water';
    providerName?: string;
    accountNumber?: string;
    merchantCategory?: string;
    cashBackEarned?: number;
    feeSaved?: number;
    paymentMethod?: string;
    channel?: string;
  };
}

export interface QuickContact {
  id: string;
  name: string;
  nameBn: string;
  phone: string;
  avatarBg: string;
  relationshipBn: string;
}

export interface BillProvider {
  id: string;
  type: 'electricity' | 'gas' | 'internet' | 'water';
  name: string;
  nameBn: string;
  sampleAccount: string;
  iconName: string;
}

export interface MobileOperator {
  id: string;
  name: string;
  nameBn: string;
  prefix: string[];
  color: string;
  logoInitial: string;
}
