
import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import LoadingSpinner from '../LoadingSpinner';

const SettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    logoUrl: '',
    faviconUrl: '',
    appName: '',
    showAppName: true,
    socialFacebook: '',
    socialTwitter: '',
    socialLinkedin: '',
    whatsappApiKey: '',
    whatsappPhoneNumberId: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Sync state with settings when they load
  useEffect(() => {
    setFormData({
        logoUrl: settings.logoUrl,
        faviconUrl: settings.faviconUrl,
        appName: settings.appName,
        showAppName: settings.showAppName,
        socialFacebook: settings.socialFacebook || '',
        socialTwitter: settings.socialTwitter || '',
        socialLinkedin: settings.socialLinkedin || '',
        whatsappApiKey: settings.whatsappApiKey || '',
        whatsappPhoneNumberId: settings.whatsappPhoneNumberId || ''
    });
  }, [settings]);

  const convertBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = (error) => reject(error);
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
      setMessage("❌ Failed to update settings. Check console/database.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Global Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Branding Section */}
        <section className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">Branding & Appearance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={formData.appName}
                        onChange={(e) => setFormData({...formData, appName: e.target.value})}
                    />
                </div>
                <div className="flex items-center pt-6">
                    <input 
                        type="checkbox" 
                        id="showAppName"
                        checked={formData.showAppName}
                        onChange={(e) => setFormData({...formData, showAppName: e.target.checked})}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="showAppName" className="ml-2 text-sm text-gray-700">Show App Name next to Logo</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                    <div className="flex items-center space-x-4">
                        {formData.logoUrl && <img src={formData.logoUrl} alt="Logo" className="h-10 border p-1 rounded" />}
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logoUrl')} className="text-sm text-slate-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
                    <div className="flex items-center space-x-4">
                        {formData.faviconUrl && <img src={formData.faviconUrl} alt="Favicon" className="h-8 w-8 border p-1 rounded" />}
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'faviconUrl')} className="text-sm text-slate-500" />
                    </div>
                </div>
            </div>
        </section>

        {/* Social Media Section */}
        <section className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">Social Media Links</h3>
            <p className="text-xs text-gray-500">Leave empty to hide the icon in the footer.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                    <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="https://facebook.com/..."
                        value={formData.socialFacebook}
                        onChange={(e) => setFormData({...formData, socialFacebook: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter (X) URL</label>
                    <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="https://twitter.com/..."
                        value={formData.socialTwitter}
                        onChange={(e) => setFormData({...formData, socialTwitter: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="https://linkedin.com/..."
                        value={formData.socialLinkedin}
                        onChange={(e) => setFormData({...formData, socialLinkedin: e.target.value})}
                    />
                </div>
            </div>
        </section>

        {/* WhatsApp Config Section */}
        <section className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600 border-b pb-2">WhatsApp Business API</h3>
            <p className="text-xs text-gray-500">Configure this to enable automated notifications for admins, vendors, and users.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="e.g. 102345678901234"
                        value={formData.whatsappPhoneNumberId}
                        onChange={(e) => setFormData({...formData, whatsappPhoneNumberId: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Access Token (API Key)</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="EAAG..."
                        value={formData.whatsappApiKey}
                        onChange={(e) => setFormData({...formData, whatsappApiKey: e.target.value})}
                    />
                </div>
            </div>
        </section>

        {message && (
            <div className={`p-3 rounded text-sm ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
            </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md disabled:opacity-50 transition-colors w-full md:w-auto"
        >
          {loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
};

export default SettingsPanel;
