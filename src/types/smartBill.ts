export type SmartBillCategoryGroup =
  | 'utility'
  | 'mobile'
  | 'digital'
  | 'education';

export type SmartBillCategory =
  | 'electricity'
  | 'internet'
  | 'gas'
  | 'water'
  | 'mobile_recharge'
  | 'mobile_postpaid'
  | 'education'
  | 'subscription';

export type SmartBillStatus =
  | 'upcoming'
  | 'due_soon'
  | 'overdue'
  | 'paid'
  | 'scheduled'
  | 'failed';

export interface ProviderInputField {
  key: string;
  labelBn: string;
  labelEn: string;
  placeholder: string;
  helpTextBn?: string;
  helpTextEn?: string;
  type: 'text' | 'number' | 'tel';
  required: boolean;
  regexPattern?: string;
}

export interface SmartBillProvider {
  id: string;
  name: string;
  nameBn: string;
  category: SmartBillCategory;
  categoryGroup: SmartBillCategoryGroup;
  iconName: string;
  badge?: string;
  color: string;
  requiredFields: ProviderInputField[];
  minAmount: number;
  maxAmount: number;
  defaultFee: number;
  sampleBillAmount: number;
  sampleCustomerName: string;
  sampleAccountNumber: string;
  billingMonthsAvailable?: string[];
}

export interface PreviousPaymentRecord {
  date: string;
  amount: number;
  trxId: string;
  providerName?: string;
  status?: 'successful' | 'failed';
}

export interface SmartBillItem {
  id: string;
  titleBn: string;
  titleEn: string;
  category: SmartBillCategory;
  categoryGroup?: SmartBillCategoryGroup;
  providerId: string;
  providerName: string;
  providerLogo?: string;
  accountNumber: string;
  meterNumber?: string;
  contactPhone?: string;
  billingMonth?: string;
  customerName?: string;
  amount: number;
  customAmount?: number;
  fee: number;
  dueDate: string; // e.g. '10 Oct 2026'
  dueDay: number; // e.g. 10
  month: string; // e.g. 'October 2026'
  frequency: 'monthly' | 'bi-monthly' | 'quarterly' | 'one-time';
  status: SmartBillStatus;
  isScheduled?: boolean;
  scheduledDate?: string;
  scheduledDay?: number;
  paidAt?: string;
  paidTrxId?: string;
  clearingReference?: string;
  failureReason?: string;
  reminderSet: boolean;
  reminderDaysBefore: number;
  aiConfidence: number;
  aiPattern: string;
  aiRecommendationBn: string;
  aiRecommendationEn: string;
  aiChangeInsight?: {
    percentChange: number;
    direction: 'increase' | 'decrease' | 'stable';
    reasonBn: string;
    reasonEn: string;
  };
  previousPayments: PreviousPaymentRecord[];
}

export interface SmartBillInsight {
  id: string;
  type: 'trend' | 'savings' | 'alert' | 'habit';
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  iconName: string;
  actionId?: string;
  actionLabelBn?: string;
  actionLabelEn?: string;
}

export interface BalanceHealthAssessment {
  currentBalance: number;
  totalUpcoming: number;
  isSufficient: boolean;
  surplusOrDeficit: number;
  healthStatus: 'healthy' | 'warning' | 'critical';
  messageBn: string;
  messageEn: string;
  tipBn?: string;
  tipEn?: string;
}
