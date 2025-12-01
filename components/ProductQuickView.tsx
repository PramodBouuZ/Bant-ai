
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { MOCK_USERS } from '../constants';

interface ProductQuickViewProps {
  product: Product;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'vendor'>('overview');
  const navigate = useNavigate();

  const vendor = MOCK_USERS.find(u => u.id === product.vendorId);

  const handleGetQuote = () => {
    navigate('/post-requirement', { state: { productName: product.name } });
  };

  return (
    <div>
      {/* Product Header with Image */}
      <div className="relative h-48 sm:h-64 bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-2xl font-bold text-white">{product.name}</h2>
          <p className="text-blue-100">{product.category}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium focus:outline-none ${
            activeTab === 'overview' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium focus:outline-none ${
            activeTab === 'features' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('features')}
        >
          Features
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium focus:outline-none ${
            activeTab === 'vendor' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('vendor')}
        >
          Vendor Info
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                <p className="text-gray-600 mt-1">{product.description || 'No description available.'}</p>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-bold text-gray-900">{product.pricing}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-2">Rating</h3>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.round(product.rating || 0))}
                  <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating || 0))}</span>
                </div>
                <span className="ml-2 text-gray-600 text-sm">({product.rating || 0}/5)</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags?.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-4 animate-fade-in">
             <h3 className="text-lg font-semibold text-gray-800">Key Features</h3>
             <ul className="space-y-2">
               {product.shortFeatures.map((feature, index) => (
                 <li key={index} className="flex items-start">
                   <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                   <span className="text-gray-700">{feature}</span>
                 </li>
               ))}
               {/* Add placeholder features to make it look full */}
               <li className="flex items-start text-gray-500 italic">
                  <span className="ml-7">...and more details available upon request.</span>
               </li>
             </ul>
          </div>
        )}

        {activeTab === 'vendor' && (
          <div className="space-y-4 animate-fade-in">
            {vendor ? (
              <>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {vendor.username.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{vendor.username}</h3>
                    <p className="text-sm text-gray-500">Verified Vendor</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                   <p className="text-sm text-gray-600">
                     <strong>Vendor ID:</strong> {vendor.id}
                   </p>
                   <p className="text-sm text-gray-600 mt-2">
                     This vendor has been verified by BANTConfirm for quality and reliability.
                   </p>
                </div>
                <button className="w-full mt-4 bg-white border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded hover:bg-blue-50 transition-colors">
                  Contact Vendor
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Vendor information not available directly.</p>
                <p className="text-sm text-gray-400 mt-2">This product might be managed by the platform directly.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button 
          onClick={handleGetQuote}
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-md shadow transition-colors"
        >
          Get Quote
        </button>
      </div>
    </div>
  );
};

export default ProductQuickView;
