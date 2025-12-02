
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { SiteSettings } from '../types';
import { APP_NAME } from '../constants';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  loading: boolean;
}

const defaultSettings: SiteSettings = {
  logoUrl: 'https://assets-global.website-files.com/62c01991206f74a0678d85f6/62cf9b152d244c062c3e1644_bant-confirm-favicon.png',
  faviconUrl: '',
  appName: APP_NAME,
  showAppName: true,
  socialFacebook: '',
  socialTwitter: '',
  socialLinkedin: '',
  whatsappApiKey: '',
  whatsappPhoneNumberId: ''
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setSettings({
          id: data.id,
          logoUrl: data.logo_url || defaultSettings.logoUrl,
          faviconUrl: data.favicon_url || '',
          appName: data.app_name || defaultSettings.appName,
          showAppName: data.show_app_name ?? true,
          socialFacebook: data.social_facebook || '',
          socialTwitter: data.social_twitter || '',
          socialLinkedin: data.social_linkedin || '',
          whatsappApiKey: data.whatsapp_api_key || '',
          whatsappPhoneNumberId: data.whatsapp_phone_number_id || ''
        });
        
        // Update document title dynamically
        document.title = data.app_name || defaultSettings.appName;
        
        // Update favicon dynamically
        if (data.favicon_url) {
            const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (link) link.href = data.favicon_url;
        }
      }
    } catch (err) {
      console.warn('Could not load site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const payload = {
          logo_url: newSettings.logoUrl,
          favicon_url: newSettings.faviconUrl,
          app_name: newSettings.appName,
          show_app_name: newSettings.showAppName,
          social_facebook: newSettings.socialFacebook,
          social_twitter: newSettings.socialTwitter,
          social_linkedin: newSettings.socialLinkedin,
          whatsapp_api_key: newSettings.whatsappApiKey,
          whatsapp_phone_number_id: newSettings.whatsappPhoneNumberId
      };

      if (settings.id) {
          const { error } = await supabase
            .from('site_settings')
            .update(payload)
            .eq('id', settings.id);
          if (error) throw error;
      } else {
          const { error } = await supabase
            .from('site_settings')
            .insert([payload]);
          if (error) throw error;
      }
      
      await fetchSettings(); // Refresh local state
      return true;
    } catch (err) {
      console.error('Failed to update settings:', err);
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
