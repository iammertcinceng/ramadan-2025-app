import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import moment from 'moment';
import 'moment/locale/tr';  // Türkçe desteği

// Bildirimleri yapılandır
export const configureNotifications = async () => {
  // Bildirim işleyicisini ayarla
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // İzinleri kontrol et ve iste
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Eğer izin daha önce istenmemişse, iste
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // iOS için ek ayarlar
  if (Platform.OS === 'ios') {
    await Notifications.setNotificationCategoryAsync('iftar', [
      {
        identifier: 'dismiss',
        buttonTitle: 'Kapat',
        options: {
          isDestructive: false,
        },
      },
    ]);
  }

  return finalStatus === 'granted';
};

// Bildirim iznini kontrol et
export const checkNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
};

// İftar vakti için bildirim planla
export const scheduleIftarNotification = async (iftarTime: string, date: string) => {
  try {
    // Bildirim izni kontrolü
    if (!await checkNotificationPermissions()) {
      return null;
    }

    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    // Daha önce planlanmış aynı türde bir iftar bildirimi var mı?
    const existingNotification = scheduledNotifications.find(
      (notification) => notification.content.data?.type === 'iftar'
    );

    if (existingNotification) {
      console.log('İftar bildirimi zaten planlanmış.');
      return;
    }

    // Tarihi ve saati birleştir ve yerel saat dilimine çevir
    const iftarDateTime = moment(`${date} ${iftarTime}`, 'YYYY-MM-DD HH:mm');
    const now = moment();
        // Şu anki zaman ile iftar vakti arasındaki farkı hesapla
        const timeDiffMinutes = iftarDateTime.diff(now, 'minutes');

        // Eğer şu an iftara tam olarak 90 dakika kalmamışsa bildirim gönderme
        if (timeDiffMinutes !== 90) {
          console.log(`İftar bildirim zamanı değil: ${timeDiffMinutes} dk kaldı.`);
          return;
        }

    // Eğer iftar vakti geçmişse bildirim gönderme
    // if (iftarDateTime.isBefore(now)) {
    //   console.log('İftar vakti geçmiş:', iftarDateTime.format());
    //   return;
    // }

    // Bildirim zamanını ayarla (iftar vaktinden 90 dakika önce)
    const notificationTime = iftarDateTime.clone().subtract(90, 'minutes');

    // Geçerli bir tarih olup olmadığını kontrol et
    if (!notificationTime.isValid() || notificationTime.isBefore(now)) {
      console.error('Geçersiz bildirim zamanı:', notificationTime.format());
      return;
    }

    console.log('İftar bildirimi planlanıyor:', {
      iftarTime,
      date,
      notificationTime: notificationTime.format(),
      currentTime: now.format()
    });

    // Bildirim içeriğini oluştur
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'İftar Vakti Yaklaşıyor',
        body: `İftar vaktine 1 saat 30 dakika kaldı. İftar saati: ${iftarTime}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'iftar' },
      },
      trigger: {
        channelId: 'iftar',
        date: notificationTime.toDate(),
      },
    });
  } catch (error) {
    console.error('İftar bildirimi planlanırken hata:', error);
    return null;
  }
};

// Sahur vakti için bildirim planla
export const scheduleSahurNotification = async (fajrTime: string, date: string) => {
  try {
    // Bildirim izni kontrolü
    if (!await checkNotificationPermissions()) {
      return null;
    }

    // Önce tüm sahur bildirimlerini temizle
    await cancelSahurNotifications();

    // Tarihi ve saati birleştir ve yerel saat dilimine çevir
    const fajrDateTime = moment(`${date} ${fajrTime}`, 'YYYY-MM-DD HH:mm');
    const now = moment();

    // Eğer sahur vakti geçmişse bildirim gönderme
    if (fajrDateTime.isBefore(now)) {
      console.log('Sahur vakti geçmiş:', fajrDateTime.format());
      return;
    }

    // Bildirim zamanını ayarla (sahur vaktinden 90 dakika önce)
    const notificationTime = fajrDateTime.clone().subtract(90, 'minutes');

    // Geçerli bir tarih olup olmadığını kontrol et
    if (!notificationTime.isValid() || notificationTime.isBefore(now)) {
      console.error('Geçersiz bildirim zamanı:', notificationTime.format());
      return;
    }

    console.log('Sahur bildirimi planlanıyor:', {
      fajrTime,
      date,
      notificationTime: notificationTime.format(),
      currentTime: now.format()
    });

    // Bildirim içeriğini oluştur
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Sahur Vakti Yaklaşıyor',
        body: `Sahur vaktine 1 saat 30 dakika kaldı. İmsak saati: ${fajrTime}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'sahur' },
      },
      trigger: {
        channelId: 'sahur',
        date: notificationTime.toDate(),
      },
    });
  } catch (error) {
    console.error('Sahur bildirimi planlanırken hata:', error);
    return null;
  }
};

// İftar bildirimlerini iptal et
export const cancelIftarNotifications = async () => {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

  // İftar tipindeki bildirimleri bul ve iptal et
  for (const notification of scheduledNotifications) {
    if (notification.content.data?.type === 'iftar') {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
};

// Sahur bildirimlerini iptal et
export const cancelSahurNotifications = async () => {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

  // Sahur tipindeki bildirimleri bul ve iptal et
  for (const notification of scheduledNotifications) {
    if (notification.content.data?.type === 'sahur') {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
};

// Tüm bildirimleri iptal et
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export default {
  configureNotifications,
  scheduleIftarNotification,
  scheduleSahurNotification,
  cancelIftarNotifications,
  cancelSahurNotifications,
  cancelAllNotifications,
};
