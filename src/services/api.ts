import axios from 'axios';

const API_BASE_URL = 'https://api.aladhan.com/v1';

// Türkiye şehirleri ve koordinatları
export const TURKISH_CITIES = [
  { name: 'İstanbul', latitude: 41.0082, longitude: 28.9784 },
  { name: 'Ankara', latitude: 39.9334, longitude: 32.8597 },
  { name: 'İzmir', latitude: 38.4237, longitude: 27.1428 },
  { name: 'Bursa', latitude: 40.1885, longitude: 29.0610 },
  { name: 'Bursa / İnegöl', latitude: 40.0778, longitude: 29.5130 },
  { name: 'Antalya', latitude: 36.8969, longitude: 30.7133 },
  { name: 'Adana', latitude: 37.0000, longitude: 35.3213 },
  { name: 'Konya', latitude: 37.8667, longitude: 32.4833 },
  { name: 'Gaziantep', latitude: 37.0662, longitude: 37.3833 },
  { name: 'Şanlıurfa', latitude: 37.1591, longitude: 38.7969 },
  { name: 'Mersin', latitude: 36.8000, longitude: 34.6333 },
  { name: 'Diyarbakır', latitude: 37.9144, longitude: 40.2306 },
  { name: 'Hatay', latitude: 36.2000, longitude: 36.1600 },
  { name: 'Manisa', latitude: 38.6191, longitude: 27.4289 },
  { name: 'Kayseri', latitude: 38.7312, longitude: 35.4787 },
  { name: 'Samsun', latitude: 41.2867, longitude: 36.3300 },
  { name: 'Balıkesir', latitude: 39.6484, longitude: 27.8826 },
  { name: 'Kahramanmaraş', latitude: 37.5858, longitude: 36.9371 },
  { name: 'Van', latitude: 38.4891, longitude: 43.4089 },
  { name: 'Aydın', latitude: 37.8400, longitude: 27.8400 },
  { name: 'Denizli', latitude: 37.7765, longitude: 29.0864 },
  { name: 'Sakarya', latitude: 40.7731, longitude: 30.3943 },
  { name: 'Tekirdağ', latitude: 40.9833, longitude: 27.5167 },
  { name: 'Muğla', latitude: 37.2153, longitude: 28.3636 },
  { name: 'Eskişehir', latitude: 39.7767, longitude: 30.5206 },
  { name: 'Mardin', latitude: 37.3212, longitude: 40.7245 },
  { name: 'Trabzon', latitude: 41.0015, longitude: 39.7178 },
  { name: 'Ordu', latitude: 40.9839, longitude: 37.8764 },
  { name: 'Malatya', latitude: 38.3552, longitude: 38.3095 },
  { name: 'Erzurum', latitude: 39.9000, longitude: 41.2700 },
  { name: 'Afyonkarahisar', latitude: 38.7507, longitude: 30.5567 },

];

// Namaz vakitleri için API çağrısı
export const fetchPrayerTimes = async (latitude: number, longitude: number, date: string) => {
  try {
    const formattedDate = date.split('-').reverse().join('-'); // YYYY-MM-DD -> DD-MM-YYYY
    const response = await axios.get(`${API_BASE_URL}/timings/${formattedDate}`, {
      params: {
        latitude,
        longitude,
        method: 13, // Diyanet İşleri metodu
      },
      timeout: 10000, // 10 saniye timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || !response.data.data || !response.data.data.timings) {
      throw new Error('Invalid API response format');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

// Belirli bir ay için namaz vakitlerini getir
export const fetchMonthlyPrayerTimes = async (
  latitude: number,
  longitude: number,
  year: number,
  month: number
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/calendar/${year}/${month}`, {
      params: {
        latitude,
        longitude,
        method: 13, // Diyanet İşleri metodu
      },
      timeout: 10000, // 10 saniye timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error('Invalid API response format');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching monthly prayer times:', error);
    throw error;
  }
};

export default {
  fetchPrayerTimes,
  fetchMonthlyPrayerTimes,
  TURKISH_CITIES,
};
