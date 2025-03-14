import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useColorScheme, StatusBar, Appearance } from 'react-native';
import { getThemeSettings, saveThemeSettings } from '../utils/storageUtils';
import colors from '../theme/colors';

// Context için tip tanımlamaları
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
  colors: typeof colors.light | typeof colors.dark;
  useSystemTheme: boolean;
  setUseSystemTheme: (use: boolean) => void;
};

// Context oluştur
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider bileşeni
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemColorScheme === 'dark');
  const [useSystemTheme, setUseSystemTheme] = useState<boolean>(true);

  // Sistem teması değişikliğini dinle
  useEffect(() => {
    if (useSystemTheme) {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setIsDarkMode(colorScheme === 'dark');
        updateStatusBar(colorScheme === 'dark');
      });

      return () => subscription.remove();
    }
  }, [useSystemTheme]);

  // StatusBar'ı güncelle
  const updateStatusBar = (isDark: boolean) => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    StatusBar.setBackgroundColor(isDark ? colors.dark.background : colors.light.background);
  };

  // İlk yükleme
  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        const settings = await getThemeSettings();
        setUseSystemTheme(settings.useSystemTheme ?? true);
        if (!settings.useSystemTheme) {
          setIsDarkMode(settings.isDarkMode);
          updateStatusBar(settings.isDarkMode);
        } else {
          setIsDarkMode(systemColorScheme === 'dark');
          updateStatusBar(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme settings:', error);
        setUseSystemTheme(true);
        setIsDarkMode(systemColorScheme === 'dark');
        updateStatusBar(systemColorScheme === 'dark');
      }
    };
    
    loadThemeSettings();
  }, [systemColorScheme]);

  // Tema değiştirme fonksiyonu
  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    updateStatusBar(newMode);
    await saveThemeSettings({ isDarkMode: newMode, useSystemTheme: false });
    setUseSystemTheme(false);
  };

  // Temayı doğrudan ayarlama fonksiyonu
  const setDarkMode = async (isDark: boolean) => {
    setIsDarkMode(isDark);
    updateStatusBar(isDark);
    await saveThemeSettings({ isDarkMode: isDark, useSystemTheme: false });
    setUseSystemTheme(false);
  };

  // Sistem teması kullanımını ayarlama
  const setSystemThemeUsage = async (use: boolean) => {
    setUseSystemTheme(use);
    await saveThemeSettings({ isDarkMode, useSystemTheme: use });
    if (use) {
      setIsDarkMode(systemColorScheme === 'dark');
      updateStatusBar(systemColorScheme === 'dark');
    }
  };

  // Aktif tema renklerini belirle
  const themeColors = isDarkMode ? colors.dark : colors.light;

  // Context değerini oluştur
  const value = {
    isDarkMode,
    toggleTheme,
    setDarkMode,
    colors: themeColors,
    useSystemTheme,
    setUseSystemTheme: setSystemThemeUsage,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;
