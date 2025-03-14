import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import moment from 'moment';
import { fetchPrayerTimes, TURKISH_CITIES } from '../services/api';
import { getSelectedCity, saveSelectedCity } from '../utils/storageUtils';
import { getCurrentDate } from '../utils/dateUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleIftarNotification, scheduleSahurNotification } from '../utils/notificationUtils';
import { scheduleDailyQuotes, cancelDailyQuotes } from '../utils/dailyQuoteUtils';

// Context için tip tanımlamaları
type PrayerTime = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
};

type PrayerTimesContextType = {
  selectedCity: {
    name: string;
    latitude: number;
    longitude: number;
  } | null;
  prayerTimes: PrayerTime | null;
  date: string;
  isLoading: boolean;
  error: string | null;
  cities: typeof TURKISH_CITIES;
  setSelectedCity: (city: { name: string; latitude: number; longitude: number }) => void;
  setDate: (date: string) => void;
  refreshPrayerTimes: () => Promise<void>;
  nextPrayer: {
    name: string;
    time: string;
    remainingTime: { hours: number; minutes: number; seconds: number } | null;
  } | null;
  iftarTime: string | null;
  sahurTime: string | null;
  notificationsEnabled: boolean;
  toggleNotifications: () => Promise<void>;
  dailyQuotesEnabled: boolean;
  toggleDailyQuotes: () => Promise<void>;
};

// Context oluştur
const PrayerTimesContext = createContext<PrayerTimesContextType | undefined>(undefined);

