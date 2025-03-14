import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, RefreshControl, Platform } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/tr';

import { usePrayerTimes } from '@/src/context/PrayerTimesContext';
import { useTheme } from '@/src/context/ThemeContext';
import CountdownTimer from '@/src/components/CountdownTimer';
import PrayerTimeCard from '@/src/components/PrayerTimeCard';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useTheme();
  const {
    selectedCity,
    prayerTimes,
    nextPrayer,
    isLoading,
    refreshPrayerTimes,
    date,
    setDate
  } = usePrayerTimes();

  const [refreshing, setRefreshing] = useState(false);

  // Türkçe tarih formatı için
  moment.locale('tr');

  useEffect(() => {
    if (!prayerTimes) {
      refreshPrayerTimes().catch(error => {
        console.error('İlk veri çekme hatası:', error);
      });
    }
  }, [prayerTimes, refreshPrayerTimes]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshPrayerTimes();
    setRefreshing(false);
  }, [refreshPrayerTimes]);

  // Bir önceki güne geç
  const goToPreviousDay = () => {
    const prevDate = moment(date).subtract(1, 'days').format('YYYY-MM-DD');
    setDate(prevDate);
  };

  // Bir sonraki güne geç
  const goToNextDay = () => {
    const nextDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
    setDate(nextDate);
  };

  // Namaz vakitlerini oluştur
  const renderPrayerTimes = () => {
    if (!prayerTimes) return null;

    const prayers = [
      { name: 'İmsak', time: prayerTimes.Fajr, icon: 'contrast-outline' as keyof typeof Ionicons.glyphMap },
      { name: 'Güneş', time: prayerTimes.Sunrise, icon: 'sunny-outline' as keyof typeof Ionicons.glyphMap },
      { name: 'Öğle', time: prayerTimes.Dhuhr, icon: 'sunny' as keyof typeof Ionicons.glyphMap },
      { name: 'İkindi', time: prayerTimes.Asr, icon: 'partly-sunny-outline' as keyof typeof Ionicons.glyphMap },
      { name: 'Akşam', time: prayerTimes.Maghrib, icon: 'cloudy-night-outline' as keyof typeof Ionicons.glyphMap },
      { name: 'Yatsı', time: prayerTimes.Isha, icon: 'moon-outline' as keyof typeof Ionicons.glyphMap },
    ];

    return prayers.map((prayer, index) => (
      <PrayerTimeCard
        key={index}
        name={prayer.name}
        time={prayer.time}
        iconName={prayer.icon}
        isNext={nextPrayer?.name === prayer.name}
      />
    ));
  };

  // Tarih formatını düzenle
  const formattedDate = moment(date).format('DD MMMM');
  const dayName = moment(date).format('dddd');
  const isToday = moment(date).isSame(moment(), 'day');

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: 10 },

      ]}
      edges={['top']}
    >

      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? colors.background : colors.background}
      />

      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 24 : 0 }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          2025 RAMAZAN
        </Text>
      </View>
      <View style={styles.cityContainer}>
        <View style={[styles.cityLine, styles.leftLine, { backgroundColor: colors.textPrimary }]} />
        <Text style={[styles.cityText, { color: colors.textPrimary }]}>
          {selectedCity?.name}
        </Text>
        <View style={[styles.cityLine, styles.rightLine, { backgroundColor: colors.textPrimary }]} />
      </View>

      {/* Tarih Seçici */}
      <View style={styles.dateSelector}>
        <TouchableOpacity
          style={styles.dateArrow}
          onPress={goToPreviousDay}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDarkMode ? colors.textSecondary : '#555'}
          />
          <Text style={[styles.dateArrowText, { color: isDarkMode ? colors.textSecondary : '#555' }]}>
            Dün
          </Text>
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <Text style={[styles.dateText, { color: colors.textPrimary }]}>
            {formattedDate}
          </Text>
          <Text style={[styles.dayText, { color: colors.textSecondary }]}>
            {isToday ? 'Bugün' : dayName}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.dateArrow}
          onPress={goToNextDay}
        >
          <Text style={[styles.dateArrowText, { color: isDarkMode ? colors.textSecondary : '#555' }]}>
            Yarın
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={isDarkMode ? colors.textSecondary : '#555'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* İftar veya Sahur için geri sayım */}
        {nextPrayer?.name === 'İmsak' && <CountdownTimer type="sahur" />}
        {nextPrayer?.name === 'Yatsı' && <CountdownTimer type="yatsi" />}
        {['Güneş', 'Öğle', 'İkindi', 'Akşam'].includes(nextPrayer?.name || '') && <CountdownTimer type="iftar" />}

        {/* Namaz vakitleri */}
        <View style={styles.prayerTimesContainer}>
          {isLoading ? (
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Yükleniyor...
            </Text>
          ) : (
            renderPrayerTimes()
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 4,
    paddingBottom: 16,
    alignItems: 'center',
    position: 'relative', // Konumlandırma yapılabilmesi için
  },
  cityLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
  },
  leftLine: {
    width: '26%', // Çizginin başlangıcından ne kadar uzak olacağını ayarlayın
    left: 0, // Çizginin sola hizalanması
  },
  rightLine: {
    width: '26%', // Çizginin bitişinden ne kadar uzak olacağını ayarlayın
    right: 0, // Çizginin sağa hizalanması
  },
  cityText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  dateArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  dateArrowText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayText: {
    fontSize: 14,
    marginTop: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  prayerTimesContainer: {
    marginTop: 8,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
});
