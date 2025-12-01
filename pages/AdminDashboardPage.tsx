
import React, { useState } from 'react';
import UserManagementTable from '../components/admin/UserManagementTable';
import EnquiryManagementTable from '../components/admin/EnquiryManagementTable';
import ProductManagementTable from '../components/admin/ProductManagementTable';
import SettingsPanel from '../components/admin/SettingsPanel';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'enquiries' | 'products' | 'settings'>('overview');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Manage your marketplace efficiently
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto space-x-4 border-b border-gray-200 mb-8 pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'enquiries' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Enquiries
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Content Area */}
      <div className="animate-fade-in">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab('users')}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-100 p-2 rounded-full mr-3 text-blue-600">👥</span>
                Users
              </h2>
            </div>
            
            <div 
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab('enquiries')}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-yellow-100 p-2 rounded-full mr-3 text-yellow-600">📝</span>
                Enquiries
              </h2>
            </div>

            <div 
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab('products')}
            >
               <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-purple-100 p-2 rounded-full mr-3 text-purple-600">📦</span>
                Products
              </h2>
            </div>

             <div 
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab('settings')}
            >
               <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-gray-100 p-2 rounded-full mr-3 text-gray-600">⚙️</span>
                Settings
              </h2>
            </div>
          </div>
        )}

        {/* Tab Contents */}
        {activeTab === 'users' && <UserManagementTable />}
        {activeTab === 'enquiries' && <EnquiryManagementTable />}
        {activeTab === 'products' && <ProductManagementTable />}
        {activeTab === 'settings' && <SettingsPanel />}

      </div>
    </div>
  );
};

export default AdminDashboardPage;
