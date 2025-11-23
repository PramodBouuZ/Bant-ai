import React from 'react';

const VendorDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Vendor Dashboard</h1>
      <p className="text-lg text-gray-700">Welcome to your Vendor Dashboard! Here you can manage your products, view leads, and communicate with users.</p>
      {/* TODO: Add detailed vendor functionalities */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">My Products</h2>
          <p className="text-gray-600">Manage your listed products and services.</p>
          <a href="#" className="text-blue-600 hover:underline mt-2 inline-block">View Products</a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">My Leads</h2>
          <p className="text-gray-600">View and respond to AI-qualified leads.</p>
          <a href="#" className="text-blue-600 hover:underline mt-2 inline-block">View Leads</a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Notifications</h2>
          <p className="text-gray-600">Check for new enquiries and system updates.</p>
          <a href="#" className="text-blue-600 hover:underline mt-2 inline-block">View Notifications</a>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardPage;