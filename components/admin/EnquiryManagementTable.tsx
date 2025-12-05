import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { Enquiry } from "../../types";
import LoadingSpinner from "../LoadingSpinner";
import Modal from "../Modal";

const EnquiryManagementTable: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((e: any) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone,
        message: e.message,
        category: e.category,
        budget: e.budget,
        authority: e.authority,
        need: e.need,
        timeframe: e.timeframe,
        fullEnquiryText: e.full_enquiry_text || e.message,
        status: e.status,
        createdAt: new Date(e.created_at),
      }));

      setEnquiries(mapped);

    } catch (err) {
      console.error("Error loading enquiries:", err);
      setError("Failed to load enquiries. Please check database.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (enquiries.length === 0) return;

    const headers = ["ID", "Date", "Name", "Email", "Phone", "Category", "Need", "Budget", "Authority", "Timeframe", "Status"];
    
    const rows = enquiries.map(e => [
      e.id,
      e.createdAt.toLocaleDateString(),
      e.name,
      e.email,
      e.phone,
      e.category,
      `"${(e.need || "").replace(/"/g, '""')}"`,
      e.budget,
      e.authority,
      e.timeframe,
      e.status
    ]);

    const csv = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", "enquiries.csv");
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
          ⬇️ Download CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User / Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requirement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No enquiries found.</td>
              </tr>
            ) : (
              enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {e.createdAt.toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-800">{e.name}</div>
                    <div className="text-sm text-gray-500">{e.email}</div>
                    <div className="text-xs text-gray-400">{e.phone}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{e.category}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{e.need}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      e.status === 'assigned' ? 'bg-green-100 text-green-800' :
                      e.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {e.status?.toUpperCase() || "PENDING"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedEnquiry(e)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded border border-blue-200"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        title="Enquiry Details"
      >
        {selectedEnquiry && (
          <div className="p-3 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">User Information</h3>

            <p><strong>Name:</strong> {selectedEnquiry.name}</p>
            <p><strong>Email:</strong> {selectedEnquiry.email}</p>
            <p><strong>Phone:</strong> {selectedEnquiry.phone}</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Requirement</h3>

            <p><strong>Category:</strong> {selectedEnquiry.category}</p>
            <p><strong>Need:</strong> {selectedEnquiry.need}</p>
            <p><strong>Budget:</strong> {selectedEnquiry.budget}</p>
            <p><strong>Authority:</strong> {selectedEnquiry.authority}</p>
            <p><strong>Timeframe:</strong> {selectedEnquiry.timeframe}</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Full Message</h3>
            <p className="bg-gray-100 p-2 rounded text-gray-700">{selectedEnquiry.fullEnquiryText}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default EnquiryManagementTable;
