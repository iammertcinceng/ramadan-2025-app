import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage anahtarları
const STORAGE_KEYS = {
  SELECTED_CITY: '@iftar_vakti:selected_city',
  NOTIFICATION_SETTINGS: '@iftar_vakti:notification_settings',
  THEME_SETTINGS: '@iftar_vakti:theme_settings',
  LAST_VIEWED_DATE: '@iftar_vakti:last_viewed_date',
};

// Seçili şehri kaydet
export const saveSelectedCity = async (city: { name: string; latitude: number; longitude: number }) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_CITY, JSON.stringify(city));
    return true;
  } catch (error) {
    console.error('Error saving selected city:', error);
    return false;
  }
};

// Seçili şehri getir
export const getSelectedCity = async () => {
  try {
    const cityData = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CITY);
    return cityData ? JSON.parse(cityData) : null;
  } catch (error) {
    console.error('Error getting selected city:', error);
    return null;
  }
};

// Bildirim ayarlarını kaydet
export const saveNotificationSettings = async (settings: { 
  iftarEnabled: boolean; 
  sahurEnabled: boolean;
  iftarTime: number; // İftar vaktinden kaç dakika önce bildirim gönderilecek
  sahurTime: number; // Sahur vaktinden kaç dakika önce bildirim gönderilecek
}) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving notification settings:', error);
    return false;
  }
};

// Bildirim ayarlarını getir
export const getNotificationSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
    
    // Varsayılan ayarlar
    const defaultSettings = {
      iftarEnabled: true,
      sahurEnabled: true,
      iftarTime: 60, // İftar vaktinden 60 dakika önce
      sahurTime: 60, // Sahur vaktinden 60 dakika önce
    };
    
    return settings ? JSON.parse(settings) : defaultSettings;
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return {
      iftarEnabled: true,
      sahurEnabled: true,
      iftarTime: 60,
      sahurTime: 60,
    };
  }
};

// Tema ayarlarını kaydet
export const saveThemeSettings = async (settings: { isDarkMode: boolean; useSystemTheme: boolean }) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving theme settings:', error);
    return false;
  }
};

// Tema ayarlarını getir
export const getThemeSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(STORAGE_KEYS.THEME_SETTINGS);
    return settings ? JSON.parse(settings) : { isDarkMode: false, useSystemTheme: true };
  } catch (error) {
    console.error('Error getting theme settings:', error);
    return { isDarkMode: false, useSystemTheme: true };
  }
};

// Son görüntülenen tarihi kaydet
export const saveLastViewedDate = async (date: string) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_VIEWED_DATE, date);
    return true;
  } catch (error) {
    console.error('Error saving last viewed date:', error);
    return false;
  }
};

// Son görüntülenen tarihi getir
export const getLastViewedDate = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_VIEWED_DATE);
  } catch (error) {
    console.error('Error getting last viewed date:', error);
    return null;
  }
};

// Tüm verileri temizle
export const clearAllData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

export default {
  saveSelectedCity,
  getSelectedCity,
  saveNotificationSettings,
  getNotificationSettings,
  saveThemeSettings,
  getThemeSettings,
  saveLastViewedDate,
  getLastViewedDate,
  clearAllData,
};
