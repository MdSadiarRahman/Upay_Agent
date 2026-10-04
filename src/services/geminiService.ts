/**
 * Gemini API Integration Service for UpayPulse AI
 * Uses Google Gen AI SDK (@google/genai)
 */
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client if API key is present in environment
const apiKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
  (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
  '';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface GeminiAnalysisResponse {
  answerBn: string;
  answerEn: string;
  source: 'gemini-live' | 'fallback-engine';
}

/**
 * Ask Gemini financial advisory question with MFS ecosystem grounding
 */
export async function queryGeminiAdvisor(
  prompt: string,
  userRole: 'customer' | 'agent' | 'merchant' | 'operator',
  contextData?: any
): Promise<GeminiAnalysisResponse> {
  if (ai) {
    try {
      const systemInstruction = `You are UpayPulse AI, an intelligent mobile financial service advisor inspired by Upay Bangladesh. You assist ${userRole}s in Dinajpur Sadar, Bangladesh. Provide concise, practical advice in both Bengali and English. Emphasize saving cash-out fees (1.4%), rebalancing agent liquidity, and promoting merchant payments.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      const text = response.text || '';
      return {
        answerBn: text,
        answerEn: text,
        source: 'gemini-live',
      };
    } catch (error) {
      console.warn('Gemini API call failed, falling back to deterministic intelligence:', error);
    }
  }

  // Fallback high-fidelity deterministic response
  return {
    answerBn: `উপায়পালস এআই পরামর্শ: দিনাজপুর সদরের স্থানীয় মার্চেন্টদের কিউআর কোড ব্যবহার করে সরাসরি কেনাকাটা করলে প্রতি হাজার টাকায় ১৪ টাকা (১.৪%) ক্যাশ-আউট ফি সাশ্রয় হয়।`,
    answerEn: `UpayPulse AI recommendation: Completing purchases via Upay QR in Dinajpur Sadar saves 1.4% (৳ 14 per ৳ 1,000) in cash-out withdrawal fees.`,
    source: 'fallback-engine',
  };
}
