// Algorithms adhering strictly to the UpayPulse AI specification

/**
 * Calculates PartnerScore using the exact formula from project specification:
 * PartnerScore = 0.45 * SurplusScore + 0.30 * DistanceScore + 0.15 * ReliabilityScore + 0.10 * OperatingHourScore
 */
export function calculatePartnerScore(
  surplusAmount: number,
  shortageNeeded: number,
  distanceKm: number,
  reliabilityPercent: number,
  isOpenPeakHours: boolean
) {
  // Surplus score normalized to 0-100 based on coverage of needed shortage
  const surplusRatio = Math.min(surplusAmount / Math.max(shortageNeeded, 1), 1.5);
  const surplusScore = Math.min(100, Math.round((surplusRatio / 1.5) * 100));

  // Distance score: 0 km -> 100 score, 3.0+ km -> 20 score
  const distanceScore = Math.max(10, Math.round(100 - Math.min(distanceKm * 28, 90)));

  // Reliability score (0-100 directly from agent track record)
  const reliabilityScore = Math.min(100, Math.max(0, reliabilityPercent));

  // Operating hour score
  const operatingScore = isOpenPeakHours ? 100 : 50;

  const totalScore = Number(
    (
      0.45 * surplusScore +
      0.30 * distanceScore +
      0.15 * reliabilityScore +
      0.10 * operatingScore
    ).toFixed(1)
  );

  return {
    totalScore,
    breakdown: {
      surplusScore,
      distanceScore,
      reliabilityScore,
      operatingScore,
    },
  };
}

/**
 * Calculates OfferScore for customer notification:
 * OfferScore = 0.40 * Distance + 0.30 * CategoryInterest + 0.20 * CashOutIntent + 0.10 * OfferFatigue
 */
export function calculateOfferScore(
  distanceKm: number,
  categoryInterestScore: number, // 0-100
  isUserHeadingForCashout: boolean,
  fatiguePenaltyScore: number // 0-100 (100 means no fatigue, 0 means user got too many offers)
) {
  const distScore = Math.max(10, Math.round(100 - Math.min(distanceKm * 30, 90)));
  const cashoutScore = isUserHeadingForCashout ? 100 : 30;

  const totalScore = Number(
    (
      0.40 * distScore +
      0.30 * categoryInterestScore +
      0.20 * cashoutScore +
      0.10 * fatiguePenaltyScore
    ).toFixed(1)
  );

  return totalScore;
}

/**
 * Feature Engineering Helper: Calculates Hourly Cash Depletion Rate
 */
export function calculateCashDepletionRate(currentCash: number, predictedDemand4h: number): number {
  if (predictedDemand4h <= currentCash) return 0;
  const netDeficit = predictedDemand4h - currentCash;
  return Math.round(netDeficit / 4); // BDT/hour depletion velocity
}

/**
 * Feature Engineering Helper: Calculates Digital Adoption Rate for Merchants
 */
export function calculateDigitalAdoptionRate(digitalCount: number, cashCount: number): number {
  const total = digitalCount + cashCount;
  if (total === 0) return 0;
  return Number(((digitalCount / total) * 100).toFixed(1));
}

/**
 * Feature Engineering Helper: Calculates Regional Cash Pressure Index
 */
export function calculateCashPressureIndex(
  populationDensity: number,
  agentsCount: number,
  isRushPeriod: boolean
): number {
  const densityFactor = Math.min(100, (populationDensity / 8000) * 50);
  const supplyFactor = Math.max(10, 60 - agentsCount * 5);
  const timeFactor = isRushPeriod ? 30 : 10;
  return Math.min(100, Math.round(densityFactor + supplyFactor + timeFactor));
}

/**
 * Format currency to Bangladeshi Taka (৳)
 */
export function formatTaka(amount: number, isBn: boolean = false): string {
  const formattedEn = '৳ ' + Math.round(amount).toLocaleString('en-IN');
  if (!isBn) return formattedEn;

  // Convert digits to Bengali numbers
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const bnFormatted = formattedEn.replace(/[0-9]/g, (w) => bnDigits[parseInt(w, 10)]);
  return bnFormatted;
}

export function toBengaliNumber(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (w) => bnDigits[parseInt(w, 10)]);
}

/**
 * Generates cryptographic-looking audit hash for digital rebalance trails
 */
export function generateAuditHash(agentId: string, partnerId: string, amount: number): string {
  const chars = '0123456789ABCDEF';
  let hash = 'UP-TX-';
  const seed = `${agentId}-${partnerId}-${amount}-${Date.now()}`;
  for (let i = 0; i < 16; i++) {
    hash += chars[(seed.charCodeAt(i % seed.length) * (i + 7)) % 16];
  }
  return hash;
}
