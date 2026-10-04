import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type {
  SmartBillItem,
  SmartBillInsight,
  BalanceHealthAssessment,
  SmartBillProvider as SmartBillProviderItem,
  SmartBillCategory,
} from '../types/smartBill';
import {
  INITIAL_SMART_BILLS,
  SMART_BILL_INSIGHTS,
  SMART_BILL_PROVIDERS,
  BILL_CATEGORY_GROUPS,
} from '../data/smartBillData';
import { useWallet } from './WalletContext';

interface NewManualBillParams {
  providerId: string;
  accountNumber: string;
  meterNumber?: string;
  contactPhone?: string;
  billingMonth?: string;
  amount: number;
  pin: string;
  isScheduled?: boolean;
  scheduledDate?: string;
  scheduledDay?: number;
}

interface SmartBillContextType {
  bills: SmartBillItem[];
  upcomingBills: SmartBillItem[];
  dueSoonBills: SmartBillItem[];
  scheduledBills: SmartBillItem[];
  paidBills: SmartBillItem[];
  failedBills: SmartBillItem[];
  providers: SmartBillProviderItem[];
  categoryGroups: typeof BILL_CATEGORY_GROUPS;
  totalUpcomingAmount: number;
  totalScheduledAmount: number;
  totalPaidThisMonth: number;
  activePayModalBill: SmartBillItem | null;
  openPaymentFlow: (bill: SmartBillItem) => void;
  closePaymentFlow: () => void;
  toggleReminder: (billId: string) => void;
  snoozeReminder: (billId: string) => void;
  paySmartBill: (
    billId: string,
    pin: string,
    customAmount?: number
  ) => Promise<{ success: boolean; trxId?: string; error?: string }>;
  scheduleBillPayment: (
    billId: string,
    scheduledDate: string,
    customAmount?: number
  ) => { success: boolean; message: string };
  cancelScheduledBill: (billId: string) => void;
  executeNewBillPayment: (
    params: NewManualBillParams
  ) => Promise<{ success: boolean; trxId?: string; error?: string }>;
  getBalanceHealth: () => BalanceHealthAssessment;
  aiInsights: SmartBillInsight[];
  resetBillsToDefault: () => void;
}

const SmartBillContext = createContext<SmartBillContextType | undefined>(undefined);

const STORAGE_KEY = 'upaypulse_smart_bills_v2';

