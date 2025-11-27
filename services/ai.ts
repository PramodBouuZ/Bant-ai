import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client
// Per guidelines, we must use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface BANTResult {
  budget: string;
  authority: string;
  need: string;
  timeframe: string;
  summary: string;
  category: string;
}

export const qualifyLeadWithAI = async (userInput: string): Promise<BANTResult> => {
  try {
    const prompt = `
      You are an expert sales qualifier for an IT Marketplace. 
      Analyze the following user input and extract the BANT parameters (Budget, Authority, Need, Timeframe).
      
      User Input: "${userInput}"
      
      Instructions:
      1. Extract BANT parameters. If not explicitly stated, infer reasonably or state "Not specified".
      2. **Crucial**: Determine the MOST SPECIFIC IT category possible. Do not use generic terms if specific ones apply. 
         - Example: Instead of "CRM", specify "CRM Software", "Real Estate CRM", or "WhatsApp CRM API" based on context.
         - Example: Instead of "Voice", specify "SIP Trunk", "Cloud Telephony", or "Call Center Solution".
      3. Write a professional summary of the enquiry.
    `;

    // Using gemini-2.5-flash as it is the recommended model for basic text tasks
    const response = await ai.models.generateContent({ 
      model: "gemini-2.5-flash",
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
            category: { type: Type.STRING, description: "The specific IT category identified" }
          },
          required: ["budget", "authority", "need", "timeframe", "summary", "category"]
        }
      }
    });
    
    // Access text property directly as per @google/genai SDK
    const text = response.text;

    if (text) {
      return JSON.parse(text) as BANTResult;
    } else {
      throw new Error("No response text from AI");
    }
  } catch (error) {
    console.error("AI Processing Error:", error);
    throw error;
  }
};