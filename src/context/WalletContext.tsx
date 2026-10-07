import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { WalletTransaction, TransactionType, TransactionCategory } from '../types/wallet';
import { INITIAL_TRANSACTIONS } from '../data/walletData';

interface SendMoneyParams {
  receiverPhone: string;
  receiverName?: string;
  amount: number;
  pin: string;
  reference?: string;
}

interface CashOutParams {
  agentId: string;
  agentName: string;
  amount: number;
  pin: string;
  reference?: string;
}

interface AddMoneyParams {
  method: string;
  sourceAccount: string;
  amount: number;
  pin?: string;
  reference?: string;
}

interface MerchantPayParams {
  merchantId: string;
  merchantName: string;
  merchantPhone?: string;
  amount: number;
  pin: string;
  reference?: string;
  discountOrCashback?: number;
}

interface MobileRechargeParams {
  phone: string;
  operator: string;
  connectionType: 'Prepaid' | 'Postpaid';
  amount: number;
  pin: string;
}

interface BillPayParams {
  billType: 'electricity' | 'gas' | 'internet' | 'water';
  providerName: string;
  accountNumber: string;
  amount: number;
  pin: string;
  reference?: string;
}

interface WalletContextType {
  customerBalance: number;
  merchantBalance: number;
  agentCashBalance: number;
  agentEFloatBalance: number;
  transactions: WalletTransaction[];
  sendMoney: (params: SendMoneyParams) => Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }>;
  cashOut: (params: CashOutParams) => Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }>;
  addMoney: (params: AddMoneyParams) => Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }>;
  merchantPay: (params: MerchantPayParams) => Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }>;
  mobileRecharge: (params: MobileRechargeParams) => Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }>;
  billPay: (params: BillPayParams) => Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }>;
  resetWalletState: () => void;
  getCustomerStats: () => {
    availableBalance: number;
    totalTransactions: number;
    totalSpentThisMonth: number;
    totalReceivedThisMonth: number;
  };
  getBusinessStats: (businessId?: string) => {
    businessBalance: number;
    cashBalance: number;
    eFloatBalance: number;
    todaySales: number;
    totalVolume: number;
    successfulTxCount: number;
  };
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CUSTOMER_BAL: 'upaypulse_customer_balance',
  MERCHANT_BAL: 'upaypulse_merchant_balance',
  AGENT_CASH_BAL: 'upaypulse_agent_cash_balance',
  AGENT_EFLOAT_BAL: 'upaypulse_agent_efloat_balance',
  TRANSACTIONS: 'upaypulse_transactions_ledger',
};

