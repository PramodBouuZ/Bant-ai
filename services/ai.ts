
import { GoogleGenAI, Type } from "@google/genai";

// Helper to get API Key safely across environments
const getApiKey = () => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return '';
};

const apiKey = getApiKey();

if (!apiKey) {
  console.warn("Gemini API Key is missing. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey });

export interface BANTResult {
  budget: string;
  authority: string;
  need: string;
  timeframe: string;
  summary: string;
  category: string;
}

export const qualifyLeadWithAI = async (userInput: string): Promise<BANTResult> => {
  if (!apiKey) throw new Error("API Key not configured");

  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are an expert sales qualifier for an IT Marketplace. 
      Analyze the following user input and extract the BANT parameters (Budget, Authority, Need, Timeframe).
      
      User Input: "${userInput}"
      
      If a parameter is not explicitly stated, infer it reasonably or state "Not specified".
      Also determine the best fitting IT category (e.g., Cloud Storage, SIP Trunk, CRM, etc.) and write a professional summary.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            budget: { type: Type.STRING, description: "The budget mentioned or implied" },
            authority: { type: Type.STRING, description: "The decision making power of the user" },
            need: { type: Type.STRING, description: "The specific technical or business requirement" },
            timeframe: { type: Type.STRING, description: "When they need this implemented" },
            summary: { type: Type.STRING, description: "A professional summary of the enquiry" },
            category: { type: Type.STRING, description: "The most relevant IT category" }
          },
          required: ["budget", "authority", "need", "timeframe", "summary", "category"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as BANTResult;
    } else {
      throw new Error("No response text from AI");
    }
  } catch (error) {
    console.error("AI Processing Error:", error);
    throw error;
  }
};
