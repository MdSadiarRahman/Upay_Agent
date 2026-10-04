export type Language = 'bn' | 'en';

export type UserRole = 'operator' | 'agent' | 'merchant' | 'customer' | 'guardian';

export type ScenarioType =
  | 'friday_rush'
  | 'normal_weekday'
  | 'salary_day'
  | 'monsoon_rain'
  | 'eid_festival'
  | 'agent_down';

// ============================================================================
// 1. CUSTOMER ENTITY (Behavior, Profiling, and Recommendation Engine)
// ============================================================================
export interface CustomerRecord {
  customerId: string;
  name: string;
  nameBn: string;
  ageGroup: '18-24' | '25-34' | '35-49' | '50+';
  locationZone: string;
  locationZoneBn: string;
  registrationDate: string;
  walletBalance: number;
  transactionFrequency: number; // tx / month
  averageTransactionValue: number; // in BDT (৳)
  monthlySpending: number; // in BDT (৳)
  paymentCategory: 'grocery' | 'pharmacy' | 'utility' | 'dining' | 'lifestyle';
  preferredMerchantCategory: 'pharmacy' | 'grocery' | 'restaurant' | 'electronics' | 'tea_stall';
  cashOutFrequency: number; // monthly cashout count
  digitalPaymentFrequency: number; // monthly QR/online payments count
  offerResponseHistory: {
    offersViewed: number;
    offersClaimed: number;
    lastClaimedDate?: string;
  };
  riskProfile: 'low' | 'medium' | 'high';
  // Engineered AI Features
  paymentPreferenceScore: number; // 0-100: higher means favors digital QR over cash-out
  offerInterestScore: number; // 0-100: likelihood of converting on merchant promos
  cashOutAlternativeScore: number; // 0-100: propensity to convert cash-out to merchant payment
}

// ============================================================================
// 2. AGENT ENTITY (Liquidity Radar, Forecasting, and Rebalancing)
// ============================================================================
export interface Agent {
  id: string;
  name: string;
  nameBn: string;
  locationName: string;
  locationNameBn: string;
  zone: string;
  coords: { x: number; y: number }; // Percentage in map 0-100
  currentCash: number;
  currentEFloat: number;
  dailyCashIn: number;
  dailyCashOut: number;
  transactionCount: number;
  predictedDemandNext4h: number;
  shortageRisk: number; // 0 to 100 percentage
  expectedShortage: number;
  surplusAmount: number;
  peakWindow: string;
  peakWindowBn: string;
  operatingHours: string;
  historicalFailureCount: number;
  customerFootfall: number;
  reliabilityScore: number; // 0 to 100
  distanceFromTargetKm?: number;
  queueLength: number; // in persons
  avgWaitTimeMin: number;
  status: 'critical_shortage' | 'moderate_shortage' | 'safe' | 'surplus' | 'closed';
  hourlyDemand: number[]; // Next 8 hours demand curve
  hourlyCashProjected: number[];
  // Engineered AI Features
  cashDepletionRate: number; // BDT cash drained per hour during peak
  liquidityRiskScore: number; // 0-100 multi-factor risk index
  peakDemandIndex: number; // Multiplier vs normal baseline (e.g. 1.8x)
  shortageProbability: number; // 0-1 probability derived from historical distributions
}

// ============================================================================
// 3. AGENT TRANSACTION ENTITY (Time-Series & Scenario Forecasting)
// ============================================================================
export interface AgentTransactionRecord {
  transactionId: string;
  agentId: string;
  date: string;
  time: string;
  transactionType: 'cash_in' | 'cash_out' | 'p2p_rebalance_receive' | 'p2p_rebalance_send' | 'float_transfer';
  cashIn: number;
  cashOut: number;
  amount: number;
  customerCount: number;
  location: string;
  dayType: 'Normal Day' | 'Friday Rush' | 'Salary Day' | 'Eid' | 'Monsoon' | 'Agent Down';
  hourlyDepletionDelta: number; // net cash impact (+ or -)
}

