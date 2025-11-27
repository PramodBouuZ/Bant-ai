import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini AI client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
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

    const responseText = response.text;

    if (responseText) {
      return JSON.parse(responseText) as BANTResult;
    } else {
      throw new Error("No response text from AI");
    }
  } catch (error) {
    console.error("AI Processing Error:", error);
    throw error;
  }
};