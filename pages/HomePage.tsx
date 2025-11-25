
import React, { useState, useEffect } from 'react';
import {
  APP_NAME, MOCK_PRODUCTS, MOCK_CATEGORIES
} from '../constants';
import { ProductCategory, Product } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check for success param from PostRequirementPage
    if (location.search.includes('success=true')) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Implement actual search logic later
  };

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.shortFeatures[0]}</p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900">{product.pricing}</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      {showSuccess && (
         <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-bounce">
           ✅ Enquiry Posted Successfully!
         </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-8 md:p-16 mb-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          {/* Background animation element (placeholder) */}
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://picsum.photos/1200/800?blur=5")' }}></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
            The Premier Marketplace for AI-Qualified <span className="text-yellow-300">Telco Needs</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in delay-200">
            Connect with top-tier vendors, find the perfect IT solutions, or earn up to 10% commission by sharing qualified leads.
          </p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in delay-400">
            <input
              type="text"
              placeholder="Search for services, solutions..."
              className="w-full sm:w-2/3 md:w-1/2 px-6 py-3 rounded-full border-2 border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for services or solutions"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full hover:bg-yellow-300 transition-colors duration-300 shadow-lg"
              aria-label="Search"
            >
              Search
            </button>
          </form>
          
          <div className="mt-8 flex justify-center gap-4">
             <button 
               onClick={() => navigate('/post-requirement')}
               className="bg-white text-blue-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1"
             >
               ✨ Post Requirement with AI
             </button>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Popular Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_CATEGORIES.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col items-center"
              role="button"
              tabIndex={0}
              aria-label={`View ${category.name} category`}
            >
              <div
                className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full mb-4 text-4xl text-blue-600"
                aria-hidden="true"
              >
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.items} Items</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrival Products */}
      <section className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">New Arrival Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTS.slice(0, 3).map(renderProductCard)}
        </div>
        <div className="text-center mt-10">
          <a
            href="#"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-colors duration-300"
            aria-label="View all new arrival products"
          >
            View All Products
          </a>
        </div>
      </section>

      {/* Featured IT Solutions */}
      <section className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured IT Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTS.slice(3, 6).map(renderProductCard)}
        </div>
        <div className="text-center mt-10">
          <a
            href="#"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-colors duration-300"
            aria-label="View all featured IT solutions"
          >
            View All Solutions
          </a>
        </div>
      </section>

      {/* Why Choose BANTConfirm */}
      <section className="my-12 bg-blue-900 text-white py-16 px-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold text-center mb-10">Why Choose BANTConfirm?</h2>
        <p className="text-xl text-center mb-12 opacity-90">
          The smarter way to source and sell business technology.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-600 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21v-4.75m0 0V7.5M4.75 7.5h14.5M4.75 7.5a6.002 6.002 0 00-4.083 4.878A6.002 6.002 0 004.75 16.5m14.5 0a6.002 6.002 0 004.083-4.878A6.002 6.002 0 0019.25 7.5m-14.5 9h14.5m-9-4.75h9.5" />
            </svg>
            <h3 className="text-2xl font-bold mb-3">Intelligent Matching</h3>
            <p className="text-gray-600">
              Our AI qualifies every lead with the BANT framework, ensuring vendors receive high-quality, actionable opportunities.
            </p>
          </div>
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-600 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.952-.303 3.8-.84 5.518-.328 1.05-.596 1.48-.689 1.636l-.018.025a1 1 0 01-.69.31h-4.346a1 1 0 01-.69-.31l-.018-.025c-.093-.156-.361-.586-.689-1.636C3.303 15.8 3 13.952 3 12c0-2.115.405-4.14 1.147-6.042.342-.893.456-1.077.56-1.282A1.001 1.001 0 015.657 4.5h12.686c.334 0 .652.164.843.44.104.205.218.39.56 1.282A15.926 15.926 0 0121 12z" />
            </svg>
            <h3 className="text-2xl font-bold mb-3">Verified Vendors</h3>
            <p className="text-gray-600">
              Rest assured that every vendor on our platform is thoroughly vetted for quality and reliability, so you can procure with confidence.
            </p>
          </div>
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-600 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.59-3.045M18.75 9.75L22.929 12l-4.179 2.25m0-4.5l-5.59-3.045M5.625 15.75l5.844 3.179M20.25 15.75l-5.844 3.179M7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
            </svg>
            <h3 className="text-2xl font-bold mb-3">Complete Solutions</h3>
            <p className="text-gray-600">
              From initial search to deal closure, BANTConfirm offers end-to-end solutions for both buyers and sellers.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action for Vendors & Leads */}
      <section className="my-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Pay-Per-Success AI Lead Generation</h3>
          <p className="text-gray-600">
            Join our marketplace and receive AI-qualified leads that are ready for engagement. You only pay a success fee when you close a deal, making it a risk-free channel for business growth.
          </p>
          <a
            href="#/signup?role=vendor"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-colors duration-300"
            aria-label="Become a Vendor"
          >
            Become a Vendor
          </a>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Earn Up to 10% Commission</h3>
          <p className="text-gray-600">
            Monetize your professional network. Submit a qualified lead for any IT or software requirement you come across. If your lead results in a successful deal on our platform, you earn a commission.
          </p>
          <button
            onClick={() => navigate('/post-requirement')}
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-3 px-8 rounded-full shadow-md transition-colors duration-300"
            aria-label="Submit a Lead"
          >
            Submit a Lead
          </button>
        </div>
      </section>

      {/* Support 24/7 */}
      <section className="my-12 bg-white rounded-lg shadow-md p-8 text-center flex flex-col items-center">
        <img
          src="https://picsum.photos/100/100?random=9" // Placeholder for support agent image
          alt="Support Agent"
          className="w-24 h-24 rounded-full object-cover mb-4 shadow-inner"
        />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Support 24/7</h3>
        <p className="text-gray-600 mb-4">Wanna talk? Send us a message</p>
        <a
          href="mailto:support@bantconfirm.com"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-colors duration-300"
          aria-label="Email support at support@bantconfirm.com"
        >
          support@bantconfirm.com
        </a>
      </section>

      {/* Trusted Vendors (Placeholder for images) */}
      <section className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Trusted Vendors</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {/* Replace with actual vendor logos */}
          <div className="w-32 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">Logo 1</div>
          <div className="w-32 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">Logo 2</div>
          <div className="w-32 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">Logo 3</div>
          <div className="w-32 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">Logo 4</div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
