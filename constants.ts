import { ProductCategory, Product, UserRole, UserProfile, Enquiry, AIRecommendation, Notification } from './types';

export const APP_NAME = 'BANTConfirm';
export const APP_DESCRIPTION = 'The Premier Marketplace for AI-Qualified Telco Needs';
export const APP_TAGLINE = 'Connect with top-tier vendors, find the perfect IT solutions, or earn up to 10% commission by sharing qualified leads.';

export const COLORS = {
  primary: '#2563eb', // Tailwind blue-600 for "BANT"
  accent: '#facc15', // Tailwind yellow-400 for "Confirm"
  text: '#333333',
  lightText: '#666666',
  background: '#f7f9fc',
  cardBackground: '#ffffff',
  border: '#e2e8f0',
};

// --- Mock Data ---

// Mock Products
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'SIP Trunk',
    image: 'https://picsum.photos/400/250?random=1',
    shortFeatures: ['Reliable voice calls', 'Scalable', 'Cost-effective'],
    pricing: '500',
    category: ProductCategory.SIP_TRUNK,
    leads: 0,
    description: 'High-quality SIP trunking solutions for businesses of all sizes, ensuring seamless voice communication.',
    rating: 4.5,
    tags: ['Best Seller', 'Voice'],
  },
  {
    id: 'prod-002',
    name: 'Cloud Storage Pro',
    image: 'https://picsum.photos/400/250?random=2',
    shortFeatures: ['Secure data storage', 'Easy access', 'Scalable capacity'],
    pricing: '₹50/TB',
    category: ProductCategory.CLOUD_STORAGE,
    vendorId: 'vendor-001',
    leads: 0,
    description: 'Enterprise-grade cloud storage with advanced security features and flexible pricing per terabyte.',
    rating: 4.2,
    tags: ['Enterprise', 'Secure'],
  },
  {
    id: 'prod-003',
    name: 'Internet Lease Line',
    image: 'https://picsum.photos/400/250?random=3',
    shortFeatures: ['Dedicated bandwidth', 'High speed', '24/7 support'],
    pricing: '₹7000/mo',
    originalPrice: '₹7500/mo',
    category: ProductCategory.INTERNET_LEASED_LINE,
    vendorId: 'vendor-002',
    leads: 0,
    description: 'A dedicated internet connection offering unparalleled speed and reliability for critical business operations.',
    rating: 4.8,
    tags: ['Premium', 'High Speed'],
  },
  {
    id: 'prod-004',
    name: 'SMB Cybersecurity Package',
    image: 'https://picsum.photos/400/250?random=4',
    shortFeatures: ['Threat detection', 'Data protection', 'Compliance'],
    pricing: '₹199/mo',
    category: ProductCategory.CYBERSECURITY,
    vendorId: 'vendor-003',
    leads: 0,
    description: 'Comprehensive cybersecurity solutions tailored for small and medium businesses to protect against evolving threats.',
    rating: 4.7,
    tags: ['SMB', 'Security'],
  },
  {
    id: 'prod-005',
    name: 'Proactive IT Support',
    image: 'https://picsum.photos/400/250?random=5',
    shortFeatures: ['24/7 monitoring', 'Remote assistance', 'Preventative maintenance'],
    pricing: 'Starting at ₹1,000/mo',
    category: ProductCategory.IT_SUPPORT,
    vendorId: 'vendor-001',
    leads: 0,
    description: 'Never worry about IT issues again with our proactive monitoring and rapid response support services.',
    rating: 4.0,
    tags: ['Support', '24/7'],
  },
  {
    id: 'prod-006',
    name: 'Voice Solutions for Enterprises',
    image: 'https://picsum.photos/400/250?random=6',
    shortFeatures: ['Integrated communication', 'Unified messaging', 'Advanced IVR'],
    pricing: '₹45/user/mo',
    category: ProductCategory.VOICE_SOLUTIONS,
    vendorId: 'vendor-002',
    leads: 0,
    description: 'Advanced voice communication platforms designed for large enterprises, enhancing productivity and connectivity.',
    rating: 4.6,
    tags: ['Enterprise', 'Communication'],
  },
  {
    id: 'prod-007',
    name: 'CRM Software Basic',
    image: 'https://picsum.photos/400/250?random=7',
    shortFeatures: ['Lead management', 'Customer tracking', 'Sales automation'],
    pricing: '₹800/mo',
    category: ProductCategory.CRM_SOFTWARE,
    leads: 0,
    description: 'Essential CRM features for small teams to manage customer relationships and streamline sales processes.',
    rating: 3.9,
    tags: ['Startup', 'Software'],
  },
  {
    id: 'prod-008',
    name: 'WhatsApp Business API',
    image: 'https://picsum.photos/400/250?random=8',
    shortFeatures: ['Automated messaging', 'Broadcast campaigns', 'Customer support'],
    pricing: 'Custom pricing',
    category: ProductCategory.WHATSAPP_API,
    leads: 0,
    description: 'Integrate WhatsApp for business communication, enabling automated responses and direct customer engagement.',
    rating: 4.3,
    tags: ['API', 'Marketing'],
  },
];

