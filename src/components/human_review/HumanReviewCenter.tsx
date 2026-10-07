import React from 'react';
import { ReviewStatusCard } from './ReviewStatusCard';
import { ConfidenceScoreCard } from './ConfidenceScoreCard';
import { AuditTimeline } from './AuditTimeline';
import { ShieldAlert } from 'lucide-react';

export const HumanReviewCenter = ({ language }: { language: string }) => {
  const isBn = language === 'bn';

  const mockData = {
    customer: "C102",
    score: 82,
    confidence: 91,
    status: "Human Review Pending" as const,
    riskLevel: "Medium" as const,
    auditLog: {
      predictionId: "AI-10025",
      userId: "C102",
      score: 82,
      confidence: 91,
      explanation: "Stable income pattern, but with recent high cash dependencies.",
      reviewer: "Pending Assignment",
      status: "Pending Review",
      timestamp: new Date().toLocaleString()
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-500" />
          {isBn ? 'হিউম্যান রিভিউ সেন্টার' : 'Human Review Center'}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {isBn 
            ? 'এআই শুধুমাত্র আর্থিক অন্তর্দৃষ্টি প্রদান করে। চূড়ান্ত সিদ্ধান্ত অনুমোদিত মানব পর্যালোচনার মাধ্যমে নেওয়া হয়।' 
            : 'AI provides financial insights and recommendations only. Final financial decisions require authorized human review.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ConfidenceScoreCard confidence={mockData.confidence} />
          <ReviewStatusCard 
            score={mockData.score}
            riskLevel={mockData.riskLevel}
            status={mockData.status}
            customer={mockData.customer}
          />
        </div>
        
        <div className="lg:col-span-2">
          <AuditTimeline auditLog={mockData.auditLog} />
        </div>
      </div>
    </div>
  );
};
