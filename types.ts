
// Enum for user roles
export enum UserRole {
  USER = 'user',
  VENDOR = 'vendor',
  ADMIN = 'admin',
}

// User Profile Interface
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  // Add other profile details as needed
}

// Product Interface
export interface Product {
  id: string;
  name: string;
  image: string;
  shortFeatures: string[];
  pricing: string; // e.g., "₹50/TB", "Starting at ₹1,000/mo", "500" for SIP trunk
  category: ProductCategory;
  vendorId?: string; // Optional, if a product is directly associated with a vendor
  description?: string;
  leads?: number; // Number of leads
  originalPrice?: string; // For showing discounts
  rating?: number; // 0 to 5
  tags?: string[]; // e.g., "Best Seller", "New", "Enterprise"
}

// Product Category Enum
export enum ProductCategory {
  INTERNET_LEASED_LINE = 'Internet Leased Line',
  SIP_TRUNK = 'SIP Trunk',
  CLOUD_STORAGE = 'Cloud Storage',
  CYBERSECURITY = 'SMB Cybersecurity Package',
  IT_SUPPORT = 'Proactive IT Support',
  VOICE_SOLUTIONS = 'Voice Solutions',
  CRM_SOFTWARE = 'CRM Software',
  WHATSAPP_API = 'WhatsApp API',
  CUSTOM_REQUIREMENT = 'Custom Requirement',
}

// Enquiry Interface (based on BANT)
export interface Enquiry {
  id: string;
  userId: string;
  productName?: string; // If enquiry is for a specific product
  category: ProductCategory | string; // Can be a custom string for custom requirements
  budget: string; // From BANT (e.g., "₹1,000/month", "₹12,000/year")
  authority: string; // From BANT (e.g., "decision maker", "recommending")
  need: string; // From BANT (e.g., "CRM with automation and WhatsApp integration")
  timeframe: string; // From BANT (e.g., "Immediately", "1-2 weeks", "3 months")
  fullEnquiryText: string; // AI-generated detailed enquiry
  status: 'pending' | 'approved' | 'rejected' | 'assigned';
  assignedVendorId?: string;
  createdAt: Date;
  location?: string; // For search
  keywords?: string[]; // For search
}

// Notification Interface
export interface Notification {
  id: string;
  userId: string; // Or vendorId, adminId
  message: string;
  type: 'info' | 'warning' | 'success' | 'action';
  read: boolean;
  createdAt: Date;
  link?: string; // Optional link to related content
}

// AI Recommendation Interface
export interface AIRecommendation {
  id: string;
  userId: string;
  product: Product;
  reason: string;
  createdAt: Date;
}

// BANT parameters for AI interaction
export interface BANTParameters {
  budget: string;
  authority: string;
  need: string;
  timeframe: string;
}

// Gemini API related types
// Re-exporting necessary types from @google/genai as they are not globally available.
// Note: These are example types. The actual types should be imported directly from @google/genai
// in the service file. This is just for local representation if needed for other components.
export enum GeminiModality {
  AUDIO = 'AUDIO',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export interface GenerateContentResponse {
  text?: string;
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
    groundingMetadata?: {
      groundingChunks?: Array<{
        web?: {
          uri: string;
          title: string;
        };
        maps?: {
          uri: string;
          title: string;
          placeAnswerSources?: Array<{
            reviewSnippets?: Array<{
              uri: string;
              title: string;
            }>;
          }>;
        };
      }>;
    };
  }>;
  // Other properties like functionCalls, etc.
}

export interface LiveServerMessage {
  serverContent?: {
    modelTurn?: {
      parts: Array<{
        inlineData: {
          data: string;
          mimeType: string;
        };
      }>;
    };
    outputTranscription?: {
      text: string;
      isFinal: boolean;
    };
    inputTranscription?: {
      text: string;
      isFinal: boolean;
    };
    turnComplete?: boolean;
    interrupted?: boolean;
  };
  toolCall?: {
    functionCalls: Array<{
      args: Record<string, unknown>;
      name: string;
      id: string;
    }>;
  };
}

export interface BlobData {
  data: string;
  mimeType: string;
}

export interface FunctionDeclaration {
  name: string;
  parameters: {
    type: 'OBJECT';
    description?: string;
    properties: Record<string, {type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ARRAY' | 'OBJECT'; description?: string; items?: {type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ARRAY' | 'OBJECT';};}>;
    required: string[];
  };
}

export enum GeminiType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  NULL = 'NULL',
}