// Generate realistic Upay Transaction ID (e.g., UP89D2B7E1)
export const generateTrxId = (): string => {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let res = 'UP';
  for (let i = 0; i < 8; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerBalance, setCustomerBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER_BAL);
      if (saved) return Number(saved);
    } catch (e) {}
    return 4500;
  });

  const [merchantBalance, setMerchantBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MERCHANT_BAL);
      if (saved) return Number(saved);
    } catch (e) {}
    return 14200;
  });

  const [agentCashBalance, setAgentCashBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AGENT_CASH_BAL);
      if (saved) return Number(saved);
    } catch (e) {}
    return 18000;
  });

  const [agentEFloatBalance, setAgentEFloatBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AGENT_EFLOAT_BAL);
      if (saved) return Number(saved);
    } catch (e) {}
    return 65000;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('upaypulse_token');
      if (!token) {
        // Fallback to local storage if not logged in via API
        try {
          const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
          if (saved) setTransactions(JSON.parse(saved));
        } catch (e) {}
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/api/transactions/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Map backend transactions to WalletTransaction format
        const apiTxs: WalletTransaction[] = response.data.map((t: any) => ({
          id: `UP-${t.id}`,
          type: t.type === 'credit' ? 'add_money' : 'send_money',
          category: t.type === 'credit' ? 'income' : 'expense',
          titleBn: t.type === 'credit' ? 'টাকা যোগ' : 'টাকা পাঠানো',
          titleEn: t.type === 'credit' ? 'Added Money' : 'Sent Money',
          amount: t.amount,
          fee: 0,
          totalDeducted: t.amount,
          senderId: 'api',
          senderName: 'User',
          senderPhone: 'N/A',
          receiverId: 'api',
          receiverName: 'User',
          receiverPhone: 'N/A',
          date: new Date(t.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: new Date(t.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          timestamp: new Date(t.timestamp).getTime(),
          status: t.status,
          reference: 'API Transaction',
          extraDetails: {},
        }));
        
        // Combine API transactions with INITIAL_TRANSACTIONS
        setTransactions([...apiTxs, ...INITIAL_TRANSACTIONS]);
      } catch (err) {
        console.error('Failed to fetch transactions from API', err);
      }
    };
    fetchTransactions();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_BAL, customerBalance.toString());
      localStorage.setItem(STORAGE_KEYS.MERCHANT_BAL, merchantBalance.toString());
      localStorage.setItem(STORAGE_KEYS.AGENT_CASH_BAL, agentCashBalance.toString());
      localStorage.setItem(STORAGE_KEYS.AGENT_EFLOAT_BAL, agentEFloatBalance.toString());
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {}
  }, [customerBalance, merchantBalance, agentCashBalance, agentEFloatBalance, transactions]);

  // Helper date formatter
  const getNowFormatted = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { date: dateStr, time: timeStr, timestamp: now.getTime() };
  };

  // 1. SEND MONEY
  const sendMoney = async ({
    receiverPhone,
    receiverName = 'Recipient',
    amount,
    pin,
    reference = 'Personal payment',
  }: SendMoneyParams): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> => {
    // Basic validation
    if (!receiverPhone || receiverPhone.trim().length < 5) {
      return { success: false, error: 'অনুগ্রহ করে একটি সঠিক গ্রাহক মোবাইল নম্বর বা অ্যাকাউন্ট প্রদান করুন (Please enter a valid account number)' };
    }
    if (amount <= 0) {
      return { success: false, error: 'সঠিক টাকার পরিমাণ প্রদান করুন (Please enter a valid amount)' };
    }
    if (!pin || pin.length < 4) {
      return { success: false, error: '৪ ডিজিটের গোপন পিন নম্বর প্রদান করুন (Please enter valid 4-digit PIN)' };
    }

    const fee = amount > 500 ? 5 : 0;
    const totalDeducted = amount + fee;

    // Check balance
    if (customerBalance < totalDeducted) {
      return {
        success: false,
        error: `পর্যাপ্ত ব্যালেন্স নেই। আপনার বর্তমান ব্যালেন্স ৳ ${customerBalance.toLocaleString()} (Transaction failed. Please check your wallet balance.)`,
      };
    }

    const { date, time, timestamp } = getNowFormatted();
    const trxId = generateTrxId();

    const newTx: WalletTransaction = {
      id: trxId,
      type: 'send_money',
      category: 'expense',
      titleBn: `টাকা পাঠানো হয়েছে (${receiverName})`,
      titleEn: `Send Money Completed (${receiverName})`,
      amount,
      fee,
      totalDeducted,
      senderId: 'usr-cust-01',
      senderName: 'Tanvir Ahmed',
      senderPhone: '01711-234567',
      receiverId: 'usr-rcv-' + receiverPhone.slice(-4),
      receiverName,
      receiverPhone,
      date,
      time,
      timestamp,
      status: 'successful',
      reference,
      extraDetails: {
        paymentMethod: 'Upay P2P Instant Transfer',
        channel: 'Customer Mobile App',
      },
    };

    setCustomerBalance((prev) => prev - totalDeducted);
    setTransactions((prev) => [newTx, ...prev]);

    try {
      const token = localStorage.getItem('upaypulse_token');
      if (token) {
        await axios.post('http://localhost:8000/api/transactions/', {
          amount: totalDeducted,
          type: 'debit',
          status: 'completed'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error("Failed to sync transaction", err);
    }

    return { success: true, transaction: newTx };
  };

  // 2. CASH OUT
  const cashOut = async ({
    agentId,
    agentName,
    amount,
    pin,
    reference = 'Physical cash withdrawal',
  }: CashOutParams): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> => {
    if (!agentId) {
      return { success: false, error: 'অনুগ্রহ করে সঠিক এজেন্ট নম্বর বা আইডি নির্বাচন করুন (Please select a valid agent)' };
    }
    if (amount <= 0) {
      return { success: false, error: 'সঠিক টাকার পরিমাণ প্রদান করুন (Please enter a valid amount)' };
    }
    if (!pin || pin.length < 4) {
      return { success: false, error: '৪ ডিজিটের গোপন পিন নম্বর প্রদান করুন (Please enter valid 4-digit PIN)' };
    }

    const fee = Math.round(amount * 0.014); // 1.4% standard cash-out charge
    const totalDeducted = amount + fee;

    if (customerBalance < totalDeducted) {
      return {
        success: false,
        error: `পর্যাপ্ত ব্যালেন্স নেই। মোট প্রয়োজন ৳ ${totalDeducted.toLocaleString()} (ফি সহ), বর্তমান ব্যালেন্স ৳ ${customerBalance.toLocaleString()}`,
      };
    }

    const { date, time, timestamp } = getNowFormatted();
    const trxId = generateTrxId();

    const newTx: WalletTransaction = {
      id: trxId,
      type: 'cash_out',
      category: 'expense',
      titleBn: `ক্যাশ আউট (${agentName})`,
      titleEn: `Cash Out Completed (${agentName})`,
      amount,
      fee,
      totalDeducted,
      senderId: 'usr-cust-01',
      senderName: 'Tanvir Ahmed',
      senderPhone: '01711-234567',
      receiverId: agentId,
      receiverName: agentName,
      receiverPhone: '01812-987654',
      date,
      time,
      timestamp,
      status: 'successful',
      reference,
      extraDetails: {
        paymentMethod: 'Agent QR Cash Out (1.4% MFS Tariff)',
        channel: 'Authorized Agent Outlet',
      },
    };

    setCustomerBalance((prev) => prev - totalDeducted);
    // In agent bookkeeping: agent's e-float goes UP by the cash-out amount, physical cash goes DOWN
    setAgentEFloatBalance((prev) => prev + amount);
    setAgentCashBalance((prev) => Math.max(0, prev - amount));
    setTransactions((prev) => [newTx, ...prev]);

    return { success: true, transaction: newTx };
  };

  // 3. ADD MONEY
  const addMoney = async ({
    method,
    sourceAccount,
    amount,
    pin,
    reference = 'Bank deposit to wallet',
  }: AddMoneyParams): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> => {
    if (amount <= 0) {
      return { success: false, error: 'টাকা যোগ করার সঠিক পরিমাণ লিখুন (Minimum amount is ৳ 50)' };
    }

    const { date, time, timestamp } = getNowFormatted();
    const trxId = generateTrxId();

    const newTx: WalletTransaction = {
      id: trxId,
      type: 'add_money',
      category: 'income',
      titleBn: `টাকা যোগ (${method})`,
      titleEn: `Add Money Completed (${method})`,
      amount,
      fee: 0,
      totalDeducted: 0,
      senderId: 'bank-source',
      senderName: sourceAccount,
      senderPhone: 'Authorized Payment Gateway',
      receiverId: 'usr-cust-01',
      receiverName: 'Tanvir Ahmed',
      receiverPhone: '01711-234567',
      date,
      time,
      timestamp,
      status: 'successful',
      reference,
      extraDetails: {
        paymentMethod: method,
        channel: 'NPSB / Card Payment Gateway',
      },
    };

    setCustomerBalance((prev) => prev + amount);
    setTransactions((prev) => [newTx, ...prev]);

    return { success: true, transaction: newTx };
  };

  // 4. MERCHANT PAYMENT
  const merchantPay = async ({
    merchantId,
    merchantName,
    merchantPhone = '01913-554433',
    amount,
    pin,
    reference = 'In-store payment',
    discountOrCashback = 0,
  }: MerchantPayParams): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> => {
    if (!merchantId) {
      return { success: false, error: 'অনুগ্রহ করে সঠিক মার্চেন্ট আইডি বা কিউআর কোড প্রদান করুন' };
    }
    if (amount <= 0) {
      return { success: false, error: 'সঠিক টাকার পরিমাণ লিখুন' };
    }
    if (!pin || pin.length < 4) {
      return { success: false, error: '৪ ডিজিটের গোপন পিন নম্বর প্রদান করুন' };
    }

    const netChargeToCustomer = Math.max(0, amount - discountOrCashback);

    if (customerBalance < netChargeToCustomer) {
      return {
        success: false,
        error: `পর্যাপ্ত ব্যালেন্স নেই। প্রয়োজনীয় ৳ ${netChargeToCustomer.toLocaleString()}, বর্তমান ব্যালেন্স ৳ ${customerBalance.toLocaleString()}`,
      };
    }

    const { date, time, timestamp } = getNowFormatted();
    const trxId = generateTrxId();

    const newTx: WalletTransaction = {
      id: trxId,
      type: 'merchant_pay',
      category: 'expense',
      titleBn: `মার্চেন্ট পেমেন্ট (${merchantName})`,
      titleEn: `Merchant Payment (${merchantName})`,
      amount: netChargeToCustomer,
      fee: 0,
      totalDeducted: netChargeToCustomer,
      senderId: 'usr-cust-01',
      senderName: 'Tanvir Ahmed',
      senderPhone: '01711-234567',
      receiverId: merchantId,
      receiverName: merchantName,
      receiverPhone: merchantPhone,
      date,
      time,
      timestamp,
      status: 'successful',
      reference,
      extraDetails: {
        merchantCategory: 'Retail Commerce & Services',
        cashBackEarned: discountOrCashback,
        paymentMethod: 'Upay QR Direct Merchant Clearing',
        channel: 'Merchant Point-of-Sale QR',
      },
    };

    // Deduct customer
    setCustomerBalance((prev) => prev - netChargeToCustomer);
    // Increase merchant business wallet!
    setMerchantBalance((prev) => prev + amount);
    setTransactions((prev) => [newTx, ...prev]);

    return { success: true, transaction: newTx };
  };

  // 5. MOBILE RECHARGE
  const mobileRecharge = async ({
    phone,
    operator,
    connectionType,
    amount,
    pin,
  }: MobileRechargeParams): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> => {
    if (!phone || phone.length < 11) {
      return { success: false, error: 'সঠিক ১১ সংখ্যার মোবাইল নম্বর প্রদান করুন (Valid 11-digit mobile number required)' };
    }
    if (amount <= 0) {
      return { success: false, error: 'সঠিক রিচার্জের পরিমাণ লিখুন (Minimum recharge is ৳ 20)' };
    }
    if (!pin || pin.length < 4) {
      return { success: false, error: '৪ ডিজিটের গোপন পিন নম্বর প্রদান করুন' };
    }

    if (customerBalance < amount) {
      return {
        success: false,
        error: `পর্যাপ্ত ব্যালেন্স নেই। আপনার বর্তমান ব্যালেন্স ৳ ${customerBalance.toLocaleString()}`,
      };
    }

    const { date, time, timestamp } = getNowFormatted();
    const trxId = generateTrxId();

    const newTx: WalletTransaction = {
      id: trxId,
      type: 'recharge',
      category: 'expense',
      titleBn: `মোবাইল রিচার্জ (${operator})`,
      titleEn: `Mobile Recharge (${operator})`,
      amount,
      fee: 0,
      totalDeducted: amount,
      senderId: 'usr-cust-01',
      senderName: 'Tanvir Ahmed',
      senderPhone: '01711-234567',
      receiverId: 'rec-' + phone.slice(-4),
      receiverName: `${operator} (${connectionType})`,
      receiverPhone: phone,
      date,
      time,
      timestamp,
      status: 'successful',
      reference: `${operator} ${connectionType} Airtime Top-Up`,
      extraDetails: {
        operator,
        connectionType,
        paymentMethod: 'Upay Instant Airtime Gateway',
        channel: 'Direct Telco Switch',
      },
    };

    setCustomerBalance((prev) => prev - amount);
    setTransactions((prev) => [newTx, ...prev]);

    return { success: true, transaction: newTx };
  };

  // 6. BILL PAY
  const billPay = async ({
    billType,
    providerName,
    accountNumber,
    amount,
    pin,
    reference = 'Utility payment',
  }: BillPayParams): Promise<{ success: boolean; transaction?: WalletTransaction; error?: string }> => {
    if (!accountNumber || accountNumber.trim().length < 4) {
      return { success: false, error: 'অনুগ্রহ করে সঠিক বিল বা মিটার অ্যাকাউন্ট নম্বর প্রদান করুন' };
    }
    if (amount <= 0) {
      return { success: false, error: 'সঠিক বিলের পরিমাণ লিখুন' };
    }
    if (!pin || pin.length < 4) {
      return { success: false, error: '৪ ডিজিটের গোপন পিন নম্বর প্রদান করুন' };
    }

    if (customerBalance < amount) {
      return {
        success: false,
        error: `পর্যাপ্ত ব্যালেন্স নেই। আপনার বর্তমান ব্যালেন্স ৳ ${customerBalance.toLocaleString()}`,
      };
    }

    const { date, time, timestamp } = getNowFormatted();
    const trxId = generateTrxId();

    const newTx: WalletTransaction = {
      id: trxId,
      type: 'bill_pay',
      category: 'expense',
      titleBn: `বিল পরিশোধ (${providerName})`,
      titleEn: `Bill Payment (${providerName})`,
      amount,
      fee: 0,
      totalDeducted: amount,
      senderId: 'usr-cust-01',
      senderName: 'Tanvir Ahmed',
      senderPhone: '01711-234567',
      receiverId: 'biller-' + accountNumber.slice(-4),
      receiverName: providerName,
      receiverPhone: `A/C: ${accountNumber}`,
      date,
      time,
      timestamp,
      status: 'successful',
      reference,
      extraDetails: {
        billType,
        providerName,
        accountNumber,
        paymentMethod: 'Direct Utility Clearing Gateway',
        channel: 'Authorized Utility Switch',
      },
    };

    setCustomerBalance((prev) => prev - amount);
    setTransactions((prev) => [newTx, ...prev]);

    return { success: true, transaction: newTx };
  };

  // Reset to original demo balances
  const resetWalletState = () => {
    setCustomerBalance(4500);
    setMerchantBalance(14200);
    setAgentCashBalance(18000);
    setAgentEFloatBalance(65000);
    setTransactions(INITIAL_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_BAL);
    localStorage.removeItem(STORAGE_KEYS.MERCHANT_BAL);
    localStorage.removeItem(STORAGE_KEYS.AGENT_CASH_BAL);
    localStorage.removeItem(STORAGE_KEYS.AGENT_EFLOAT_BAL);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  };

  // Helper stats
  const getCustomerStats = () => {
    const expenses = transactions
      .filter((t) => t.category === 'expense' && t.status === 'successful')
      .reduce((sum, t) => sum + t.amount, 0);
    const incomes = transactions
      .filter((t) => t.category === 'income' && t.status === 'successful')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      availableBalance: customerBalance,
      totalTransactions: transactions.length,
      totalSpentThisMonth: expenses,
      totalReceivedThisMonth: incomes,
    };
  };

  const getBusinessStats = (businessId = 'merch-01') => {
    // Incoming merchant transactions
    const merchantTxs = transactions.filter(
      (t) => t.type === 'merchant_pay' && t.status === 'successful' && (t.receiverId === businessId || t.receiverId === 'merch-01')
    );
    const todaySales = merchantTxs.reduce((sum, t) => sum + t.amount, 0);

    return {
      businessBalance: merchantBalance,
      cashBalance: agentCashBalance,
      eFloatBalance: agentEFloatBalance,
      todaySales: 38400 + todaySales,
      totalVolume: 54000 + todaySales,
      successfulTxCount: 39 + merchantTxs.length,
    };
  };

  return (
    <WalletContext.Provider
      value={{
        customerBalance,
        merchantBalance,
        agentCashBalance,
        agentEFloatBalance,
        transactions,
        sendMoney,
        cashOut,
        addMoney,
        merchantPay,
        mobileRecharge,
        billPay,
        resetWalletState,
        getCustomerStats,
        getBusinessStats,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
