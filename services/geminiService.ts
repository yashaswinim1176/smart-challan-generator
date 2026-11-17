import { GoogleGenAI, Type } from "@google/genai";
import { OcrResult, Language } from "../types";

// Safe API key getter that checks all common sources without throwing at startup
const getApiKey = (): string => {
  try {
    const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
    const key =
      metaEnv?.VITE_GEMINI_API_KEY ||
      metaEnv?.VITE_API_KEY ||
      (typeof process !== 'undefined' && process.env?.API_KEY) ||
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('gemini_api_key') : null) ||
      '';
    return (key || '').trim();
  } catch {
    return '';
  }
};

// Lazy initialization of GoogleGenAI client to avoid crashing on module load
const getGenAI = (): GoogleGenAI | null => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.warn("Failed to initialize GoogleGenAI:", error);
    return null;
  }
};

export const extractPassbookData = async (base64Image: string): Promise<OcrResult> => {
  const ai = getGenAI();
  if (!ai) {
    console.warn("Gemini API key is not configured. Falling back to manual entry.");
    throw new Error("Gemini API key is not configured. Please enter passbook details manually or add VITE_GEMINI_API_KEY.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: "Extract the Account Number, Account Holder Name, and Branch Name from this passbook image. If a field is not visible, return an empty string." },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            accountNumber: { type: Type.STRING },
            branchName: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as OcrResult;
    }
    return {};
  } catch (error) {
    console.error("OCR Error:", error);
    throw error;
  }
};

export const convertToRegionalWords = async (amount: string, language: Language): Promise<string> => {
  if (language === Language.ENGLISH) return ""; // Handled locally

  const langName = language === Language.HINDI ? "Hindi" : "Kannada";
  const ai = getGenAI();
  if (!ai) {
    // Graceful fallback when API key is missing so user experience remains smooth
    return "";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Convert the number ${amount} into currency format words in the ${langName} language. Return only the string of words. Example: 'Five Hundred' -> 'पांच सौ'`,
      config: {
        maxOutputTokens: 50,
        temperature: 0.2
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Translation Error:", error);
    return "";
  }
};

export const askPostalAssistant = async (query: string): Promise<{answer: string, sources: any[]}> => {
  const ai = getGenAI();
  if (!ai) {
    return {
      answer: "Gemini API key is not configured. To use the AI postal assistant, please add your Gemini API key (VITE_GEMINI_API_KEY in your environment or Vercel dashboard).",
      sources: []
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a helpful India Post assistant. Answer this query concisely regarding Post Office schemes (interest rates, rules, etc.): ${query}`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "I couldn't find that information.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { answer: text, sources };
  } catch (error) {
    console.error("Assistant Error:", error);
    return { answer: "Service temporarily unavailable. Please try again later.", sources: [] };
  }
};
