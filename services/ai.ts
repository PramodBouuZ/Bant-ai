// AI Feature disabled for Vercel Deployment stability
// This file now provides a mock response to simulate the analysis process.

export interface BANTResult {
  budget: string;
  authority: string;
  need: string;
  timeframe: string;
  summary: string;
  category: string;
}

export const qualifyLeadWithAI = async (userInput: string): Promise<BANTResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log("AI Analysis mocked for input:", userInput);

  // Basic keyword matching to simulate category detection
  const lowerInput = userInput.toLowerCase();
  let category = "Custom Requirement";
  
  if (lowerInput.includes("crm")) category = "CRM Software";
  else if (lowerInput.includes("voice") || lowerInput.includes("call") || lowerInput.includes("sip")) category = "Voice Solutions";
  else if (lowerInput.includes("cloud") || lowerInput.includes("storage")) category = "Cloud Storage";
  else if (lowerInput.includes("internet") || lowerInput.includes("leased") || lowerInput.includes("broadband")) category = "Internet Leased Line";
  else if (lowerInput.includes("security") || lowerInput.includes("cyber")) category = "SMB Cybersecurity Package";
  else if (lowerInput.includes("whatsapp")) category = "WhatsApp API";

  // Return mock BANT data
  return {
    budget: "Not specified (AI Disabled)",
    authority: "Not specified (AI Disabled)",
    need: userInput.length > 50 ? userInput.substring(0, 50) + "..." : userInput,
    timeframe: "Immediate (Default)",
    summary: `(Note: AI features are currently disabled for deployment). The user is interested in ${category}. Details provided: "${userInput}"`,
    category: category
  };
};