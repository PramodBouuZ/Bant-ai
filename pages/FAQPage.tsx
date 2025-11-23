import React from 'react';
import { APP_NAME } from '../constants';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-lg text-gray-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question.replace(/\s/g, '-')}`}
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        id={`faq-answer-${question.replace(/\s/g, '-')}`}
        className={`mt-2 text-gray-600 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ transitionProperty: 'max-height, opacity' }}
      >
        <p className="py-2">{answer}</p>
      </div>
    </div>
  );
};

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: `What is ${APP_NAME}?`,
      answer: `${APP_NAME} is an AI-powered SaaS and IT marketplace designed specifically for Indian companies and enterprises. It connects businesses seeking IT solutions with verified vendors and allows sales professionals to earn commissions by submitting qualified leads.`,
    },
    {
      question: 'How does the AI-qualification process work?',
      answer: 'Our AI uses the BANT framework (Budget, Authority, Need, Timeframe) to meticulously qualify every lead. This ensures that vendors receive high-quality, actionable opportunities, and users are matched with solutions that truly fit their requirements.',
    },
    {
      question: 'What kind of IT solutions can I find on BANTConfirm?',
      answer: 'You can find a wide range of SaaS and IT solutions, including Internet Leased Lines, SIP Trunks, Cloud Storage, Cybersecurity packages, IT Support, Voice Solutions, CRM Software, WhatsApp API, and even post custom requirements.',
    },
    {
      question: 'Can I earn commission by submitting leads?',
      answer: 'Yes! If you\'re a sales professional, developer, or anyone with a network, you can submit qualified IT or software leads. If your lead results in a successful deal closure through our platform, you can earn up to a 10% commission.',
    },
    {
      question: 'How do I become a vendor?',
      answer: 'You can sign up as a vendor on our platform. Our team will then vet your company to ensure quality and reliability. Once approved, you can list your products/services and start receiving AI-qualified leads.',
    },
    {
      question: 'Is there support available?',
      answer: 'Yes, we offer 24/7 support. You can reach out to us via email at support@bantconfirm.com for any queries or assistance.',
    },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h1>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQPage;