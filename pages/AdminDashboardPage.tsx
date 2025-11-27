
import React, { useState } from 'react';
import UserManagementTable from '../components/admin/UserManagementTable';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'enquiries' | 'reports'>('overview');

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
          User Management
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'enquiries' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Enquiries (Pending)
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Analytics & Reports
        </button>
      </div>

      {/* Content Area */}
      <div className="animate-fade-in">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab('users')}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-100 p-2 rounded-full mr-3 text-blue-600">👥</span>
                Manage Users
              </h2>
              <p className="text-gray-600">View user list, approve vendors, and suspend accounts.</p>
            </div>
            
            <div 
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab('enquiries')}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-yellow-100 p-2 rounded-full mr-3 text-yellow-600">📝</span>
                Approve Enquiries
              </h2>
              <p className="text-gray-600">Review and approve new AI-qualified enquiries.</p>
            </div>

            <div 
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab('reports')}
            >
               <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-green-100 p-2 rounded-full mr-3 text-green-600">📊</span>
                View Analytics
              </h2>
              <p className="text-gray-600">Access system-wide reports and metrics.</p>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                + Add User Manually
              </button>
            </div>
            <UserManagementTable />
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab === 'enquiries' && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center border-dashed border-2 border-gray-300">
            <p className="text-gray-500 text-lg">Enquiry Approval Module Coming Soon...</p>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center border-dashed border-2 border-gray-300">
            <p className="text-gray-500 text-lg">Analytics Dashboard Module Coming Soon...</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboardPage;
