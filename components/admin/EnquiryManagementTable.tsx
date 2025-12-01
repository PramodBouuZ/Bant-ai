
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { Enquiry, UserProfile, UserRole } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import Modal from '../Modal';

const EnquiryManagementTable: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [vendors, setVendors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  // Fetch Enquiries and Vendors on Load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Enquiries with User Details
      const { data: enquiryData, error: enquiryError } = await supabase
        .from('enquiries')
        .select(`
          *,
          users:user_id (
            username,
            email,
            mobile,
            company_name,
            location
          )
        `)
        .order('created_at', { ascending: false });

      if (enquiryError) throw enquiryError;

      // Map snake_case DB to camelCase Types
      const mappedEnquiries: Enquiry[] = (enquiryData || []).map((e: any) => ({
        id: e.id,
        userId: e.user_id,
        category: e.category,
        budget: e.budget,
        authority: e.authority,
        need: e.need,
        timeframe: e.timeframe,
        fullEnquiryText: e.full_enquiry_text,
        status: e.status,
        assignedVendorId: e.assigned_vendor_id,
        createdAt: new Date(e.created_at),
        user: e.users // Attached from join
      }));

      setEnquiries(mappedEnquiries);

      // 2. Fetch Active Vendors
      const { data: vendorData, error: vendorError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'vendor')
        .eq('status', 'active');

      if (vendorError) throw vendorError;

      // Map vendors
      const mappedVendors: UserProfile[] = (vendorData || []).map((v: any) => ({
        id: v.id,
        email: v.email,
        username: v.username,
        role: UserRole.VENDOR,
        status: v.status,
        companyName: v.company_name
      }));

      setVendors(mappedVendors);

    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Failed to load enquiries. Please ensure the database tables exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignModal = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setSelectedVendorId(enquiry.assignedVendorId || '');
  };

  const handleAssignVendor = async () => {
    if (!selectedEnquiry || !selectedVendorId) return;
    
    setAssigning(true);
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ 
          assigned_vendor_id: selectedVendorId,
          status: 'assigned'
        })
        .eq('id', selectedEnquiry.id);

      if (error) throw error;

      // Update local state
      setEnquiries(prev => prev.map(e => 
        e.id === selectedEnquiry.id 
          ? { ...e, assignedVendorId: selectedVendorId, status: 'assigned' } 
          : e
      ));
      
      setSelectedEnquiry(null); // Close modal
    } catch (err: any) {
      console.error('Failed to assign vendor:', err);
      alert('Failed to assign vendor. Make sure "assigned_vendor_id" column exists in enquiries table.');
    } finally {
      setAssigning(false);
    }
  };

  const downloadCSV = () => {
    if (enquiries.length === 0) return;

    const headers = ["EnquiryID", "Date", "UserName", "UserEmail", "Mobile", "Company", "Category", "Need", "Budget", "Authority", "Timeframe", "Status"];
    const rows = enquiries.map(e => [
        e.id,
        e.createdAt.toLocaleDateString(),
        e.user?.username || '',
        e.user?.email || '',
        e.user?.mobile || '',
        e.user?.company_name || '',
        e.category,
        `"${e.need.replace(/"/g, '""')}"`, // Escape quotes
        e.budget,
        e.authority,
        e.timeframe,
        e.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "enquiries_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
  if (error) return <div className="text-red-600 p-4 bg-red-50 rounded border border-red-200">{error}</div>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center"
        >
          <span className="mr-2">⬇️</span> Download Enquiries CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User / Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {enquiries.length === 0 ? (
                        <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No enquiries found.</td>
                        </tr>
                    ) : (
                        enquiries.map((enquiry) => (
                        <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {enquiry.createdAt.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{enquiry.user?.username || 'Unknown User'}</div>
                            <div className="text-sm text-gray-500">{enquiry.user?.email}</div>
                            {enquiry.user?.company_name && <div className="text-xs text-gray-400 font-semibold">{enquiry.user?.company_name}</div>}
                            </td>
                            <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 font-medium">{enquiry.category}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{enquiry.need}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${enquiry.status === 'assigned' ? 'bg-green-100 text-green-800' : 
                                enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                                {enquiry.status.toUpperCase()}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                                onClick={() => handleOpenAssignModal(enquiry)}
                                className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md border border-blue-200"
                            >
                                {enquiry.status === 'assigned' ? 'Manage' : 'View & Assign'}
                            </button>
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <Modal 
        isOpen={!!selectedEnquiry} 
        onClose={() => setSelectedEnquiry(null)} 
        title="Enquiry Details & Assignment"
      >
        {selectedEnquiry && (
          <div className="p-2 space-y-6">
            
            {/* User Info Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">User Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{selectedEnquiry.user?.username}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{selectedEnquiry.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Mobile</p>
                  <p className="font-medium text-gray-900">{selectedEnquiry.user?.mobile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{selectedEnquiry.user?.location || 'N/A'}</p>
                </div>
                {selectedEnquiry.user?.company_name && (
                    <div className="col-span-2">
                        <p className="text-xs text-gray-500">Company</p>
                        <p className="font-medium text-gray-900">{selectedEnquiry.user?.company_name}</p>
                    </div>
                )}
              </div>
            </div>

            {/* BANT Parameters Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-sm font-bold text-blue-600 uppercase mb-3">BANT AI Qualification</h4>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-blue-100 pb-2">
                  <span className="font-semibold text-gray-700 w-1/3">Budget:</span>
                  <span className="text-gray-900 w-2/3">{selectedEnquiry.budget}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-blue-100 pb-2">
                  <span className="font-semibold text-gray-700 w-1/3">Authority:</span>
                  <span className="text-gray-900 w-2/3">{selectedEnquiry.authority}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-blue-100 pb-2">
                  <span className="font-semibold text-gray-700 w-1/3">Need:</span>
                  <span className="text-gray-900 w-2/3">{selectedEnquiry.need}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-gray-700 w-1/3">Timeframe:</span>
                  <span className="text-gray-900 w-2/3">{selectedEnquiry.timeframe}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200">
                <p className="text-xs text-gray-500 mb-1">Full Enquiry Text:</p>
                <p className="text-sm italic text-gray-700 bg-white p-2 rounded">{selectedEnquiry.fullEnquiryText}</p>
              </div>
            </div>

            {/* Vendor Assignment Section */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Assign Vendor</h4>
              <div className="flex flex-col space-y-3">
                <label className="text-sm font-medium text-gray-700">Select a Verified Vendor</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                >
                  <option value="">-- Choose Vendor --</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.companyName || vendor.username} ({vendor.email})
                    </option>
                  ))}
                </select>
                
                {vendors.length === 0 && (
                  <p className="text-red-500 text-xs">No active vendors found in the system.</p>
                )}

                <button
                  onClick={handleAssignVendor}
                  disabled={assigning || !selectedVendorId}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex justify-center"
                >
                  {assigning ? <LoadingSpinner size="sm" color="text-white" /> : 'Confirm Assignment'}
                </button>
              </div>
            </div>

          </div>
        )}
      </Modal>
    </>
  );
};

export default EnquiryManagementTable;
