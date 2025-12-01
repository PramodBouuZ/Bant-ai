
import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import LoadingSpinner from '../LoadingSpinner';

const SettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    appName: settings.appName
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
          <div className="flex items-center space-x-4">
             <input
              type="text"
              className="flex-1 border border-gray-300 rounded-md p-2"
              value={formData.logoUrl}
              onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
            />
            {formData.logoUrl && (
                <img src={formData.logoUrl} alt="Preview" className="h-8 w-auto border border-gray-200 p-1" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">URL to your logo image (PNG/SVG recommended).</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
           <div className="flex items-center space-x-4">
            <input
                type="text"
                className="flex-1 border border-gray-300 rounded-md p-2"
                value={formData.faviconUrl}
                onChange={(e) => setFormData({...formData, faviconUrl: e.target.value})}
            />
             {formData.faviconUrl && (
                <img src={formData.faviconUrl} alt="Favicon" className="h-6 w-6 border border-gray-200 p-1" />
            )}
           </div>
           <p className="text-xs text-gray-500 mt-1">URL to your favicon (32x32px recommended).</p>
        </div>

        {message && (
            <div className={`p-3 rounded text-sm ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
            </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
        >
          {loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default SettingsPanel;
