import React from 'react';
import { APP_NAME } from '../constants';

const AboutUsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About {APP_NAME}</h1>
      <div className="prose max-w-none text-gray-700">
        <p>
          Welcome to {APP_NAME}, the premier AI-powered SaaS and IT marketplace dedicated to connecting Indian companies and enterprises with top-tier technology solutions. We understand the unique challenges and opportunities within the Indian market, and our platform is specifically designed to streamline the procurement and sales processes for IT and software needs.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Our Mission</h2>
        <p>
          Our mission is to revolutionize how businesses discover and acquire IT solutions by leveraging cutting-edge Artificial Intelligence. We aim to create a transparent, efficient, and rewarding ecosystem for both solution seekers and providers.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">How We Work (BANT Parameters)</h2>
        <p>
          At the core of {APP_NAME} is our proprietary AI-driven BANT qualification framework. BANT stands for:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>Budget:</strong> We assess the financial resources available for a solution, ensuring that proposals align with a company's investment capacity.
          </li>
          <li>
            <strong>Authority:</strong> We identify the key decision-makers or influential stakeholders involved in the purchasing process.
          </li>
          <li>
            <strong>Need:</strong> Our AI precisely identifies the core problems a company aims to solve, translating them into clear, actionable requirements.
          </li>
          <li>
            <strong>Timeframe:</strong> We establish the urgency and implementation timeline, helping vendors prioritize and deliver promptly.
          </li>
        </ul>
        <p className="mt-4">
          By meticulously qualifying leads through these parameters, we ensure that vendors receive high-quality, actionable opportunities, and users get precisely matched with solutions that meet their specific needs.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">For Users & Companies</h2>
        <p>
          Post your IT or software requirements on {APP_NAME}, and our AI will automatically generate a perfect enquiry based on your BANT parameters. Discover recommended products, access a comprehensive product catalog, and utilize our smart search to find the ideal vendor.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">For Sales Professionals, Developers & Anyone</h2>
        <p>
          Monetize your network! Share qualified leads with us, and if your lead results in a successful deal closure on our platform, you can earn up to a 10% commission. It's a risk-free way to earn by connecting businesses with the solutions they need.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Join Us</h2>
        <p>
          Whether you're looking for an IT solution, want to become a verified vendor, or eager to earn commissions by submitting leads, {APP_NAME} is your trusted partner in the digital transformation journey.
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;