export const SmartBillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { customerBalance, billPay } = useWallet();

  // Load from localStorage or initial
  const [bills, setBills] = useState<SmartBillItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored smart bills', e);
    }
    return INITIAL_SMART_BILLS;
  });

  const [activePayModalBill, setActivePayModalBill] = useState<SmartBillItem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
    } catch (e) {
      console.error('Failed to save smart bills to localStorage', e);
    }
  }, [bills]);

  // Derived collections
  const upcomingBills = useMemo(() => {
    return bills.filter((b) => b.status === 'upcoming' || b.status === 'due_soon' || b.status === 'overdue');
  }, [bills]);

  const dueSoonBills = useMemo(() => {
    return bills.filter((b) => b.status === 'due_soon' || (b.status === 'upcoming' && b.dueDay <= 10));
  }, [bills]);

  const scheduledBills = useMemo(() => {
    return bills.filter((b) => b.status === 'scheduled');
  }, [bills]);

  const paidBills = useMemo(() => {
    return bills.filter((b) => b.status === 'paid');
  }, [bills]);

  const failedBills = useMemo(() => {
    return bills.filter((b) => b.status === 'failed');
  }, [bills]);

  const totalUpcomingAmount = useMemo(() => {
    return upcomingBills.reduce((acc, b) => acc + (b.customAmount || b.amount), 0);
  }, [upcomingBills]);

  const totalScheduledAmount = useMemo(() => {
    return scheduledBills.reduce((acc, b) => acc + (b.customAmount || b.amount), 0);
  }, [scheduledBills]);

  const totalPaidThisMonth = useMemo(() => {
    return paidBills.reduce((acc, b) => acc + (b.customAmount || b.amount), 0);
  }, [paidBills]);

  // Toggle Reminder
  const toggleReminder = (billId: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, reminderSet: !b.reminderSet } : b))
    );
  };

  // Snooze Reminder
  const snoozeReminder = (billId: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              reminderSet: true,
              aiRecommendationBn: 'রিমাইন্ডার ২ দিনের জন্য স্থগিত রাখা হয়েছে। নির্ধারিত শেষ তারিখের পূর্বেই পরিশোধ করুন।',
              aiRecommendationEn: 'Reminder snoozed for 2 days. Make sure to complete payment before deadline.',
            }
          : b
      )
    );
  };

  // Open & Close Payment Flow
  const openPaymentFlow = (bill: SmartBillItem) => {
    setActivePayModalBill(bill);
  };

  const closePaymentFlow = () => {
    setActivePayModalBill(null);
  };

  // Schedule Payment
  const scheduleBillPayment = (
    billId: string,
    scheduledDate: string,
    customAmount?: number
  ): { success: boolean; message: string } => {
    const day = parseInt(scheduledDate.split(' ')[0], 10) || 10;
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              status: 'scheduled',
              isScheduled: true,
              scheduledDate,
              scheduledDay: day,
              customAmount: customAmount || b.amount,
              aiRecommendationBn: `${scheduledDate} তারিখে পেমেন্ট অনুমোদনের জন্য প্রোঅ্যাক্টিভ নোটিফিকেশন পাঠানো হবে।`,
              aiRecommendationEn: `Payment scheduled for ${scheduledDate}. Proactive confirmation prompt will be sent.`,
            }
          : b
      )
    );
    return {
      success: true,
      message: `বিলটি ${scheduledDate} তারিখের জন্য শিডিউল করা হয়েছে। আপনি সবসময় ফাইনাল কন্ট্রোলে আছেন।`,
    };
  };

  // Cancel Scheduled Bill
  const cancelScheduledBill = (billId: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              status: 'upcoming',
              isScheduled: false,
              scheduledDate: undefined,
              scheduledDay: undefined,
              aiRecommendationBn: 'শিডিউল বাতিল করা হয়েছে। আপনি চাইলে যেকোনো সময় পে করতে পারেন।',
              aiRecommendationEn: 'Payment schedule cancelled. You can manually pay whenever ready.',
            }
          : b
      )
    );
  };

  // Pay Smart Bill via WalletContext
  const paySmartBill = async (
    billId: string,
    pin: string,
    customAmount?: number
  ): Promise<{ success: boolean; trxId?: string; error?: string }> => {
    const targetBill = bills.find((b) => b.id === billId);
    if (!targetBill) {
      return { success: false, error: 'Bill record not found.' };
    }

    if (targetBill.status === 'paid') {
      return { success: false, error: 'This bill is already paid.' };
    }

    const payAmount = customAmount || targetBill.customAmount || targetBill.amount;

    let walletBillType: 'electricity' | 'gas' | 'internet' | 'water' = 'electricity';
    if (targetBill.category === 'gas') walletBillType = 'gas';
    else if (targetBill.category === 'internet') walletBillType = 'internet';
    else if (targetBill.category === 'water') walletBillType = 'water';

    const result = await billPay({
      billType: walletBillType,
      providerName: targetBill.providerName,
      accountNumber: targetBill.accountNumber,
      amount: payAmount,
      pin,
      reference: `UpayBill - ${targetBill.titleEn}`,
    });

    if (result.success && result.transaction) {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setBills((prev) =>
        prev.map((b) =>
          b.id === billId
            ? {
                ...b,
                amount: payAmount,
                customAmount: payAmount,
                status: 'paid',
                isScheduled: false,
                paidAt: `${dateStr}, ${timeStr}`,
                paidTrxId: result.transaction!.id,
                clearingReference: `UPAY-CLR-${Math.floor(100000 + Math.random() * 900000)}`,
                reminderSet: false,
                aiRecommendationBn: 'পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। অফিসিয়াল ডিজিটাল রিসিট সংরক্ষিত হয়েছে।',
                aiRecommendationEn: 'Payment completed successfully. Official digital clearing voucher saved.',
              }
            : b
        )
      );

      return {
        success: true,
        trxId: result.transaction.id,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Payment failed. Please verify your PIN or balance.',
      };
    }
  };

  // Execute New Manual Bill Payment (from MFS multi-step wizard)
  const executeNewBillPayment = async (
    params: NewManualBillParams
  ): Promise<{ success: boolean; trxId?: string; error?: string }> => {
    const provider = SMART_BILL_PROVIDERS.find((p) => p.id === params.providerId);
    const providerName = provider ? provider.name : 'Utility Provider';
    const titleBn = provider ? `${provider.nameBn}` : 'ইউটিলিটি বিল পে';
    const titleEn = provider ? `${provider.name}` : 'Utility Bill Payment';

    // If user chose to schedule rather than pay now
    if (params.isScheduled && params.scheduledDate) {
      const newBillId = `bill-sched-${Date.now()}`;
      const day = params.scheduledDay || parseInt(params.scheduledDate.split(' ')[0], 10) || 15;

      const newScheduledItem: SmartBillItem = {
        id: newBillId,
        titleBn,
        titleEn,
        category: provider ? provider.category : 'electricity',
        categoryGroup: provider ? provider.categoryGroup : 'utility',
        providerId: params.providerId,
        providerName,
        accountNumber: params.accountNumber,
        meterNumber: params.meterNumber,
        contactPhone: params.contactPhone,
        billingMonth: params.billingMonth || 'October 2026',
        amount: params.amount,
        customAmount: params.amount,
        fee: 0,
        dueDate: params.scheduledDate,
        dueDay: day,
        month: 'October 2026',
        frequency: 'monthly',
        status: 'scheduled',
        isScheduled: true,
        scheduledDate: params.scheduledDate,
        scheduledDay: day,
        reminderSet: true,
        reminderDaysBefore: 1,
        aiConfidence: 99,
        aiPattern: 'গ্রাহক দ্বারা কাস্টম শিডিউল হিসেবে সংরক্ষিত।',
        aiRecommendationBn: `${params.scheduledDate} তারিখে পেমেন্ট অনুমোদনের জন্য প্রম্পট করা হবে।`,
        aiRecommendationEn: `Scheduled for ${params.scheduledDate}. 1-tap confirmation will be requested.`,
        previousPayments: [],
      };

      setBills((prev) => [newScheduledItem, ...prev]);
      return {
        success: true,
        trxId: `SCHED-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }

    // Immediate Payment Execution
    let walletBillType: 'electricity' | 'gas' | 'internet' | 'water' = 'electricity';
    if (provider?.category === 'gas') walletBillType = 'gas';
    else if (provider?.category === 'internet') walletBillType = 'internet';
    else if (provider?.category === 'water') walletBillType = 'water';

    const result = await billPay({
      billType: walletBillType,
      providerName,
      accountNumber: params.accountNumber,
      amount: params.amount,
      pin: params.pin,
      reference: `MFS Pay - ${providerName}`,
    });

    if (result.success && result.transaction) {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newPaidItem: SmartBillItem = {
        id: `bill-manual-${Date.now()}`,
        titleBn,
        titleEn,
        category: provider ? provider.category : 'electricity',
        categoryGroup: provider ? provider.categoryGroup : 'utility',
        providerId: params.providerId,
        providerName,
        accountNumber: params.accountNumber,
        meterNumber: params.meterNumber,
        contactPhone: params.contactPhone,
        billingMonth: params.billingMonth || 'October 2026',
        amount: params.amount,
        customAmount: params.amount,
        fee: 0,
        dueDate: dateStr,
        dueDay: now.getDate(),
        month: 'October 2026',
        frequency: 'monthly',
        status: 'paid',
        paidAt: `${dateStr}, ${timeStr}`,
        paidTrxId: result.transaction.id,
        clearingReference: `UPAY-CLR-${Math.floor(100000 + Math.random() * 900000)}`,
        reminderSet: false,
        reminderDaysBefore: 1,
        aiConfidence: 100,
        aiPattern: 'গ্রাহক দ্বারা সফলভাবে তাৎক্ষণিক পরিশোধিত।',
        aiRecommendationBn: 'বিল পেমেন্ট সফল হয়েছে। ডিজিটাল অফিসিয়াল রিসিট তৈরি হয়েছে।',
        aiRecommendationEn: 'Payment successful. Official MFS receipt generated.',
        previousPayments: [
          { date: dateStr, amount: params.amount, trxId: result.transaction.id },
        ],
      };

      setBills((prev) => [newPaidItem, ...prev]);
      return {
        success: true,
        trxId: result.transaction.id,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Payment failed. Please verify PIN.',
      };
    }
  };

  // Balance Health Assessment
  const getBalanceHealth = (): BalanceHealthAssessment => {
    const isSufficient = customerBalance >= totalUpcomingAmount;
    const surplusOrDeficit = Math.abs(customerBalance - totalUpcomingAmount);

    if (totalUpcomingAmount === 0) {
      return {
        currentBalance: customerBalance,
        totalUpcoming: 0,
        isSufficient: true,
        surplusOrDeficit: customerBalance,
        healthStatus: 'healthy',
        messageBn: 'অক্টোবর মাসের সকল ইউটিলিটি বিল সম্পূর্ণ পরিশোধিত! কোনো বকেয়া নেই।',
        messageEn: 'All recurring bills for this month have been settled. No pending dues!',
        tipBn: 'আপনার অন-টাইম পেমেন্ট স্কোর ১০০/১০০ রয়েছে।',
        tipEn: 'Your On-Time Utility Track Record is 100/100.',
      };
    }

    if (isSufficient) {
      return {
        currentBalance: customerBalance,
        totalUpcoming: totalUpcomingAmount,
        isSufficient: true,
        surplusOrDeficit: customerBalance - totalUpcomingAmount,
        healthStatus: 'healthy',
        messageBn: `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স রয়েছে (৳ ${customerBalance.toLocaleString('en-IN')})। আসন্ন সকল বিল (৳ ${totalUpcomingAmount.toLocaleString('en-IN')}) সহজেই পরিশোধ করা সম্ভব।`,
        messageEn: `You have enough balance (৳ ${customerBalance.toLocaleString('en-IN')}) to complete all upcoming payments (৳ ${totalUpcomingAmount.toLocaleString('en-IN')}).`,
        tipBn: 'বিল বিলম্বিত না করে নির্ধারিত তারিখের পূর্বেই পরিশোধ করুন।',
        tipEn: 'You can settle all due bills before deadlines with zero hassle.',
      };
    } else {
      const deficit = totalUpcomingAmount - customerBalance;
      const healthStatus = customerBalance < totalUpcomingAmount * 0.4 ? 'critical' : 'warning';

      return {
        currentBalance: customerBalance,
        totalUpcoming: totalUpcomingAmount,
        isSufficient: false,
        surplusOrDeficit: deficit,
        healthStatus,
        messageBn: `আপনার বর্তমান ব্যালেন্স (৳ ${customerBalance.toLocaleString('en-IN')}) আসন্ন বিল পরিশোধের জন্য অপ্রতুল হতে পারে। প্রয়োজনীয় অতিরিক্ত তহবিল: ৳ ${deficit.toLocaleString('en-IN')}।`,
        messageEn: `Your balance (৳ ${customerBalance.toLocaleString('en-IN')}) may be insufficient for upcoming bills (৳ ${totalUpcomingAmount.toLocaleString('en-IN')}). Deficit: ৳ ${deficit.toLocaleString('en-IN')}.`,
        tipBn: 'জরিমানা বা সংযোগ বিচ্ছিন্ন এড়াতে ব্যাংক বা কার্ড থেকে ওয়ালেটে টাকা যোগ (Add Money) করার পরামর্শ দেওয়া হচ্ছে।',
        tipEn: 'We recommend adding money from your card/bank to ensure seamless bill settlement without late penalties.',
      };
    }
  };

  const resetBillsToDefault = () => {
    setBills(INITIAL_SMART_BILLS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SmartBillContext.Provider
      value={{
        bills,
        upcomingBills,
        dueSoonBills,
        scheduledBills,
        paidBills,
        failedBills,
        providers: SMART_BILL_PROVIDERS,
        categoryGroups: BILL_CATEGORY_GROUPS,
        totalUpcomingAmount,
        totalScheduledAmount,
        totalPaidThisMonth,
        activePayModalBill,
        openPaymentFlow,
        closePaymentFlow,
        toggleReminder,
        snoozeReminder,
        paySmartBill,
        scheduleBillPayment,
        cancelScheduledBill,
        executeNewBillPayment,
        getBalanceHealth,
        aiInsights: SMART_BILL_INSIGHTS,
        resetBillsToDefault,
      }}
    >
      {children}
    </SmartBillContext.Provider>
  );
};

export const useSmartBill = (): SmartBillContextType => {
  const context = useContext(SmartBillContext);
  if (!context) {
    throw new Error('useSmartBill must be used within a SmartBillProvider');
  }
  return context;
};
