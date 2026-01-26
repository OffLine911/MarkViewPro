import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Settings } from '../types';
import { wails, type BackendSettings } from '../utils/wailsBindings';

const defaultSettings: Settings = {
  theme: 'system',
  fontSize: 16,
  fontFamily: 'Inter',
  lineHeight: 1.6,
  sidebarWidth: 280,
  showLineNumbers: true,
  autoSave: false,
  autoSaveDelay: 3000,
  wordWrap: true,
  autoReload: true,
  editorTheme: 'default',
  previewTheme: 'github',
  syncScroll: true,
  spellCheck: false,
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
  isDark: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'markview-pro-settings';

function backendToFrontend(backend: BackendSettings): Settings {
  return {
    theme: (backend.theme as 'light' | 'dark' | 'system') || 'system',
    fontSize: backend.fontSize || 16,
    fontFamily: backend.fontFamily || 'Inter',
    lineHeight: backend.lineHeight || 1.6,
    sidebarWidth: 280, // Not in backend
    showLineNumbers: backend.showLineNumbers ?? true,
    autoSave: backend.autoSave ?? false,
    autoSaveDelay: backend.autoSaveDelay || 3000,
    wordWrap: backend.wordWrap ?? true,
    autoReload: backend.autoReload ?? true,
    editorTheme: backend.editorTheme || 'default',
    previewTheme: backend.previewTheme || 'github',
    syncScroll: backend.syncScroll ?? true,
    spellCheck: backend.spellCheck ?? false,
  };
}

function frontendToBackend(frontend: Settings): BackendSettings {
  return {
    theme: frontend.theme,
    fontSize: frontend.fontSize,
    fontFamily: frontend.fontFamily,
    lineHeight: frontend.lineHeight,
    showLineNumbers: frontend.showLineNumbers,
    autoSave: frontend.autoSave,
    autoSaveDelay: frontend.autoSaveDelay,
    wordWrap: frontend.wordWrap,
    autoReload: frontend.autoReload,
    editorTheme: frontend.editorTheme,
    previewTheme: frontend.previewTheme,
    syncScroll: frontend.syncScroll,
    spellCheck: frontend.spellCheck,
  };
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from backend on mount
  useEffect(() => {
    const loadSettings = async () => {
      const backendSettings = await wails.getSettings();
      if (backendSettings) {
        setSettings(backendToFrontend(backendSettings));
      } else {
        // Fallback to localStorage if backend fails
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setSettings({ ...defaultSettings, ...JSON.parse(stored) });
          }
        } catch {
          console.error('Failed to load settings from storage');
        }
      }
      setIsLoaded(true);
    };
    loadSettings();
  }, []);

  // Save to backend when settings change
  useEffect(() => {
    if (!isLoaded) return;
    
    const saveSettings = async () => {
      await wails.updateSettings(frontendToBackend(settings));
      // Also save to localStorage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    };
    saveSettings();
  }, [settings, isLoaded]);

  useEffect(() => {
    const updateTheme = () => {
      let dark = false;
      if (settings.theme === 'dark') {
        dark = true;
      } else if (settings.theme === 'system') {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [settings.theme]);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, isDark }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider');
  }
  return context;
}
