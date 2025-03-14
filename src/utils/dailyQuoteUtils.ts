import * as Notifications from 'expo-notifications';
import { dailyQuotes, DailyQuote } from '../data/dailyQuotes';
import moment from 'moment';

// Günlük bildirim saatleri (10:00, 14:00, 20:00)
const NOTIFICATION_HOURS = [10, 14, 20];

// Rastgele bir alıntı seç
const getRandomQuote = (): DailyQuote => {
  const randomIndex = Math.floor(Math.random() * dailyQuotes.length);
  return dailyQuotes[randomIndex];
};

// Bildirim başlığını oluştur
const getNotificationTitle = (quote: DailyQuote): string => {
  switch (quote.type) {
    case 'hadis':
      return '📖 Günün Hadisi';
    case 'ayet':
      return '🕌 Günün Ayeti';
    case 'dua':
      return '🤲 Günün Duası';
    default:
      return '📝 Günün Mesajı';
  }
};

// Günlük bildirimleri planla
export const scheduleDailyQuotes = async () => {
  try {
    // Mevcut bildirimleri temizle
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Her saat için bildirim planla
    for (const hour of NOTIFICATION_HOURS) {
      const quote = getRandomQuote();
      const now = moment();
      let notificationTime = moment().set({
        hour: hour,
        minute: 0,
        second: 0,
        millisecond: 0
      });

      // Eğer belirtilen saat geçmişse, bir sonraki güne planla
      if (notificationTime.isBefore(now)) {
        notificationTime = notificationTime.add(1, 'day');
      }

      console.log(`Bildirim planlanıyor:`, {
        time: notificationTime.format('YYYY-MM-DD HH:mm:ss'),
        type: quote.type
      });

      // Her gün belirli saatte tekrarlanan bildirim
      await Notifications.scheduleNotificationAsync({
        content: {
          title: getNotificationTitle(quote),
          body: quote.content,
          data: {
            type: 'daily_quote',
            source: quote.source
          },
        },
        trigger: {
          channelId: 'daily-quotes',
          seconds: 60 * 60 * 24, // 24 saat
          repeats: true
        },
      });
    }

    console.log('Günlük bildirimler başarıyla planlandı');
  } catch (error) {
    console.error('Günlük bildirimler planlanırken hata:', error);
  }
};

// Bildirimleri iptal et
export const cancelDailyQuotes = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Tüm bildirimler iptal edildi');
  } catch (error) {
    console.error('Bildirimler iptal edilirken hata:', error);
  }
};
