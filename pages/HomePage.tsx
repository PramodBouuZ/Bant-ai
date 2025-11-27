
import React, { useState, useEffect } from 'react';
import {
  MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_RECOMMENDATIONS
} from '../constants';
import { ProductCategory, Product } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Tooltip from '../components/Tooltip';
import Modal from '../components/Modal';
import ProductQuickView from '../components/ProductQuickView';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userProfile } = useAuth(); // Used for dashboard logic
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Search & Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ min: 0, max: 10000 });
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile toggle

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dashboard Stats (Mock)
  const userAnalytics = {
    totalEnquiries: 12,
    vendorsAssigned: 5,
    pendingQuotations: 3
  };

  // Derived filter options
  const allTags = Array.from(new Set(MOCK_PRODUCTS.flatMap(p => p.tags || [])));

  useEffect(() => {
    // Check for success param from PostRequirementPage
    if (location.search.includes('success=true')) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [location]);

  // --- Filtering Logic ---
  useEffect(() => {
    let result = MOCK_PRODUCTS;

    // 1. Text Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.description?.toLowerCase().includes(lowerTerm) ||
        p.category.toLowerCase().includes(lowerTerm)
      );
    }

    // 2. Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // 3. Price Filter (Naive string parsing for demo purposes)
    // Extracts the first number found in string. e.g., "₹7000/mo" -> 7000
    result = result.filter(p => {
      const priceString = p.pricing.replace(/,/g, ''); // Remove commas
      const match = priceString.match(/(\d+)/);
      if (match) {
        const price = parseInt(match[0], 10);
        return price >= priceRange.min && price <= priceRange.max;
      }
      return true; // Keep if price can't be parsed (like "Custom")
    });

    // 4. Rating Filter
    if (minRating > 0) {
      result = result.filter(p => (p.rating || 0) >= minRating);
    }

    // 5. Tags Filter
    if (selectedTags.length > 0) {
      result = result.filter(p => p.tags && p.tags.some(tag => selectedTags.includes(tag)));
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategories, priceRange, minRating, selectedTags]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic handled in useEffect
    document.getElementById('marketplace-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start">
           <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
           {product.rating && (
             <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded text-sm">
               <span className="text-yellow-500 mr-1">★</span>
               <span className="font-bold text-gray-700">{product.rating}</span>
             </div>
           )}
        </div>
        <div className="mb-3">
          {product.tags?.map(tag => (
            <span key={tag} className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded mr-2 mb-1">{tag}</span>
          ))}
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <p className="text-xs text-gray-500 mb-3">{product.shortFeatures[0]}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900">{product.pricing}</span>
          </div>
          <Tooltip text="View full product details and vendor info" position="top">
            <button 
              onClick={() => setSelectedProduct(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
            >
              Details
            </button>
          </Tooltip>
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

      {/* User Dashboard Analytics Section */}
      {isAuthenticated && (
        <section className="mb-12 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h2 className="text-2xl font-bold text-gray-800">Welcome back, {userProfile?.username || 'User'}!</h2>
               <p className="text-gray-600">Here's what's happening with your account.</p>
            </div>
            <Tooltip text="View your complete enquiry history" position="left">
              <button 
                onClick={() => {}} 
                className="text-blue-600 font-medium hover:underline text-sm"
              >
                View History
              </button>
            </Tooltip>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Enquiries</p>
                   <h3 className="text-3xl font-bold text-gray-800 mt-1">{userAnalytics.totalEnquiries}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  📄
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Vendors Assigned</p>
                   <h3 className="text-3xl font-bold text-gray-800 mt-1">{userAnalytics.vendorsAssigned}</h3>
                </div>
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                  🤝
                </div>
              </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pending Quotes</p>
                   <h3 className="text-3xl font-bold text-gray-800 mt-1">{userAnalytics.pendingQuotations}</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  💬
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AI Recommendations Section */}
      {isAuthenticated && MOCK_RECOMMENDATIONS && MOCK_RECOMMENDATIONS.length > 0 && (
         <section className="mb-12 animate-fade-in delay-100">
           <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
             <span className="mr-2">✨</span> Recommended for You
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {MOCK_RECOMMENDATIONS.map(rec => (
               <div key={rec.id} className="relative">
                 {/* Badge for AI Reason */}
                 <div className="absolute -top-3 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-md z-10">
                   {rec.reason}
                 </div>
                 {renderProductCard(rec.product)}
               </div>
             ))}
           </div>
         </section>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-8 md:p-16 mb-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
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
            <Tooltip text="Search the marketplace for vendors and products" position="bottom">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full hover:bg-yellow-300 transition-colors duration-300 shadow-lg"
                aria-label="Search"
              >
                Search
              </button>
            </Tooltip>
          </form>
          
          <div className="mt-8 flex justify-center gap-4">
             <Tooltip text="Use AI to automatically qualify your needs using BANT parameters" position="bottom">
               <button 
                 onClick={() => navigate('/post-requirement')}
                 className="bg-white text-blue-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1"
               >
                 ✨ Post Requirement with AI
               </button>
             </Tooltip>
          </div>
        </div>
      </section>

      {/* Popular Categories (Quick Access) */}
      <section className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {MOCK_CATEGORIES.map((category) => (
            <Tooltip key={category.name} text={`Filter by ${category.name}`} position="top">
              <div
                onClick={() => {
                  setSelectedCategories([category.name]);
                  document.getElementById('marketplace-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200"
                role="button"
                tabIndex={0}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="text-xs font-semibold text-gray-700">{category.name}</h3>
              </div>
            </Tooltip>
          ))}
        </div>
      </section>

      {/* Main Marketplace Section with Sidebar */}
      <section id="marketplace-section" className="my-12 scroll-mt-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <button 
            className="md:hidden bg-blue-600 text-white py-2 px-4 rounded mb-4 flex justify-between items-center"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span>Filters</span>
            <span>{isFilterOpen ? '▲' : '▼'}</span>
          </button>

          {/* Sidebar Filters */}
          <aside className={`w-full md:w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-gray-800">Filters</h3>
               <Tooltip text="Clear all active filters" position="right">
                 <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategories([]);
                    setPriceRange({ min: 0, max: 10000 });
                    setMinRating(0);
                    setSelectedTags([]);
                  }}
                  className="text-xs text-blue-600 hover:underline"
                 >
                   Reset All
                 </button>
               </Tooltip>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-semibold text-gray-700">Price Range (₹)</h4>
                <Tooltip text="Filter products within your monthly budget" position="right">
                  <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Min"
                  aria-label="Minimum Price"
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Max"
                  aria-label="Maximum Price"
                />
              </div>
            </div>

            {/* Categories Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {MOCK_CATEGORIES.map(cat => (
                  <label key={cat.name} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Vendor Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(star => (
                  <label key={star} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="rating"
                      checked={minRating === star}
                      onChange={() => setMinRating(star)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 flex items-center">
                      <span className="text-yellow-400 mr-1">{'★'.repeat(star)}</span>
                      <span className="text-gray-400">{'★'.repeat(5-star)}</span>
                      <span className="ml-1">& Up</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Tags & Features</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Tooltip key={tag} text={`Show products tagged with "${tag}"`} position="top">
                    <button
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        selectedTags.includes(tag) 
                          ? 'bg-blue-100 border-blue-200 text-blue-700' 
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {tag}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {searchTerm ? `Results for "${searchTerm}"` : 'Marketplace'}
                </h2>
                <span className="text-gray-500 text-sm">
                  Showing {filteredProducts.length} results
                </span>
             </div>

             {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(renderProductCard)}
                </div>
             ) : (
               <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                 <div className="text-4xl mb-4">🔍</div>
                 <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
                 <p className="text-gray-500">Try adjusting your filters or search term.</p>
                 <button 
                   onClick={() => {
                     setSearchTerm('');
                     setSelectedCategories([]);
                     setPriceRange({ min: 0, max: 10000 });
                     setMinRating(0);
                     setSelectedTags([]);
                   }}
                   className="mt-4 text-blue-600 font-medium hover:underline"
                 >
                   Clear all filters
                 </button>
               </div>
             )}
          </div>
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

      {/* Render Modal if a product is selected */}
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title="Product Details">
        {selectedProduct && <ProductQuickView product={selectedProduct} />}
      </Modal>
    </div>
  );
};

export default HomePage;
