/**
 * UpayPulse AI Orchestrator & Specialized Agent Intelligence Layer
 */

export type SpecializedAgentType =
  | 'customer_agent'
  | 'risk_agent'
  | 'liquidity_agent'
  | 'merchant_growth_agent';

export interface OrchestratorResult {
  routedTo: SpecializedAgentType;
  agentNameBn: string;
  agentNameEn: string;
  confidence: number;
  answerBn: string;
  answerEn: string;
  explainability: {
    primaryReasonBn: string;
    primaryReasonEn: string;
    factors: Array<{ factorBn: string; factorEn: string; impact: string }>;
  };
  suggestedAction?: {
    actionType: string;
    labelBn: string;
    labelEn: string;
    payload?: any;
  };
  timestamp: string;
}

export function routeAndProcessQuery(query: string, context?: any): OrchestratorResult {
  const q = query.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. LIQUIDITY AGENT INTENTS
  if (
    q.includes('cash') ||
    q.includes('ক্যাশ') ||
    q.includes('finish') ||
    q.includes('shortage') ||
    q.includes('টাকা') ||
    q.includes('রিব্যালেন্স') ||
    q.includes('rebalance') ||
    q.includes('when will') ||
    q.includes('agent b') ||
    q.includes('partner')
  ) {
    return {
      routedTo: 'liquidity_agent',
      agentNameBn: 'লিকুইডিটি পূর্বাভাস এজেন্ট',
      agentNameEn: 'Liquidity Forecasting Agent',
      confidence: 0.98,
      answerBn: 'এজেন্ট সদর-১৪ এর ক্যাশ আগামী ৪ ঘণ্টার মধ্যে (~বিকাল ৫:১৫) শেষ হওয়ার আশঙ্কা রয়েছে এবং সম্ভাব্য ঘাটতি প্রায় ২৪,০০০ টাকা। উদ্বৃত্ত এজেন্ট সদর-০৯ থেকে ১৫,০০০ টাকা এবং সদর-১১ থেকে ৯,০০০ টাকা রিব্যালেন্সিং অনুমোদনের সুপারিশ করা হচ্ছে।',
      answerEn: 'Agent Sadar-14 cash is projected to deplete within 4 hours (~5:15 PM) with an expected deficit of ৳ 24,000. Recommend authorized rebalancing of ৳ 15,000 from Agent Sadar-09 and ৳ 9,000 from Sadar-11.',
      explainability: {
        primaryReasonBn: 'কেন এজেন্ট সদর-০৯ কে শীর্ষ পার্টনার হিসেবে নির্বাচন করা হলো?',
        primaryReasonEn: 'Why was Agent Sadar-09 ranked as the top donor partner?',
        factors: [
          {
            factorBn: 'দূরত্ব: ০.৭ কিমি (সবচেয়ে দ্রুত পৌঁছানো সম্ভব)',
            factorEn: 'Proximity: 0.7 km distance (fastest transit)',
            impact: '+30% score weight',
          },
          {
            factorBn: 'উচ্চ নগদ উদ্বৃত্ত: ২০,০০০ টাকা তাৎক্ষণিক প্রস্তুত',
            factorEn: 'High Cash Surplus: ৳ 20,000 available',
            impact: '+45% score weight',
          },
          {
            factorBn: 'ঐতিহাসিক নির্ভরযোগ্যতা: ৯৮% অতীত লেনদেন রেকর্ড',
            factorEn: 'Historical Reliability: 98% settlement record',
            impact: '+15% score weight',
          },
          {
            factorBn: 'কাজের সময়: রাত ১১:০০ টা পর্যন্ত খোলা থাকে',
            factorEn: 'Operating alignment: Open until 11:00 PM',
            impact: '+10% score weight',
          },
        ],
      },
      suggestedAction: {
        actionType: 'open_rebalance_modal',
        labelBn: 'রিব্যালেন্স ভাউচার অনুমোদন করুন',
        labelEn: 'Approve Rebalance Voucher',
      },
      timestamp,
    };
  }

  // 2. RISK & FRAUD AGENT INTENTS
  if (
    q.includes('fraud') ||
    q.includes('risk') ||
    q.includes('জালিয়াতি') ||
    q.includes('suspicious') ||
    q.includes('সন্দেহভাজন') ||
    q.includes('abuse') ||
    q.includes('প্রতারণা') ||
    q.includes('block') ||
    q.includes('ban') ||
    q.includes('multiple account')
  ) {
    return {
      routedTo: 'risk_agent',
      agentNameBn: 'প্রতারণা প্রতিরোধ ও ঝুঁকি এজেন্ট',
      agentNameEn: 'Fraud Defense & Risk Agent',
      confidence: 0.96,
      answerBn: 'রিস্ক এজেন্ট একটি একক ডিভাইস ফিঙ্গারপ্রিন্ট থেকে ৫টি আলাদা উপায় ওয়ালেটে প্রমোশনাল অফার ক্লেইম করার চেষ্টা শনাক্ত করেছে। রেসপন্সিবল এআই নীতি অনুযায়ী অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে ব্লক না করে মানুষের পর্যালোচনার জন্য জমা রাখা হয়েছে।',
      answerEn: 'Risk Agent detected 5 distinct wallet redemptions originating from a single handset fingerprint. In accordance with Responsible AI guidelines, accounts are never blocked automatically; held in Human Review Queue.',
      explainability: {
        primaryReasonBn: 'কেন স্বয়ংক্রিয়ভাবে ব্যান না করে মানুষের পর্যালোচনায় পাঠানো হলো?',
        primaryReasonEn: 'Why was the account flagged for human review rather than an auto-ban?',
        factors: [
          {
            factorBn: 'ভুল পজিটিভ রোধ: পরিবারের সদস্যদের যৌথ ফোন ব্যবহারের সুযোগ',
            factorEn: 'False-Positive Prevention: Shared family device allowance',
            impact: 'Critical Consumer Protection',
          },
          {
            factorBn: 'ভেলোসিটি অ্যানোমালি: ৫ মিনিটে ৪ বার রিডেম্পশন চেষ্টা',
            factorEn: 'Velocity Anomaly: 4 redemptions in 5 minutes',
            impact: 'High Anomaly Indicator',
          },
          {
            factorBn: 'ট্যাম্পার-এভিডেন্ট হ্যাশ তৈরি: অডিট পর্যালোচনার জন্য সংরক্ষিত',
            factorEn: 'Tamper-Evident Hash created for supervisory sign-off',
            impact: 'Compliance Protocol',
          },
        ],
      },
      suggestedAction: {
        actionType: 'view_fraud_queue',
        labelBn: 'মানবীয় রিভিউ কিউ দেখুন',
        labelEn: 'Inspect Human Review Queue',
      },
      timestamp,
    };
  }

  // 3. MERCHANT GROWTH AGENT INTENTS
  if (
    q.includes('merchant') ||
    q.includes('মার্চেন্ট') ||
    q.includes('sales') ||
    q.includes('traffic') ||
    q.includes('off-peak') ||
    q.includes('বিক্রি') ||
    q.includes('campaign') ||
    q.includes('boost') ||
    q.includes('margin')
  ) {
    return {
      routedTo: 'merchant_growth_agent',
      agentNameBn: 'মার্চেন্ট গ্রোথ ও ক্যাম্পেইন এজেন্ট',
      agentNameEn: 'Merchant Growth & Campaign Agent',
      confidence: 0.95,
      answerBn: 'মার্চেন্ট এআই বিশ্লেষণ: দুপুর ২টা থেকে বিকাল ৫টার মধ্যে ফুটফল ৬০% হ্রাস পায়। বিকাল ৫টা থেকে রাত ৮টায় ৫০০+ টাকার কেনাকাটায় ৩০ টাকা ছাড় দিলে ১৮ থেকে ২৫টি বাড়তি উপায় কিউআর বিক্রি পাওয়া যাবে এবং মার্জিন সুরক্ষিত থাকবে।',
      answerEn: 'Merchant AI Analysis: Footfall drops 60% between 2:00 PM – 5:00 PM. Running a ৳ 30 instant discount on ৳ 500+ purchases from 5 PM – 8 PM yields +18 to 25 incremental Upay QR sales.',
      explainability: {
        primaryReasonBn: 'কেন ১০% পার্সেন্টেজ ডিসকাউন্টের চেয়ে ফ্ল্যাট ৩০ টাকা সুপারিশ করা হলো?',
        primaryReasonEn: 'Why was a flat ৳ 30 voucher suggested over 10% percentage discount?',
        factors: [
          {
            factorBn: 'মার্জিন সুরক্ষা স্কোর: ৯৪/১০০ (মার্চেন্টের মুনাফা ক্ষুণ্ন হবে না)',
            factorEn: 'Margin Safety Index: 94/100 prevents profit erosion',
            impact: 'Safe Capital Efficiency',
          },
          {
            factorBn: 'টার্গেট অডিয়েন্স: আশপাশের ৩৪০ জন সক্রিয় মোবাইল ওয়ালেট ব্যবহারকারী',
            factorEn: 'Catchment Audience: 340 active mobile wallets nearby',
            impact: 'High Footfall Potential',
          },
          {
            factorBn: 'ক্যাশ-আউট রূপান্তর: প্রায় ২১% ক্যাশ উত্তোলনের চাপ দোকানে পেমেন্টে ডাইভার্ট হয়',
            factorEn: 'Cashout-to-Merchant Conversion: Diverts ~21% ATM withdrawals',
            impact: 'Ecosystem Balance',
          },
        ],
      },
      suggestedAction: {
        actionType: 'open_campaign_builder',
        labelBn: 'সুপারিশকৃত অফার চালু করুন',
        labelEn: 'Launch Recommended Offer',
      },
      timestamp,
    };
  }

  // 4. CUSTOMER AGENT INTENTS (Default / Customer requests)
  return {
    routedTo: 'customer_agent',
    agentNameBn: 'গ্রাহক সঞ্চয় ও রুট এজেন্ট',
    agentNameEn: 'Customer Savings & Route Agent',
    confidence: 0.97,
    answerBn: 'নিকটবর্তী রহমান ফার্মেসি (০.৪ কিমি) ৫০০+ টাকার ওষুধে ৩০ টাকা ফ্ল্যাট ছাড় দিচ্ছে এবং রফিক গ্রোসারি দিচ্ছে ৩% ক্যাশব্যাক। জিরো-ক্যাশ রুটে সরাসরি উপায় কিউআরে পেমেন্ট করলে ১.৪% ক্যাশ-আউট ফি সম্পূর্ণ বেঁচে যাবে এবং মোট ৯৫+ টাকা সাশ্রয় হবে।',
    answerEn: 'Nearby Rahman Pharmacy (0.4 km) offers ৳ 30 flat discount and Rafiq Grocery offers 3% cashback. Using the Zero-Cash route skips the 1.4% cash-out fee, saving ৳ 95+ in total.',
    explainability: {
      primaryReasonBn: 'গ্রাহকের আর্থিক সুবিধা কীভাবে অর্জিত হচ্ছে?',
      primaryReasonEn: 'How is customer financial benefit derived?',
      factors: [
        {
          factorBn: 'ক্যাশ-আউট ফি প্রত্যাহার: ২৯.৪০ টাকা সরাসরি বাঁচল',
          factorEn: 'Cash-out withdrawal fee avoidance: ৳ 29.40 saved',
          impact: 'Direct Fee Relief',
        },
        {
          factorBn: 'সরাসরি মার্চেন্ট কিউআর ডিসকাউন্ট: ৬৬.০০ টাকা ছাড়',
          factorEn: 'Direct Merchant QR Discounts: ৳ 66.00 off',
          impact: 'Hyperlocal Value',
        },
        {
          factorBn: 'হাঁটার দূরত্ব: মাত্র ৪০০ মিটার (কম যাতায়াত খরচ)',
          factorEn: 'Walking distance: 400 meters',
          impact: 'Zero Travel Friction',
        },
      ],
    },
    suggestedAction: {
      actionType: 'open_zero_cash_route',
      labelBn: 'জিরো-ক্যাশ রুট দেখুন',
      labelEn: 'Open Zero-Cash Route',
    },
    timestamp,
  };
}
