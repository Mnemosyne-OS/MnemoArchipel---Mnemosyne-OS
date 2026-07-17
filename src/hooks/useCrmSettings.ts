import { useState, useEffect } from 'react';
import { CustomCategory, CustomWidgetDef, UserProfile, NotificationSettings } from '../types';

/**
 * Custom React hook managing CRM global settings, themes, language,
 * custom categories/widgets, and update notifications.
 */
export function useCrmSettings() {
  const [langPreference, setLangPreference] = useState<'auto' | 'en' | 'fr' | 'es'>('auto');
  const [activeLang, setActiveLang] = useState<'en' | 'fr' | 'es'>('en');

  // Avatar Style Mode ('human' | 'magical')
  const [globalAvatarStyle, setGlobalAvatarStyle] = useState<'human' | 'magical'>(() => {
    return (localStorage.getItem('crm_avatar_style') as 'human' | 'magical') || 'human';
  });

  const handleToggleAvatarStyle = () => {
    const next = globalAvatarStyle === 'human' ? 'magical' : 'human';
    setGlobalAvatarStyle(next);
    localStorage.setItem('crm_avatar_style', next);
  };

  // Dark/Light Theme System
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('crm_theme') as 'light' | 'dark') || 'dark';
  });

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('crm_theme', next);
  };

  // Self User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('archipel_user_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: 'Human',
      email: '',
      phone: '',
      address: '',
      bio: 'Sovereign operator of Mnemosyne OS.',
      avatarConfig: {
        body: 0,
        color: '#fcd34d',
        eyes: 0,
        nose: 0,
        mouth: 0,
        hat: 0
      }
    };
  });

  const handleUpdateUserProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem('archipel_user_profile', JSON.stringify(updated));
  };

  // Notifications Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('archipel_notif_settings');
    if (saved) return JSON.parse(saved);
    return {
      activeThresholdDays: 14,
      warmThresholdDays: 45,
      enableTasksAlerts: true,
      enableDatesAlerts: true
    };
  });

  const handleUpdateNotificationSettings = (updated: NotificationSettings) => {
    setNotificationSettings(updated);
    localStorage.setItem('archipel_notif_settings', JSON.stringify(updated));
  };

  // Custom Categories
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(() => {
    const saved = localStorage.getItem('crm_custom_categories');
    return saved ? JSON.parse(saved) : [];
  });

  const handleCreateCategory = (label: string, color: string) => {
    const key = label.replace(/\s+/g, '-');
    if (customCategories.some(c => c.key === key)) return;
    const updated = [...customCategories, { key, label, color }];
    setCustomCategories(updated);
    localStorage.setItem('crm_custom_categories', JSON.stringify(updated));
  };

  const handleDeleteCategory = (key: string) => {
    const updated = customCategories.filter(c => c.key !== key);
    setCustomCategories(updated);
    localStorage.setItem('crm_custom_categories', JSON.stringify(updated));
  };

  // Custom Widgets
  const [customWidgetDefs, setCustomWidgetDefs] = useState<CustomWidgetDef[]>(() => {
    const saved = localStorage.getItem('crm_custom_widget_defs');
    return saved ? JSON.parse(saved) : [];
  });

  const handleCreateCustomWidget = (def: CustomWidgetDef) => {
    const updated = [...customWidgetDefs, def];
    setCustomWidgetDefs(updated);
    localStorage.setItem('crm_custom_widget_defs', JSON.stringify(updated));
  };

  const handleDeleteCustomWidget = (id: string) => {
    const updated = customWidgetDefs.filter(w => w.id !== id);
    setCustomWidgetDefs(updated);
    localStorage.setItem('crm_custom_widget_defs', JSON.stringify(updated));
  };

  // GitHub Update Tracking State
  const [githubUpdateStatus, setGithubUpdateStatus] = useState<'up-to-date' | 'new-version' | 'checking' | 'error'>('checking');
  const [githubLatestVersion, setGithubLatestVersion] = useState<string>('');

  const checkGithubUpdates = async () => {
    setGithubUpdateStatus('checking');
    try {
      const res = await fetch('https://api.github.com/repos/yaka0007/Mnemosyne-OS/releases/latest');
      if (!res.ok) {
        throw new Error('GitHub API rate limit or private repository');
      }
      const data = await res.json();
      const latestTag = data.tag_name || '';
      const cleanLatest = latestTag.replace(/^v/, '');
      
      setGithubLatestVersion(cleanLatest);
      
      const currentVersion = "0.5.0";
      if (cleanLatest && cleanLatest !== currentVersion) {
        setGithubUpdateStatus('new-version');
      } else {
        setGithubUpdateStatus('up-to-date');
      }
    } catch (err) {
      console.warn('Failed to fetch GitHub updates:', err);
      setGithubUpdateStatus('error');
    }
  };

  useEffect(() => {
    checkGithubUpdates();
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('crm_language') as 'auto' | 'en' | 'fr' | 'es' | null;
    if (savedLang) setLangPreference(savedLang);
  }, []);

  useEffect(() => {
    if (langPreference === 'auto') {
      const osLang = navigator.language.startsWith('fr')
        ? 'fr'
        : navigator.language.startsWith('es')
        ? 'es'
        : 'en';
      setActiveLang(osLang);
    } else {
      setActiveLang(langPreference);
    }
  }, [langPreference]);

  return {
    langPreference,
    setLangPreference,
    activeLang,
    setActiveLang,
    globalAvatarStyle,
    handleToggleAvatarStyle,
    setGlobalAvatarStyle,
    theme,
    handleToggleTheme,
    userProfile,
    handleUpdateUserProfile,
    notificationSettings,
    handleUpdateNotificationSettings,
    customCategories,
    handleCreateCategory,
    handleDeleteCategory,
    customWidgetDefs,
    handleCreateCustomWidget,
    handleDeleteCustomWidget,
    githubUpdateStatus,
    githubLatestVersion,
    checkGithubUpdates
  };
}