// Mock Categories
export const MOCK_CATEGORIES = [
  { name: ProductCategory.INTERNET_LEASED_LINE, icon: '🌐', items: 0 },
  { name: ProductCategory.SIP_TRUNK, icon: '📞', items: 0 },
  { name: ProductCategory.CLOUD_STORAGE, icon: '☁️', items: 0 },
  { name: ProductCategory.CYBERSECURITY, icon: '🔒', items: 0 },
  { name: ProductCategory.IT_SUPPORT, icon: '💻', items: 0 },
  { name: ProductCategory.VOICE_SOLUTIONS, icon: '🗣️', items: 0 },
];

// Mock Users
export const MOCK_USERS: UserProfile[] = [
  { id: 'user-001', email: 'user@example.com', username: 'StandardUser', role: UserRole.USER },
  { id: 'vendor-001', email: 'vendor@example.com', username: 'TechSolutions Inc.', role: UserRole.VENDOR },
  { id: 'admin-001', email: 'admin@example.com', username: 'AdminMaster', role: UserRole.ADMIN },
];

// Mock Recommendations
export const MOCK_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'rec-001',
    userId: 'user-001',
    product: MOCK_PRODUCTS[0], // SIP Trunk
    reason: 'Based on your recent search for Voice Solutions',
    createdAt: new Date(),
  },
  {
    id: 'rec-002',
    userId: 'user-001',
    product: MOCK_PRODUCTS[3], // SMB Cybersecurity
    reason: 'Popular among startups like yours',
    createdAt: new Date(),
  },
  {
    id: 'rec-003',
    userId: 'user-001',
    product: MOCK_PRODUCTS[6], // CRM Software
    reason: 'Great match for your budget',
    createdAt: new Date(),
  },
];

// Mock Enquiries
export const MOCK_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-001',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '9876543210',
    message: 'Interested in CRM with WhatsApp automation.',
    category: 'CRM Software',
    budget: '₹1,000/month',
    authority: 'decision maker',
    need: 'CRM with automation and WhatsApp integration',
    timeframe: '1-2 weeks',
    fullEnquiryText:
      'Looking for CRM Software with automation and WhatsApp integration.',
    status: 'pending',
    createdAt: new Date('2024-07-20T10:00:00Z'),
  },

  {
    id: 'enq-002',
    name: 'Amit Verma',
    email: 'amit@example.com',
    phone: '9123456780',
    message: 'Need SIP trunk for office setup.',
    category: 'SIP Trunk',
    budget: '₹2,500/month',
    authority: 'IT Manager',
    need: 'SIP trunk with 10 channels',
    timeframe: 'Immediate',
    fullEnquiryText: 'Need SIP trunk for voice solution in office.',
    status: 'approved',
    createdAt: new Date('2024-07-22T09:00:00Z'),
  },

  {
    id: 'enq-003',
    name: 'Sneha Patel',
    email: 'sneha@example.com',
    phone: '9001200345',
    message: 'Looking for cybersecurity package.',
    category: 'SMB Cybersecurity Package',
    budget: '₹5,000/month',
    authority: 'Founder',
    need: 'Cybersecurity for SMB with monitoring',
    timeframe: '3-4 weeks',
    fullEnquiryText:
      'Looking for an SMB Cybersecurity Package including monitoring.',
    status: 'assigned',
    createdAt: new Date('2024-07-25T11:00:00Z'),
  }
];

// Links for Footer and Navbar
export const COMPANY_LINKS = [
  { name: 'About Us', path: '/about' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Careers', path: '/careers' }, // Placeholder
];

export const PARTNER_LINKS = [
  { name: 'Become a Vendor', path: '/signup?role=vendor' },
  { name: 'Submit a Lead', path: '/submit-lead' }, // Placeholder
  { name: 'Partner Login', path: '/vendor-dashboard' }, // Placeholder
];

export const SOCIAL_LINKS = [
  { name: 'Facebook', url: 'https://facebook.com' },
  { name: 'Twitter', url: 'https://twitter.com' },
  { name: 'LinkedIn', url: 'https://linkedin.com' },
];
