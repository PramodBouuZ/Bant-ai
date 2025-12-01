
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { TrustedVendor } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import Modal from '../Modal';

const VendorLogosTable: React.FC = () => {
  const [vendors, setVendors] = useState<TrustedVendor[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorLogo, setNewVendorLogo] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trusted_vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setVendors(data.map((v: any) => ({
            id: v.id,
            name: v.name,
            logoUrl: v.logo_url
        })));
      }
    } catch (err: any) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const convertBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert("File size too large. Max 500KB.");
        return;
      }
      const base64 = await convertBase64(file);
      setNewVendorLogo(base64);
    }
  };

  const handleSave = async () => {
    if (!newVendorName || !newVendorLogo) {
        alert("Name and Logo are required");
        return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('trusted_vendors')
        .insert([{ name: newVendorName, logo_url: newVendorLogo }]);
      
      if (error) throw error;
      
      setNewVendorName('');
      setNewVendorLogo('');
      setIsModalOpen(false);
      fetchVendors();
    } catch (err: any) {
      alert("Failed to save vendor: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this vendor?")) return;
    try {
        const { error } = await supabase.from('trusted_vendors').delete().eq('id', id);
        if (error) throw error;
        setVendors(prev => prev.filter(v => v.id !== id));
    } catch (err) {
        alert("Failed to delete vendor");
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Trusted Vendors Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          + Add Vendor Logo
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-white p-4 rounded shadow border border-gray-100 flex flex-col items-center relative group">
             <img src={vendor.logoUrl} alt={vendor.name} className="h-12 object-contain mb-2 grayscale group-hover:grayscale-0 transition-all" />
             <p className="text-sm font-semibold text-gray-700">{vendor.name}</p>
             <button 
                onClick={() => handleDelete(vendor.id)}
                className="absolute top-1 right-1 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          </div>
        ))}
        {vendors.length === 0 && <p className="text-gray-500 col-span-full text-center py-8">No trusted vendors added yet.</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Trusted Vendor">
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
            <input 
              type="text" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={newVendorName}
              onChange={e => setNewVendorName(e.target.value)}
              placeholder="e.g. Microsoft"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo Image</label>
            <input 
              type="file" 
              accept="image/*"
              className="mt-1 block w-full"
              onChange={handleFileChange}
            />
            {newVendorLogo && <img src={newVendorLogo} alt="Preview" className="h-10 mt-2 border p-1" />}
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add Vendor'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default VendorLogosTable;
