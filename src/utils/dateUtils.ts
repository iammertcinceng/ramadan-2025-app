import moment from 'moment';

// Bugünün tarihini YYYY-MM-DD formatında döndürür
export const getCurrentDate = (): string => {
  return moment().format('YYYY-MM-DD');
};

// Belirli bir tarihi YYYY-MM-DD formatında döndürür
export const formatDate = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD');
};

// Belirli bir tarihi gün, ay, yıl formatında döndürür
export const formatDateLocale = (date: Date): string => {
  return moment(date).format('DD MMMM YYYY');
};

// İki zaman arasındaki farkı saat, dakika, saniye olarak döndürür
export const getTimeDifference = (targetTime: string): { hours: number; minutes: number; seconds: number } => {
  const now = moment();
  const target = moment(targetTime, 'HH:mm');
  
  // Eğer hedef zaman bugün geçtiyse, yarına ayarla
  if (target.isBefore(now)) {
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

// İki zaman arasındaki farkı saniye cinsinden döndürür
export const getTimeDifferenceInSeconds = (targetTime: string): number => {
  const now = moment();
  const target = moment(targetTime, 'HH:mm');
  
  // Eğer hedef zaman bugün geçtiyse, yarına ayarla
  if (target.isBefore(now)) {
    target.add(1, 'day');
  }
  
  const diff = target.diff(now);
  return Math.floor(diff / 1000);
};

// Saat formatını 24 saatten 12 saate çevirir (AM/PM)
export const formatTo12Hour = (time: string): string => {
  return moment(time, 'HH:mm').format('hh:mm A');
};

// Saat formatını 12 saatten 24 saate çevirir
export const formatTo24Hour = (time: string): string => {
  return moment(time, 'hh:mm A').format('HH:mm');
};

// Belirli bir tarihin Ramazan ayı içinde olup olmadığını kontrol eder
export const isRamadan = (hijriDate: { month: { number: number } }): boolean => {
  return hijriDate.month.number === 9; // Ramazan ayı hicri takvimde 9. aydır
};

// Ramazan ayının başlangıç ve bitiş tarihlerini hesaplar
export const getRamadanDates = (year: number): { start: string; end: string } => {
  // Not: Bu fonksiyon gerçek hesaplama için daha karmaşık bir algoritma gerektirir
  // Burada basit bir tahmin yapılmaktadır, gerçek uygulamada API'den alınan verilerle doğrulanmalıdır
  
  // Örnek olarak 2025 Ramazan tarihleri (yaklaşık)
  if (year === 2025) {
    return {
      start: '2025-03-01',
      end: '2025-03-30',
    };
  }
  
  // Diğer yıllar için varsayılan değerler
  return {
    start: `${year}-03-01`,
    end: `${year}-03-30`,
  };
};

export default {
  getCurrentDate,
  formatDate,
  formatDateLocale,
  getTimeDifference,
  getTimeDifferenceInSeconds,
  formatTo12Hour,
  formatTo24Hour,
  isRamadan,
  getRamadanDates,
};
