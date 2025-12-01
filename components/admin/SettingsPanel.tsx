
import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import LoadingSpinner from '../LoadingSpinner';

const SettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    appName: settings.appName,
    showAppName: settings.showAppName
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const convertBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'faviconUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert("File size too large. Please upload an image under 500KB.");
        return;
      }
      try {
        const base64 = await convertBase64(file);
        setFormData(prev => ({ ...prev, [field]: base64 }));
      } catch (err) {
        alert("Error reading file.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const success = await updateSettings(formData);
    
    if (success) {
      setMessage("✅ Settings updated successfully!");
    } else {
      setMessage("❌ Failed to update settings. Make sure 'site_settings' table exists.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Website Branding & Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            value={formData.appName}
            onChange={(e) => setFormData({...formData, appName: e.target.value})}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="showAppName"
            checked={formData.showAppName}
            onChange={(e) => setFormData({...formData, showAppName: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="showAppName" className="text-sm text-gray-700">Show App Name next to Logo</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          <div className="flex flex-col space-y-2">
             <div className="flex items-center space-x-4">
               {formData.logoUrl && (
                  <img src={formData.logoUrl} alt="Preview" className="h-12 w-auto border border-gray-200 p-1 rounded" />
               )}
               <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'logoUrl')}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
             </div>
             <p className="text-xs text-gray-500">Upload Logo Image (Max 500KB)</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
           <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4">
               {formData.faviconUrl && (
                  <img src={formData.faviconUrl} alt="Favicon" className="h-8 w-8 border border-gray-200 p-1 rounded" />
               )}
               <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'faviconUrl')}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <p className="text-xs text-gray-500">Upload Favicon (32x32px recommended, Max 500KB)</p>
           </div>
        </div>

        {message && (
            <div className={`p-3 rounded text-sm ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
            </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50 transition-colors"
        >
          {loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default SettingsPanel;
