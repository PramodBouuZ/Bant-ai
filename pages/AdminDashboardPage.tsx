import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <p className="text-lg text-gray-700">Welcome to the Admin Dashboard! Here you can manage users, vendors, enquiries, and content.</p>
      {/* TODO: Add detailed admin functionalities */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Manage Users</h2>
          <p className="text-gray-600">View, approve, or suspend user accounts.</p>
          <a href="#" className="text-blue-600 hover:underline mt-2 inline-block">Go to User Management</a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Manage Vendors</h2>
          <p className="text-gray-600">Approve new vendors and manage existing vendor profiles.</p>
          <a href="#" className="text-blue-600 hover:underline mt-2 inline-block">Go to Vendor Management</a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Approve Enquiries</h2>
          <p className="text-gray-600">Review and approve user enquiries for vendor matching.</p>
          <a href="#" className="text-blue-600 hover:underline mt-2 inline-block">Go to Enquiry Approval</a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">View Analytics</h2>
          <p className="text-gray-600">Access reports and analytics on platform activity.</p>
          <a href="#" className="text-blue-600 hover:underline mt-2 inline-block">View Reports</a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;