// ============================================================================
// 4. MERCHANT ENTITY (Local Commerce, QR Adoption & Margin Safety)
// ============================================================================
export interface Merchant {
  id: string;
  name: string;
  nameBn: string;
  category: 'pharmacy' | 'grocery' | 'restaurant' | 'electronics' | 'tea_stall';
  categoryBn: string;
  location: string;
  coords: { x: number; y: number };
  dailySales: number;
  digitalPaymentCount: number;
  cashPaymentCount: number;
  avgTicketSize: number;
  dailyFootfall: number;
  upayVolumeShare: number; // percentage e.g. 24%
  offPeakWindow: string;
  offPeakWindowBn: string;
  isEnrolled: boolean;
  activeOffers: Offer[];
  offerHistoryCount: number;
  campaignPerformanceRating: number; // 0-100 historical efficiency
  // Engineered AI Features
  digitalAdoptionRate: number; // ratio of digital payments to total tickets (0-100%)
  customerGrowthPotential: number; // 0-100 score predicting footfall expansion
  campaignEffectivenessScore: number; // 0-100 historical ROI on promotional campaigns
}

// ============================================================================
// 5. MERCHANT CAMPAIGN ENTITY (Smart Offers & Margin Protection)
// ============================================================================
export interface Offer {
  id: string;
  merchantId: string;
  merchantName: string;
  title: string;
  titleBn: string;
  discountType: 'percentage' | 'flat' | 'cashback';
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  targetCategory?: string;
  durationHours?: number;
  targetWindow: string;
  targetWindowBn: string;
  budget?: number;
  redemptionLimit: number;
  redemptionCount: number;
  marginSafetyScore: number; // 0 to 100
  customerResponseRate?: number; // % of notified users claiming
  salesImpactMultiplier?: number; // revenue lift multiplier (e.g. 1.22x)
  aiRecommendationReasonBn: string;
  aiRecommendationReasonEn: string;
  isCrossPromo?: boolean;
  partnerMerchantName?: string;
}

// ============================================================================
// 6. LOCATION / AREA ENTITY (Regional Pressure Mapping & GIS Analysis)
// ============================================================================
export interface LocationAreaRecord {
  areaId: string;
  zoneName: string;
  zoneNameBn: string;
  coordinates: { lat: number; lng: number };
  populationDensity: number; // people per sq km
  numberOfAgents: number;
  numberOfMerchants: number;
  averageIncomeLevel: 'low' | 'middle' | 'high';
  transactionVolumeDaily: number; // in BDT (৳)
  cashOutPressureLevel: 'low' | 'moderate' | 'high' | 'critical';
  // Engineered AI Features
  cashPressureIndex: number; // 0-100: composite of footfall, agent cash scarcity, and day type
  digitalPaymentOpportunityIndex: number; // 0-100: untapped potential for QR substitution
}

// ============================================================================
// 7. OPERATIONAL WORKFLOW & GOVERNANCE TYPES
// ============================================================================
export interface RebalanceProposal {
  id: string;
  targetAgentId: string;
  targetAgentName: string;
  shortageAmount: number;
  partnerAgentId: string;
  partnerAgentName: string;
  suggestedAmount: number;
  distanceKm: number;
  partnerScore: number;
  calculatedBreakdown: {
    surplusScore: number;
    distanceScore: number;
    reliabilityScore: number;
    operatingScore: number;
  };
  status: 'pending' | 'approved' | 'settled' | 'rejected';
  supervisorApprovedBy?: string;
  timestamp: string;
  auditHash: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  estimatedCost: number;
  merchantId: string;
  merchantName: string;
  discountApplied: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 'rebalance_proposal' | 'rebalance_approved' | 'campaign_launched' | 'anomaly_flagged' | 'cashout_diverted';
  titleBn: string;
  titleEn: string;
  detailsBn: string;
  detailsEn: string;
  actor: string;
  zone: string;
  hash: string;
}

export interface FraudAnomaly {
  id: string;
  type: 'velocity_spike' | 'multi_account_device' | 'cashback_loop' | 'unusual_distance';
  descriptionBn: string;
  descriptionEn: string;
  riskScore: number;
  involvedEntity: string;
  timestamp: string;
  status: 'under_review' | 'cleared' | 'restricted';
}
