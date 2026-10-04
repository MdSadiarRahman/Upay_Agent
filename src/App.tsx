/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import { SmartBillProvider } from './context/SmartBillContext';
import { LoginPage } from './components/auth/LoginPage';
import { CustomerDashboard } from './components/dashboards/CustomerDashboard';
import { BusinessDashboard } from './components/dashboards/BusinessDashboard';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { RebalanceModal } from './components/RebalanceModal';
import { MicroMerchantModal } from './components/MicroMerchantModal';
import { PitchAssistant } from './components/PitchAssistant';
import { TechArchitectureModal } from './components/tech/TechArchitectureModal';
import {
  INITIAL_AGENTS,
  INITIAL_MERCHANTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ANOMALIES,
  SCENARIO_PRESETS,
} from './data/mockData';
import {
  Language,
  ScenarioType,
  Agent,
  Merchant,
  RebalanceProposal,
  AuditLogEntry,
  FraudAnomaly,
  Offer,
} from './types';
import { formatTaka } from './utils/algorithms';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [language, setLanguage] = useState<Language>('bn');
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('friday_rush');

  // Core Datasets
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [merchants, setMerchants] = useState<Merchant[]>(INITIAL_MERCHANTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [anomalies, setAnomalies] = useState<FraudAnomaly[]>(INITIAL_ANOMALIES);
  const [approvedRebalances, setApprovedRebalances] = useState<RebalanceProposal[]>([]);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isRebalanceModalOpen, setIsRebalanceModalOpen] = useState<boolean>(false);
  const [isMicroMerchantOpen, setIsMicroMerchantOpen] = useState<boolean>(false);
  const [isPitchAssistantOpen, setIsPitchAssistantOpen] = useState<boolean>(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState<boolean>(false);
  const [rebalanceTargetAgent, setRebalanceTargetAgent] = useState<Agent>(agents[0]);

  // Scenario Change Handler
  const handleScenarioChange = (newScenario: ScenarioType) => {
    setActiveScenario(newScenario);
    const sc = SCENARIO_PRESETS[newScenario];
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === 'sadar-14') {
          const shortage = sc.targetShortageAmount;
          const risk = sc.targetShortageRisk;
          return {
            ...agent,
            expectedShortage: shortage,
            shortageRisk: risk,
            status: risk >= 75 ? 'critical_shortage' : risk >= 40 ? 'moderate_shortage' : 'safe',
            queueLength: newScenario === 'agent_down' ? 19 : newScenario === 'friday_rush' ? 7 : 3,
            avgWaitTimeMin: newScenario === 'agent_down' ? 32 : newScenario === 'friday_rush' ? 18 : 6,
          };
        }
        if (agent.id === 'sadar-11') {
          return {
            ...agent,
            status: newScenario === 'agent_down' ? 'closed' : 'surplus',
            surplusAmount: newScenario === 'agent_down' ? 0 : 12000,
          };
        }
        return agent;
      })
    );
  };

  // Rebalance Approval Handler
  const handleApproveRebalance = (proposal: RebalanceProposal) => {
    setApprovedRebalances([proposal, ...approvedRebalances]);
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === proposal.targetAgentId) {
          return {
            ...a,
            currentCash: a.currentCash + proposal.suggestedAmount,
            expectedShortage: Math.max(0, (a.expectedShortage || 0) - proposal.suggestedAmount),
            shortageRisk: 14,
            status: 'safe',
            queueLength: 2,
            avgWaitTimeMin: 4,
          };
        }
        if (a.id === proposal.partnerAgentId) {
          return {
            ...a,
            currentCash: Math.max(10000, a.currentCash - Math.min(15000, proposal.suggestedAmount)),
            surplusAmount: Math.max(0, a.surplusAmount - 15000),
          };
        }
        return a;
      })
    );

    const newLog: AuditLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventType: 'rebalance_approved',
      titleBn: `লিকুইডিটি রিব্যালেন্সিং অনুমোদিত (${formatTaka(proposal.suggestedAmount, true)})`,
      titleEn: `Liquidity Rebalance Approved (${formatTaka(proposal.suggestedAmount, false)})`,
      detailsBn: `ক্লাস্টার সুপারভাইজার কর্তৃক ${proposal.partnerAgentName} থেকে ${proposal.targetAgentName}-এ তহবিল বরাদ্দ।`,
      detailsEn: `Authorized by Cluster Supervisor from ${proposal.partnerAgentName} to ${proposal.targetAgentName}.`,
      actor: user?.name ? `${user.name} (${user.role.toUpperCase()})` : 'Area Supervisor OP-4029',
      zone: 'Dinajpur Sadar Bazar Zone-04',
      hash: proposal.auditHash,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Add Offer Handler
  const handleAddOffer = (merchantId: string, offer: Offer) => {
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === merchantId) {
          return { ...m, activeOffers: [offer, ...m.activeOffers] };
        }
        return m;
      })
    );

    const newLog: AuditLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventType: 'campaign_launched',
      titleBn: `স্মার্ট অফার প্রকাশিত: ${offer.titleBn}`,
      titleEn: `Smart Offer Published: ${offer.title}`,
      detailsBn: `${offer.merchantName}-এ নতুন অফার প্রকাশিত। মার্জিন সুরক্ষা স্কোর: ${offer.marginSafetyScore}/১০০।`,
      detailsEn: `Offer launched at ${offer.merchantName}. Margin safety score: ${offer.marginSafetyScore}/100.`,
      actor: user?.name ? `${user.name} (Merchant)` : 'Merchant Partner Portal',
      zone: 'Sadar Commercial Area',
      hash: 'UP-CP-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Record Customer Cash-Out Diverted
  const handleRecordCashoutDiverted = (amount: number, merchantName: string, savings: number) => {
    const newLog: AuditLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventType: 'cashout_diverted',
      titleBn: `জিরো-ক্যাশ রুট সাশ্রয় (${formatTaka(amount, true)})`,
      titleEn: `Zero-Cash Route Success (${formatTaka(amount, false)})`,
      detailsBn: `গ্রাহক সরাসরি উপায় কিউআরে কেনাকাটা করে ক্যাশ-আউট ফি বাবদ ${formatTaka(savings, true)} সাশ্রয় করেছেন।`,
      detailsEn: `Customer completed purchases directly via Upay QR, saving ${formatTaka(savings, false)} in charges.`,
      actor: user?.name ? `${user.name} (Customer)` : 'Customer App Zero-Cash Engine',
      zone: 'Dinajpur Sadar Bazar',
      hash: 'UP-ZC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Anomaly Resolution Handler
  const handleResolveAnomaly = (id: string, action: 'cleared' | 'restricted') => {
    setAnomalies((prev) =>
      prev.map((anom) => (anom.id === id ? { ...anom, status: action } : anom))
    );
  };

  // Open Rebalance Modal for specific agent
  const handleTriggerRebalance = (agent: Agent) => {
    setRebalanceTargetAgent(agent);
    setIsRebalanceModalOpen(true);
  };

  // Routing Logic:
  // 1. If not authenticated -> Render LoginPage
  if (!isAuthenticated || !user) {
    return (
      <>
        <LoginPage
          language={language}
          setLanguage={setLanguage}
          onOpenPitchAssistant={() => setIsPitchAssistantOpen(true)}
          onOpenTechModal={() => setIsTechModalOpen(true)}
        />
        <TechArchitectureModal
          isOpen={isTechModalOpen}
          onClose={() => setIsTechModalOpen(false)}
          language={language}
        />
        <PitchAssistant
          isOpen={isPitchAssistantOpen}
          onClose={() => setIsPitchAssistantOpen(false)}
          language={language}
          onSelectScenario={handleScenarioChange}
        />
      </>
    );
  }

  // 2. If authenticated as Customer -> Render CustomerDashboard
  if (user.accountType === 'customer') {
    return (
      <>
        <CustomerDashboard
          language={language}
          setLanguage={setLanguage}
          merchants={merchants}
          agents={agents}
          onOpenPitchAssistant={() => setIsPitchAssistantOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenTechModal={() => setIsTechModalOpen(true)}
          onRecordCashoutDiverted={handleRecordCashoutDiverted}
        />
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          language={language}
        />
        <TechArchitectureModal
          isOpen={isTechModalOpen}
          onClose={() => setIsTechModalOpen(false)}
          language={language}
        />
        <PitchAssistant
          isOpen={isPitchAssistantOpen}
          onClose={() => setIsPitchAssistantOpen(false)}
          language={language}
          onSelectScenario={handleScenarioChange}
        />
      </>
    );
  }

  // 3. If authenticated as Business (Agent, Merchant, Operator) -> Render BusinessDashboard
  return (
    <>
      <BusinessDashboard
        language={language}
        setLanguage={setLanguage}
        agents={agents}
        merchants={merchants}
        auditLogs={auditLogs}
        anomalies={anomalies}
        approvedRebalances={approvedRebalances}
        activeScenario={activeScenario}
        onScenarioChange={handleScenarioChange}
        onOpenPitchAssistant={() => setIsPitchAssistantOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTechModal={() => setIsTechModalOpen(true)}
        onRequestRebalance={handleTriggerRebalance}
        onOpenMicroMerchantModal={() => setIsMicroMerchantOpen(true)}
        onAddOfferToMerchant={handleAddOffer}
        onResolveAnomaly={handleResolveAnomaly}
      />
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        language={language}
      />
      <TechArchitectureModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
        language={language}
      />
      <RebalanceModal
        isOpen={isRebalanceModalOpen}
        onClose={() => setIsRebalanceModalOpen(false)}
        targetAgent={rebalanceTargetAgent}
        allAgents={agents}
        language={language}
        onApproveProposal={handleApproveRebalance}
      />
      <MicroMerchantModal
        isOpen={isMicroMerchantOpen}
        onClose={() => setIsMicroMerchantOpen(false)}
        language={language}
        onOnboardSuccess={() => {
          setMerchants((prev) =>
            prev.map((m) => (m.id === 'merch-05' ? { ...m, isEnrolled: true, upayVolumeShare: 15 } : m))
          );
        }}
      />
      <PitchAssistant
        isOpen={isPitchAssistantOpen}
        onClose={() => setIsPitchAssistantOpen(false)}
        language={language}
        onSelectScenario={handleScenarioChange}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
          <SmartBillProvider>
            <AppContent />
          </SmartBillProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