// Provider bileşeni
export const PrayerTimesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null);
  const [date, setDateState] = useState<string>(getCurrentDate());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{
    name: string;
    time: string;
    remainingTime: { hours: number; minutes: number; seconds: number } | null;
  } | null>(null);
  const [iftarTime, setIftarTime] = useState<string | null>(null);
  const [sahurTime, setSahurTime] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [dailyQuotesEnabled, setDailyQuotesEnabled] = useState<boolean>(false);

  // Namaz vakitlerini getirme fonksiyonu
  const fetchTimes = async (latitude: number, longitude: number, selectedDate: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchPrayerTimes(latitude, longitude, selectedDate);
      setPrayerTimes(data.timings);
      setIftarTime(data.timings.Maghrib);
      setSahurTime(data.timings.Fajr);
      calculateNextPrayer(data.timings);
      setRetryCount(0); // Başarılı olduğunda retry sayısını sıfırla
    } catch (err) {
      console.error('Error fetching prayer times:', err);
      setError('Namaz vakitleri alınırken bir hata oluştu.');
      
      // Hata durumunda yeniden deneme
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchTimes(latitude, longitude, selectedDate);
        }, 2000 * (retryCount + 1)); // Her denemede artan bekleme süresi
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Şehir değiştirme fonksiyonu
  const setSelectedCity = async (city: { name: string; latitude: number; longitude: number }) => {
    setSelectedCityState(city);
    await saveSelectedCity(city);
    await fetchTimes(city.latitude, city.longitude, date);
  };

  // Tarih değiştirme fonksiyonu
  const setDate = async (newDate: string) => {
    setDateState(newDate);
    if (selectedCity) {
      await fetchTimes(selectedCity.latitude, selectedCity.longitude, newDate);
    }
  };

  // Namaz vakitlerini yenileme fonksiyonu
  const refreshPrayerTimes = async () => {
    if (selectedCity) {
      await fetchTimes(selectedCity.latitude, selectedCity.longitude, date);
    }
  };

  // İlk yükleme ve otomatik yenileme
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const savedCity = await getSelectedCity();
        const cityToUse = savedCity || TURKISH_CITIES[0];
        setSelectedCityState(cityToUse);
        await fetchTimes(cityToUse.latitude, cityToUse.longitude, date);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Veriler yüklenirken bir hata oluştu.');
      }
    };
    
    loadInitialData();

    // Her 5 dakikada bir verileri yenile
    const refreshInterval = setInterval(() => {
      if (selectedCity) {
        fetchTimes(selectedCity.latitude, selectedCity.longitude, date);
      }
    }, 5 * 60 * 1000);

    // Component unmount olduğunda interval'i temizle
    return () => clearInterval(refreshInterval);
  }, []);

  // Sonraki namaz vaktini hesaplama
  const calculateNextPrayer = (times: PrayerTime) => {
    const now = moment();
    const prayers = [
      { name: 'İmsak', time: times.Fajr },
      { name: 'Güneş', time: times.Sunrise },
      { name: 'Öğle', time: times.Dhuhr },
      { name: 'İkindi', time: times.Asr },
      { name: 'Akşam', time: times.Maghrib },
      { name: 'Yatsı', time: times.Isha },
    ];
    
    let nextPrayerInfo = null;
    
    for (const prayer of prayers) {
      const prayerTime = moment(prayer.time, 'HH:mm');
      
      if (prayerTime.isAfter(now)) {
        nextPrayerInfo = {
          name: prayer.name,
          time: prayer.time,
          remainingTime: calculateRemainingTime(prayer.time),
        };
        break;
      }
    }
    
    if (!nextPrayerInfo) {
      nextPrayerInfo = {
        name: 'İmsak (Yarın)',
        time: times.Fajr,
        remainingTime: calculateRemainingTime(times.Fajr, true),
      };
    }
    
    setNextPrayer(nextPrayerInfo);
  };

  // Kalan zamanı hesaplama
  const calculateRemainingTime = (time: string, isNextDay = false) => {
    const now = moment();
    let target = moment(time, 'HH:mm');
    
    if (isNextDay) {
      target.add(1, 'day');
    }
    
    const diff = target.diff(now);
    const duration = moment.duration(diff);
    
    return {
      hours: Math.floor(duration.asHours()),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  };

  // Kalan zamanı güncellemek için zamanlayıcı
  useEffect(() => {
    if (!prayerTimes) return;
    
    const timer = setInterval(() => {
      calculateNextPrayer(prayerTimes);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [prayerTimes]);

  // Bildirim ayarlarını yükle
  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const notifEnabled = await AsyncStorage.getItem('notificationsEnabled');
        const quotesEnabled = await AsyncStorage.getItem('dailyQuotesEnabled');
        setNotificationsEnabled(notifEnabled === 'true');
        setDailyQuotesEnabled(quotesEnabled === 'true');
      } catch (error) {
        console.error('Bildirim ayarları yüklenirken hata:', error);
      }
    };
    loadNotificationSettings();
  }, []);

  // Bildirim ayarlarını kaydet
  const saveNotificationSettings = async () => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
      await AsyncStorage.setItem('dailyQuotesEnabled', dailyQuotesEnabled.toString());
    } catch (error) {
      console.error('Bildirim ayarları kaydedilirken hata:', error);
    }
  };

  // Bildirimleri etkinleştir/devre dışı bırak
  const toggleNotifications = async () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    await saveNotificationSettings();
    
    if (newState) {
      // Bildirimleri etkinleştir
      if (selectedCity && prayerTimes) {
        await scheduleIftarNotification(prayerTimes.Maghrib, date);
        await scheduleSahurNotification(prayerTimes.Fajr, date);
      }
    }
  };

  // Günlük bildirimleri etkinleştir/devre dışı bırak
  const toggleDailyQuotes = async () => {
    const newState = !dailyQuotesEnabled;
    setDailyQuotesEnabled(newState);
    await saveNotificationSettings();
    
    if (newState) {
      await scheduleDailyQuotes();
    } else {
      await cancelDailyQuotes();
    }
  };

  const value = {
    selectedCity,
    prayerTimes,
    date,
    isLoading,
    error,
    cities: TURKISH_CITIES,
    setSelectedCity,
    setDate,
    refreshPrayerTimes,
    nextPrayer,
    iftarTime,
    sahurTime,
    notificationsEnabled,
    toggleNotifications,
    dailyQuotesEnabled,
    toggleDailyQuotes,
  };

  return (
    <PrayerTimesContext.Provider value={value}>
      {children}
    </PrayerTimesContext.Provider>
  );
};

// Custom hook
export const usePrayerTimes = () => {
  const context = useContext(PrayerTimesContext);
  if (context === undefined) {
    throw new Error('usePrayerTimes must be used within a PrayerTimesProvider');
  }
  return context;
};

export default PrayerTimesContext;
