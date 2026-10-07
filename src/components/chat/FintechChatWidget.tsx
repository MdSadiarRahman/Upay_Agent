import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  ShieldCheck,
  User,
  RotateCcw,
  Copy,
  Check,
  Volume2,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { Language } from '../../types';
import { AuthUser } from '../../types/auth';
import {
  ChatMessageItem,
  ChatRole,
  processFintechChatQuery,
} from '../../services/fintechChatEngine';

interface FintechChatWidgetProps {
  role: ChatRole;
  user?: AuthUser | null;
  language: Language;
  setLanguage?: (lang: Language) => void;
  isFloating?: boolean;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  onTriggerAppAction?: (actionId: string, payload?: any) => void;
  walletBalance?: number;
}

export const FintechChatWidget: React.FC<FintechChatWidgetProps> = ({
  role,
  user,
  language,
  setLanguage,
  isFloating = false,
  isOpen = true,
  onToggleOpen,
  onTriggerAppAction,
  walletBalance = 4500,
}) => {
  const isBn = language === 'bn';
  const isCustomer = role === 'customer';

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      textBn: isCustomer
        ? `হ্যালো! উপায়পালস এআই-তে আপনাকে স্বাগতম। আজ কীভাবে আপনার ডিজিটাল আর্থিক সেবায় সহায়তা করতে পারি? আপনার ওয়ালেট ব্যালেন্স, পার্সোনালাইজড অফার, জিরো-ক্যাশ রুট ও নিরাপত্তা সেবা সম্পর্কে যেকোনো তথ্য জানতে পারেন।`
        : `হ্যালো! উপায়পালস এআই বিজনেস স্যুইটে আপনাকে স্বাগতম। আজ কীভাবে আপনার ব্যবসায়িক কার্যক্রমে সহায়তা করতে পারি? এজেন্ট লিকুইডিটি ফোরকাস্টিং, ক্লাস্টার রিব্যালেন্সিং কিংবা মার্চেন্ট গ্রোথ বুস্টার পরিচালনা করতে পারি।`,
      textEn: isCustomer
        ? `Hello! Welcome to UpayPulse AI. How can I assist you today with your digital financial needs? I can assist with checking available balance, exploring personalized offers, finding zero-cash routes, and security queries.`
        : `Hello! Welcome to UpayPulse AI. How can I assist you today with your digital financial needs? I can assist with agent liquidity forecasting, cluster cash rebalancing, demand predictions, and merchant growth insights.`,
      timestamp: 'Just now',
      intentCategory: 'greetings',
      suggestedActions: isCustomer
        ? [
            { labelBn: 'ব্যালেন্স পরীক্ষা করুন', labelEn: 'Check Available Balance', actionId: 'check_balance' },
            { labelBn: 'কাছের অফারসমূহ', labelEn: 'Personalized Offers', actionId: 'view_offers' },
            { labelBn: 'জিরো-ক্যাশ রুট', labelEn: 'Zero-Cash Route Planner', actionId: 'view_route' },
          ]
        : [
            { labelBn: 'লিকুইডিটি ঝুঁকি ফোরকাস্ট', labelEn: 'Liquidity Risk Forecast', actionId: 'liquidity_query' },
            { labelBn: 'পার্টনার রিব্যালেন্সিং', labelEn: 'PartnerScore Rebalancing', actionId: 'rebalance_query' },
            { labelBn: 'মার্চেন্ট গ্রোথ বুস্টার', labelEn: 'Merchant Growth Booster', actionId: 'merchant_growth_query' },
          ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleQuickChipClick = (queryText: string) => {
    handleSendMessage(queryText);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessageItem = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      textBn: query,
      textEn: query,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    try {
      const response = await processFintechChatQuery(
        query,
        {
          role,
          user,
          activeLanguage: language,
          walletBalance,
        },
        messages
      );
      setIsTyping(false);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          textBn: 'দুঃখিত, সংযোগে সাময়িক বিলম্ব হচ্ছে। অনুগ্রহ করে আপনার প্রশ্নটি পুনরায় করুন।',
          textEn: 'Sorry, there was a temporary delay. Please try your question again.',
          timestamp,
        },
      ]);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isBn ? 'bn-BD' : 'en-US';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'init-refresh-' + Date.now(),
        sender: 'assistant',
        textBn: isCustomer
          ? 'কথোপকথন রিসেট করা হয়েছে। আপনার পরবর্তী আর্থিক প্রশ্নটি করতে পারেন।'
          : 'বিজনেস চ্যাট হিস্টোরি রিফ্রেশ করা হয়েছে। অপারেশনের কী তথ্য প্রয়োজন?',
        textEn: isCustomer
          ? 'Chat history reset. Feel free to ask your next financial question.'
          : 'Business chat history refreshed. How may I assist your operations now?',
        timestamp: 'Just now',
        intentCategory: 'greetings',
      },
    ]);
  };

  if (isFloating && !isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        aria-label="Open UpayPulse AI Assistant"
        className={`fixed bottom-5 right-5 z-40 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
          isCustomer
            ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20'
            : 'bg-blue-600 text-white ring-4 ring-blue-500/20'
        }`}
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <div className="text-left hidden sm:block">
          <span className="text-xs font-black block leading-none">
            UpayPulse <span className={isCustomer ? 'text-slate-900 font-extrabold' : 'text-amber-300 font-extrabold'}>AI</span>
          </span>
          <span className="text-[10px] font-semibold opacity-90 block">
            {isCustomer ? (isBn ? 'গ্রাহক সহকারী' : 'Customer Assistant') : (isBn ? 'বিজনেস এআই' : 'Business AI')}
          </span>
        </div>
      </button>
    );
  }

  const customerQuickPrompts = [
    { bn: 'কোথায় বেশি খরচ করেছি?', en: 'Where did I spend most money?' },
    { bn: 'কীভাবে টাকা সঞ্চয় করব?', en: 'How can I save this month?' },
    { bn: 'নিকটস্থ কোনো অফার আছে?', en: 'Any offer near me?' },
    { bn: 'আমার ওষুধ ও মুদি বাজার প্রয়োজন', en: 'I need medicine and groceries' },
    { bn: 'আপনারা কি আমার ডাটা বিক্রি করেন?', en: 'Do you sell my data?' },
    { bn: 'আমার লোকেশন কি ট্র্যাক করেন?', en: 'Do you track my location?' },
    { bn: 'ক্যাশ-আউটের চেয়ে কিউআর পেমেন্ট কেন ভালো?', en: 'Why merchant payment over cash-out?' },
  ];

  const businessQuickPrompts = [
    { bn: 'আমার ক্যাশ কখন শেষ হবে?', en: 'When will my cash finish?' },
    { bn: 'পার্টনারস্কোর কীভাবে কাজ করে?', en: 'How does PartnerScore work?' },
    { bn: 'দোকানের বিক্রি কীভাবে বাড়াব?', en: 'How can I increase sales?' },
    { bn: 'এআই কি স্বয়ংক্রিয়ভাবে টাকা সরাতে পারে?', en: 'Can AI transfer money automatically?' },
    { bn: 'ক্যাশ প্রেসার ম্যাপ কীভাবে বুঝব?', en: 'Explain Cash Pressure Map' },
    { bn: 'ব্যবসায়িক ডাটা কি নিরাপদ?', en: 'Is business data safe?' },
  ];

  const activePrompts = isCustomer ? customerQuickPrompts : businessQuickPrompts;

  const containerClasses = isFloating
    ? 'fixed bottom-5 right-5 z-50 w-full sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in'
    : 'w-full h-[620px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col overflow-hidden';

  return (
    <div className={containerClasses}>
      {/* Top Accent Strip */}
      <div
        className={`h-1.5 w-full shrink-0 ${
          isCustomer
            ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500'
            : 'bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400'
        }`}
      />

      {/* Header */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${
              isCustomer
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
            }`}
          >
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white">UpayPulse AI</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  isCustomer
                    ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30'
                    : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                }`}
              >
                {isCustomer ? (isBn ? 'গ্রাহক সেবা' : 'Customer Support') : (isBn ? 'বিজনেস পার্টনার' : 'Business Partner')}
              </span>
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
              <span>{isBn ? 'সক্রিয় ও সুরক্ষিত' : 'Online & Encrypted'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            title={isBn ? 'চ্যাট রিসেট' : 'Reset chat'}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {isFloating && (
            <button
              onClick={onToggleOpen}
              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Prompts Carousel Bar */}
      <div className="px-3 py-2 bg-slate-50/50 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800 overflow-x-auto flex space-x-1.5 shrink-0 text-xs no-scrollbar">
        {activePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickChipClick(isBn ? p.bn : p.en)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap text-[11px] font-medium border border-slate-200 dark:border-slate-700/60 transition flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span>{isBn ? p.bn : p.en}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const text = isBn ? msg.textBn : msg.textEn;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`flex gap-2 max-w-[88%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    isUser
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200'
                      : isCustomer
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-2xl leading-relaxed text-xs ${
                    isUser
                      ? 'bg-amber-400 text-slate-950 font-semibold rounded-tr-none shadow-sm'
                      : msg.isGuardrailBlocked
                      ? 'bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800/70 rounded-tl-none shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700/70 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.isGuardrailBlocked && (
                    <div className="flex items-center gap-1.5 mb-2 text-red-600 dark:text-red-400 font-bold border-b border-red-200 dark:border-red-800/50 pb-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isBn ? 'নিরাপত্তা অ্যালার্ট' : 'Safety Guardrail Triggered'}</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{text}</p>
                  
                  {/* AI Metadata (Confidence & Source) */}
                  {!isUser && msg.confidenceScore && (
                    <div className="mt-2 mb-1 pt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] opacity-80">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{isBn ? 'নির্ভুলতা:' : 'Confidence:'}</span>
                        <span className={msg.confidenceScore >= 90 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>
                          {msg.confidenceScore}%
                        </span>
                      </div>
                      {msg.source && (
                        <div className="flex items-center gap-1 text-slate-500">
                          <span className="font-semibold">{isBn ? 'উৎস:' : 'Source:'}</span>
                          <span>{msg.source}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions & Utilities on AI Messages */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="font-mono">{msg.timestamp}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeak(text, msg.id)}
                          title={isBn ? 'শুনুন' : 'Listen'}
                          className={`p-1 rounded hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer ${
                            speakingId === msg.id ? 'text-amber-500' : ''
                          }`}
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleCopy(text, msg.id)}
                          title={isBn ? 'কপি' : 'Copy'}
                          className="p-1 rounded hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Chips Underneath Assistant Messages */}
              {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-9 pt-1">
                  {msg.suggestedActions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (onTriggerAppAction) {
                          onTriggerAppAction(act.actionId);
                        } else {
                          handleSendMessage(isBn ? act.labelBn : act.labelEn);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-slate-950 hover:bg-amber-100 dark:hover:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-400/30 text-[11px] font-semibold transition cursor-pointer shadow-sm"
                    >
                      <ArrowRight className="w-3 h-3" />
                      <span>{isBn ? act.labelBn : act.labelEn}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
            <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-amber-500">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1">
                {isBn ? 'উপায়পালস এআই ভাবছে...' : 'UpayPulse AI is thinking...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Compliance / Privacy Disclaimer */}
      <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>
            {isBn
              ? 'উপায় প্রাইভেসি পলিসি ও রেসপন্সিবল এআই দ্বারা সুরক্ষিত'
              : 'Upay Privacy Policy & Responsible AI Protected'}
          </span>
        </div>
        <span className="font-mono">
          {isCustomer ? (isBn ? 'ব্যালেন্স: ৳ ' + walletBalance : 'Bal: ৳ ' + walletBalance) : 'Cluster Sadar-04'}
        </span>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2.5 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            isCustomer
              ? isBn
                ? 'ব্যালেন্স, খরচ, অফার বা প্রাইভেসি সম্পর্কে লিখুন...'
                : 'Ask about balance, spending, offers or privacy...'
              : isBn
              ? 'ক্যাশ পূর্বাভাস, রিব্যালেন্সিং বা সেলস নিয়ে জিজ্ঞাসা করুন...'
              : 'Ask about liquidity forecast, rebalancing or sales...'
          }
          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className={`p-2 rounded-xl text-slate-950 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            isCustomer
              ? 'bg-amber-400 hover:bg-amber-500'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
