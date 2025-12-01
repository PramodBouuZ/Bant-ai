import React, { useState, useEffect } from 'react';
import {
  MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_RECOMMENDATIONS
} from '../constants';
import { ProductCategory, Product, Category, TrustedVendor } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import Tooltip from '../components/Tooltip';
import Modal from '../components/Modal';
import ProductQuickView from '../components/ProductQuickView';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userProfile } = useAuth(); 
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Hero Slider State ---
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- Search & Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  
  // Category & Vendor State
  const [categories, setCategories] = useState<Category[]>([]);
  const [trustedVendors, setTrustedVendors] = useState<TrustedVendor[]>([]);
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ min: 0, max: 10000 });
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Stats (Mock)
  const userAnalytics = {
    totalEnquiries: 12,
    vendorsAssigned: 5,
    pendingQuotations: 3
  };

  const allTags: string[] = Array.from(new Set(allProducts.flatMap(p => p.tags || [])));

  const HERO_SLIDES = [
    {
      id: 1,
      title: <>The Premier Marketplace for AI-Qualified <span className="text-yellow-300">Telco Needs</span></>,
      subtitle: "Connect with top-tier vendors, find the perfect IT solutions, or earn up to 10% commission by sharing qualified leads.",
      bgClass: "from-blue-600 to-blue-800",
      imgUrl: "https://picsum.photos/1200/800?blur=5&random=1"
    },
    {
      id: 2,
      title: <>Secure Your Business with <span className="text-yellow-300">Cybersecurity</span> & Cloud</>,
      subtitle: "Compare top-rated enterprise security packages and cloud storage solutions tailored for your scale.",
      bgClass: "from-indigo-600 to-purple-800",
      imgUrl: "https://picsum.photos/1200/800?blur=5&random=2"
    },
    {
      id: 3,
      title: <>Monetize Your Network: <span className="text-yellow-300">Submit Leads</span></>,
      subtitle: "Join our partner program. Submit qualified IT requirements and earn significant commissions upon closure.",
      bgClass: "from-emerald-600 to-teal-800",
      imgUrl: "https://picsum.photos/1200/800?blur=5&random=3"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [HERO_SLIDES.length]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingProducts(true);
      try {
        // Products
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productData && productData.length > 0) {
          const dbProducts: Product[] = productData.map((p: any) => ({
            id: p.id,
            name: p.name,
            image: p.image || 'https://picsum.photos/400/250',
            shortFeatures: p.short_features || [],
            pricing: p.pricing,
            category: p.category,
            description: p.description,
            rating: p.rating,
            tags: p.tags || [],
            originalPrice: p.original_price
          }));
          setAllProducts(dbProducts);
        } else {
          setAllProducts(MOCK_PRODUCTS);
        }

        // Categories
        const { data: catData } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });
        
        if (catData && catData.length > 0) {
            setCategories(catData);
        } else {
            const mockCats: Category[] = MOCK_CATEGORIES.map((mc, idx) => ({
                id: `mock-cat-${idx}`,
                name: mc.name,
                icon: mc.icon
            }));
            setCategories(mockCats);
        }

        // Trusted Vendors
        const { data: vendorData } = await supabase
            .from('trusted_vendors')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (vendorData) {
            setTrustedVendors(vendorData.map((v:any) => ({ id: v.id, name: v.name, logoUrl: v.logo_url })));
        }

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setAllProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (location.search.includes('success=true')) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [location]);

  useEffect(() => {
    let result = allProducts;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.description?.toLowerCase().includes(lowerTerm) ||
        p.category.toLowerCase().includes(lowerTerm)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category as string));
    }

    result = result.filter(p => {
      if (!p.pricing) return true;
      const priceString = p.pricing.replace(/,/g, '');
      const match = priceString.match(/(\d+)/);
      if (match) {
        const price = parseInt(match[0], 10);
        return price >= priceRange.min && price <= priceRange.max;
      }
      return true;
    });

    if (minRating > 0) {
      result = result.filter(p => (p.rating || 0) >= minRating);
    }

    if (selectedTags.length > 0) {
      result = result.filter(p => p.tags && p.tags.some(tag => selectedTags.includes(tag)));
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategories, priceRange, minRating, selectedTags, allProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
           {product.rating !== undefined && (
             <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded text-sm">
               <span className="text-yellow-500 mr-1">★</span>
               <span className="font-bold text-gray-700">{product.rating}</span>
             </div>
           )}
        </div>
        <div className="mb-3">
          {product.tags?.slice(0, 3).map(tag => (
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

      {isAuthenticated && (
        <section className="mb-12 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h2 className="text-2xl font-bold text-gray-800">Welcome back, {userProfile?.username || 'User'}!</h2>
               <p className="text-gray-600">Here's what's happening with your account.</p>
            </div>
            <Tooltip text="View your complete enquiry history" position="left">
              <button onClick={() => {}} className="text-blue-600 font-medium hover:underline text-sm">View History</button>
            </Tooltip>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Enquiries</p>
                   <h3 className="text-3xl font-bold text-gray-800 mt-1">{userAnalytics.totalEnquiries}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">📄</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Vendors Assigned</p>
                   <h3 className="text-3xl font-bold text-gray-800 mt-1">{userAnalytics.vendorsAssigned}</h3>
                </div>
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">🤝</div>
              </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pending Quotes</p>
                   <h3 className="text-3xl font-bold text-gray-800 mt-1">{userAnalytics.pendingQuotations}</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full text-green-600">💬</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {isAuthenticated && MOCK_RECOMMENDATIONS && MOCK_RECOMMENDATIONS.length > 0 && (
         <section className="mb-12 animate-fade-in delay-100">
           <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><span className="mr-2">✨</span> Recommended for You</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {MOCK_RECOMMENDATIONS.map(rec => (
               <div key={rec.id} className="relative">
                 <div className="absolute -top-3 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-md z-10">{rec.reason}</div>
                 {renderProductCard(rec.product)}
               </div>
             ))}
           </div>
         </section>
      )}

      <section className="relative rounded-xl shadow-lg mb-12 overflow-hidden min-h-[600px] flex flex-col justify-center bg-gray-900 text-white">
        {HERO_SLIDES.map((slide, index) => (
          <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
             <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgClass} opacity-90`} />
             <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${slide.imgUrl})` }} />
          </div>
        ))}
        <div className="relative z-20 w-full max-w-4xl mx-auto text-center p-8">
            <div className="relative h-60 md:h-72 mb-8 overflow-hidden flex items-center justify-center">
               {HERO_SLIDES.map((slide, index) => (
                   <div key={slide.id} className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out transform flex flex-col justify-center items-center px-4 ${index === currentSlide ? 'translate-x-0 opacity-100' : index < currentSlide ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'}`}>
                        <h1 className="text-3xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">{slide.title}</h1>
                        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto drop-shadow-md">{slide.subtitle}</p>
                   </div>
               ))}
            </div>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in delay-200 relative z-30">
              <input type="text" placeholder="Search for services, solutions..." className="w-full sm:w-2/3 md:w-1/2 px-6 py-3 rounded-full border-2 border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:border-white focus:ring-2 focus:ring-white transition-all duration-300 backdrop-blur-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Tooltip text="Search the marketplace for vendors and products" position="bottom">
                <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full hover:bg-yellow-300 transition-colors duration-300 shadow-lg">Search</button>
              </Tooltip>
            </form>
            <div className="mt-8 flex justify-center gap-4 relative z-30">
              <Tooltip text="Use AI to automatically qualify your needs using BANT parameters" position="bottom">
                <button onClick={() => navigate('/post-requirement')} className="bg-white text-blue-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1">✨ Post Requirement with AI</button>
              </Tooltip>
            </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2">
            {HERO_SLIDES.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`} />
            ))}
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore by Category</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {categories.map((category) => (
            <Tooltip key={category.id} text={`Filter by ${category.name}`} position="top">
              <div onClick={() => { setSelectedCategories([category.name]); document.getElementById('marketplace-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 flex-shrink-0 w-40">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="text-xs font-semibold text-gray-700 whitespace-normal">{category.name}</h3>
              </div>
            </Tooltip>
          ))}
        </div>
      </section>

      <section id="marketplace-section" className="my-12 scroll-mt-20">
        <div className="flex flex-col md:flex-row gap-8">
          <button className="md:hidden bg-blue-600 text-white py-2 px-4 rounded mb-4 flex justify-between items-center" onClick={() => setIsFilterOpen(!isFilterOpen)}><span>Filters</span><span>{isFilterOpen ? '▲' : '▼'}</span></button>
          <aside className={`w-full md:w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-gray-800">Filters</h3>
               <Tooltip text="Clear all active filters" position="right">
                 <button onClick={() => { setSearchTerm(''); setSelectedCategories([]); setPriceRange({ min: 0, max: 10000 }); setMinRating(0); setSelectedTags([]); }} className="text-xs text-blue-600 hover:underline">Reset All</button>
               </Tooltip>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700">Price Range (₹)</h4>
              <div className="flex items-center gap-2 mt-2">
                <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} className="w-full border rounded px-2 py-1 text-sm" placeholder="Min" />
                <span className="text-gray-400">-</span>
                <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} className="w-full border rounded px-2 py-1 text-sm" placeholder="Max" />
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={selectedCategories.includes(cat.name)} onChange={() => toggleCategory(cat.name)} className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Tooltip key={tag} text={`Show products tagged with "${tag}"`} position="top">
                    <button onClick={() => toggleTag(tag)} className={`text-xs px-3 py-1 rounded-full border transition-colors ${selectedTags.includes(tag) ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>{tag}</button>
                  </Tooltip>
                ))}
              </div>
            </div>
          </aside>
          <div className="flex-1">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{searchTerm ? `Results for "${searchTerm}"` : 'Marketplace'}</h2>
                <span className="text-gray-500 text-sm">Showing {filteredProducts.length} results</span>
             </div>
             {isLoadingProducts ? (
                 <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>
             ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(renderProductCard)}
                </div>
             ) : (
               <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                 <div className="text-4xl mb-4">🔍</div>
                 <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
                 <p className="text-gray-500">Try adjusting your filters or search term.</p>
               </div>
             )}
          </div>
        </div>
      </section>

      <section className="my-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 flex flex-col items-start">
           <h2 className="text-2xl font-bold text-gray-900 mb-4">Pay-Per-Success AI Lead Generation</h2>
           <p className="text-gray-600 mb-6 text-lg leading-relaxed">Join our marketplace and receive AI-qualified leads that are ready for engagement. You only pay a success fee when you close a deal, making it a risk-free channel for business growth.</p>
           <button onClick={() => navigate('/signup?role=vendor')} className="mt-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Become a Vendor</button>
        </div>
        <div className="bg-yellow-50 rounded-xl p-8 border border-yellow-100 flex flex-col items-start">
           <h2 className="text-2xl font-bold text-gray-900 mb-4">Earn Up to 10% Commission</h2>
           <p className="text-gray-600 mb-6 text-lg leading-relaxed">Monetize your professional network. Submit a qualified lead for any IT or software requirement you come across. If your lead results in a successful deal on our platform, you earn a commission.</p>
           <button onClick={() => navigate('/post-requirement')} className="mt-auto bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition-colors shadow-sm">Submit a Lead</button>
        </div>
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Why Choose BANTConfirm?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered Precision</h3>
            <p className="text-gray-600 text-sm">Our BANT algorithms ensure 99% accuracy in lead qualification, saving you time.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Verified Vendors</h3>
            <p className="text-gray-600 text-sm">Access a curated network of top-tier, enterprise-grade technology providers.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚡</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Turnaround</h3>
            <p className="text-gray-600 text-sm">Receive comprehensive quotations within 24 hours of posting your requirement.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔒</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Secure & Private</h3>
            <p className="text-gray-600 text-sm">Your data and requirements are encrypted and shared only with matched vendors.</p>
          </div>
        </div>
      </section>

      <section className="my-16 flex justify-center">
         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full flex flex-col md:flex-row items-center gap-8 border border-gray-100">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1534330207526-9e44f44abc27?auto=format&fit=crop&q=80&w=150&h=150" alt="Support Team" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
              <span className="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Support 24/7</h2>
              <p className="text-gray-600 mb-6 text-lg">Wanna talk? Send us a message regarding any product or service.</p>
              <a href="mailto:support@bantconfirm.com" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-md w-full md:w-auto text-center">support@bantconfirm.com</a>
            </div>
         </div>
      </section>

      <section className="my-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Trusted Vendors</h2>
        <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* If no custom vendors, show default hardcoded names as text */}
             {trustedVendors.length === 0 ? (
               <>
                <div className="text-2xl font-bold text-gray-400">Microsoft</div>
                <div className="text-2xl font-bold text-gray-400">Google Cloud</div>
                <div className="text-2xl font-bold text-gray-400">AWS</div>
                <div className="text-2xl font-bold text-gray-400">Salesforce</div>
                <div className="text-2xl font-bold text-gray-400">Zoho</div>
               </>
             ) : (
               trustedVendors.map(vendor => (
                 <div key={vendor.id} className="flex flex-col items-center group">
                    <img src={vendor.logoUrl} alt={vendor.name} className="h-12 object-contain grayscale group-hover:grayscale-0 transition-all" title={vendor.name} />
                 </div>
               ))
             )}
        </div>
      </section>

      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title="Product Details">
        {selectedProduct && <ProductQuickView product={selectedProduct} />}
      </Modal>
    </div>
  );
};

export default HomePage;