import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Agent, Language, RebalanceProposal } from '../types';
import { formatTaka, generateAuditHash } from '../utils/algorithms';

interface RebalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAgent: Agent;
  allAgents: Agent[];
  language: Language;
  onApproveProposal: (proposal: RebalanceProposal) => void;
}

export const RebalanceModal: React.FC<RebalanceModalProps> = ({
  isOpen,
  onClose,
  targetAgent,
  allAgents,
  language,
  onApproveProposal,
}) => {
  const isBn = language === 'bn';

  const partner09 = allAgents.find((a) => a.id === 'sadar-09') || allAgents[1];
  const partner11 = allAgents.find((a) => a.id === 'sadar-11') || allAgents[2];

  const [alloc09, setAlloc09] = useState<number>(15000);
  const [alloc11, setAlloc11] = useState<number>(9000);
  const [supervisorPin, setSupervisorPin] = useState<string>('9942');
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [generatedHash, setGeneratedHash] = useState<string>('');

  if (!isOpen) return null;

  const totalRebalance = alloc09 + alloc11;

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      const hash = generateAuditHash(targetAgent.id, partner09.id, totalRebalance);
      setGeneratedHash(hash);
      setIsAuthorizing(false);
      setIsSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6'],
      });

      const newProposal: RebalanceProposal = {
        id: 'prop-' + Date.now(),
        targetAgentId: targetAgent.id,
        targetAgentName: targetAgent.name,
        shortageAmount: targetAgent.expectedShortage || 24000,
        partnerAgentId: partner09.id,
        partnerAgentName: partner09.name,
        suggestedAmount: totalRebalance,
        distanceKm: 0.7,
        partnerScore: 94.2,
        calculatedBreakdown: {
          surplusScore: 90,
          distanceScore: 95,
          reliabilityScore: 98,
          operatingScore: 100,
        },
        status: 'approved',
        supervisorApprovedBy: 'Area Supervisor: Anwar Hossain (OP-4029)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        auditHash: hash,
      };

      onApproveProposal(newProposal);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-3xl shadow-2xl p-6 space-y-5 overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isBn ? 'সুপারভাইজার অনুমোদিত রিব্যালেন্সিং পোর্টাল' : 'Authorized Supervisor Rebalancing Portal'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'দায়িত্বশীল মানুষের প্রত্যক্ষ অনুমোদন ও ক্রিপ্টোগ্রাফিক লগ' : 'Human-in-the-loop oversight & verifiable cryptographic log'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="space-y-4">
            {/* Target Agent Profile */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-red-200 dark:border-red-500/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase block">
                  {isBn ? 'ঘাটতি মোকাবিলায় গ্রহীতা এজেন্ট' : 'Receiving Deficit Agent'}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {isBn ? targetAgent.nameBn : targetAgent.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  {isBn ? targetAgent.locationNameBn : targetAgent.locationName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">{isBn ? 'সম্ভাব্য ঘাটতি:' : 'Shortage:'}</span>
                <span className="text-base font-black text-red-600 dark:text-red-400 font-mono">
                  {formatTaka(targetAgent.expectedShortage || 24000, isBn)}
                </span>
              </div>
            </div>

            {/* AI Multi-Partner Split Recommendation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {isBn ? 'এআই পার্টনার বরাদ্দ বিভাজন' : 'AI Partner Allocation Split'}
                </span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                  {isBn ? 'মোট:' : 'Total:'} {formatTaka(totalRebalance, isBn)}
                </span>
              </div>

              {/* Donor 1: Sadar-09 */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{isBn ? partner09.nameBn : partner09.name}</span>
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 block">
                      {isBn ? 'উদ্বৃত্ত:' : 'Surplus:'} {formatTaka(partner09.surplusAmount, isBn)} | {isBn ? 'দূরত্ব:' : 'Dist:'} 0.7 km (PartnerScore: 94.2)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatTaka(alloc09, isBn)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={partner09.surplusAmount}
                  step={1000}
                  value={alloc09}
                  onChange={(e) => setAlloc09(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Donor 2: Sadar-11 */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{isBn ? partner11.nameBn : partner11.name}</span>
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 block">
                      {isBn ? 'উদ্বৃত্ত:' : 'Surplus:'} {formatTaka(partner11.surplusAmount, isBn)} | {isBn ? 'দূরত্ব:' : 'Dist:'} 1.1 km (PartnerScore: 81.5)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatTaka(alloc11, isBn)}
                  </span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={partner11.surplusAmount}
                  step={1000}
                  value={alloc11}
                  onChange={(e) => setAlloc11(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* Supervisor Authentication Credentials */}
            <div className="p-3.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isBn ? 'সুপারভাইজার অনুমোদন পিন (PIN)' : 'Supervisor Authorization PIN'}</span>
                </span>
                <span className="text-[10px] text-slate-500">ID: OP-4029</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={supervisorPin}
                  onChange={(e) => setSupervisorPin(e.target.value)}
                  placeholder="PIN"
                  className="w-28 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-center tracking-widest text-sm focus:outline-none focus:border-amber-400"
                />
                <span className="text-[11px] text-slate-700 dark:text-amber-200/80 leading-tight">
                  {isBn
                    ? 'আনোয়ার হোসেন (ক্লাস্টার সুপারভাইজার)'
                    : 'Anwar Hossain (Cluster Area Supervisor)'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleAuthorize}
                disabled={isAuthorizing}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md shadow-amber-400/20 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                {isAuthorizing ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'অনুমোদন ও ডিজিটাল ভাউচার ইস্যু' : 'Approve & Issue Voucher'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {isBn ? 'রিব্যালেন্সিং সফলভাবে অনুমোদিত!' : 'Rebalance Successfully Authorized!'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {isBn
                  ? `মোট ${formatTaka(totalRebalance, isBn)} টাকার ডিজিটাল হ্যান্ডওভার ভাউচার দাতা ও গ্রহীতা এজেন্টের কাছে প্রেরণ করা হয়েছে।`
                  : `Digital voucher for ${formatTaka(totalRebalance)} issued to donor and recipient agents.`}
              </p>
            </div>

            {/* Immutable Audit Trail Receipt */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-500 text-[10px]">
                <span>AUDIT HASH:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{generatedHash}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 text-[11px]">
                <span>ISSUED BY:</span>
                <span>Anwar Hossain (Supervisor OP-4029)</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 text-[11px]">
                <span>TIMESTAMP:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 text-[11px]">
                <span>STATUS:</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">READY FOR CASH HANDOVER</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              {isBn ? 'সম্পন্ন ও বন্ধ করুন' : 'Done & Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
