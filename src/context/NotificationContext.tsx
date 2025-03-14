import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  configureNotifications, 
  scheduleIftarNotification, 
  scheduleSahurNotification,
  cancelAllNotifications
} from '../utils/notificationUtils';
import { getNotificationSettings, saveNotificationSettings } from '../utils/storageUtils';
import { usePrayerTimes } from './PrayerTimesContext';
import { scheduleDailyQuotes } from '../utils/dailyQuoteUtils';

// Context için tip tanımlamaları
type NotificationSettings = {
  iftarEnabled: boolean;
  sahurEnabled: boolean;
  dailyQuoteEnabled: boolean;
  iftarTime: number;
  sahurTime: number;
};

type NotificationContextType = {
  settings: NotificationSettings;
  isPermissionGranted: boolean;
  updateSettings: (newSettings: Partial<NotificationSettings>) => Promise<void>;
  scheduleNotifications: () => Promise<void>;
  cancelNotifications: () => Promise<void>;
};

// Context oluştur
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider bileşeni
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    iftarEnabled: true,
    sahurEnabled: true,
    dailyQuoteEnabled: true,
    iftarTime: 90,
    sahurTime: 90,
  });
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);
  
  const { date, iftarTime, sahurTime } = usePrayerTimes();

  // İlk yükleme
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Bildirimleri yapılandır ve izinleri kontrol et
        const permissionGranted = await configureNotifications();
        setIsPermissionGranted(permissionGranted);
        
        // Kaydedilmiş ayarları yükle
        const savedSettings = await getNotificationSettings();
        setSettings(savedSettings);
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };
    
    initializeNotifications();
  }, []);

  // Namaz vakitleri değiştiğinde bildirimleri güncelle
  useEffect(() => {
    if (isPermissionGranted && (iftarTime || sahurTime)) {
      scheduleNotifications();
    }
  }, [isPermissionGranted, date, iftarTime, sahurTime]);

  // Ayarları güncelleme fonksiyonu
  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await saveNotificationSettings(updatedSettings);
    
    // Bildirimleri yeniden planla
    if (isPermissionGranted) {
      await scheduleNotifications();
    }
  };

  // Bildirimleri planlama fonksiyonu
  const scheduleNotifications = async () => {
    if (!isPermissionGranted || !date) return;
    
    try {
      // İftar bildirimi
      if (settings.iftarEnabled && iftarTime) {
        await scheduleIftarNotification(iftarTime, date);
      }
      
      // Sahur bildirimi
      if (settings.sahurEnabled && sahurTime) {
        await scheduleSahurNotification(sahurTime, date);
      }
      
      // Günün mesajı bildirimi
      if (settings.dailyQuoteEnabled) {
        await scheduleDailyQuotes();
      }
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  };

  // Bildirimleri iptal etme fonksiyonu
  const cancelNotifications = async () => {
    try {
      await cancelAllNotifications();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  };

  // Context değerini oluştur
  const value = {
    settings,
    isPermissionGranted,
    updateSettings,
    scheduleNotifications,
    cancelNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;
