import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

import { usePrayerTimes } from '@/src/context/PrayerTimesContext';
import { useTheme } from '@/src/context/ThemeContext';
import CitySelector from '@/src/components/CitySelector';
import { fetchMonthlyPrayerTimes } from '@/src/services/api';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useTheme();
  const { selectedCity } = usePrayerTimes();
  
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCity) {
      fetchMonthData();
    }
  }, [selectedCity, selectedMonth, selectedYear]);

  const fetchMonthData = async () => {
    if (!selectedCity) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMonthlyPrayerTimes(
        selectedCity.latitude,
        selectedCity.longitude,
        selectedYear,
        selectedMonth
      );

      if (data && Array.isArray(data)) {
        setMonthlyData(data);
        setRetryCount(0); // Başarılı olduğunda retry sayısını sıfırla
      } else {
        throw new Error('Geçersiz veri formatı');
      }
    } catch (error) {
      console.error('Takvim verisi alınırken hata:', error);
      setError('Veriler alınırken bir hata oluştu');
      
      // Hata durumunda yeniden deneme
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchMonthData();
        }, 2000 * (retryCount + 1)); // Her denemede artan bekleme süresi
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Yenileme fonksiyonu
  const refreshData = () => {
    setRetryCount(0);
    fetchMonthData();
  };

  const renderMonthSelector = () => {
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    
    return (
      <View style={styles.monthSelector}>
        <TouchableOpacity
          onPress={() => {
            if (selectedMonth === 1) {
              setSelectedMonth(12);
              setSelectedYear(selectedYear - 1);
            } else {
              setSelectedMonth(selectedMonth - 1);
            }
          }}
          style={[styles.monthButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.monthButtonText}>{'<'}</Text>
        </TouchableOpacity>
        
        <Text style={[styles.monthTitle, { color: colors.textPrimary }]}>
          {months[selectedMonth - 1]} {selectedYear}
        </Text>
        
        <TouchableOpacity
          onPress={() => {
            if (selectedMonth === 12) {
              setSelectedMonth(1);
              setSelectedYear(selectedYear + 1);
            } else {
              setSelectedMonth(selectedMonth + 1);
            }
          }}
          style={[styles.monthButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.monthButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDayItem = ({ item }: { item: any }) => {
    const date = item.date.gregorian.date;
    const isToday = date === moment().format('DD-MM-YYYY');
    
    return (
      <View
        style={[
          styles.dayCard,
          {
            backgroundColor: isDarkMode ? colors.background : colors.white,
            borderColor: isToday ? colors.primary : colors.divider,
            borderWidth: isToday ? 2 : 1,
          },
        ]}
      >
        <View style={styles.dateHeader}>
          <Text
            style={[
              styles.dateText,
              { color: isToday ? colors.primary : colors.textPrimary },
            ]}
          >
            {moment(date, 'DD-MM-YYYY').format('DD MMMM')}
          </Text>
          <Text
            style={[
              styles.hijriDate,
              { color: colors.textSecondary },
            ]}
          >
            {item.date.hijri.day} {item.date.hijri.month.en}
          </Text>
        </View>
        
        <View style={styles.timesContainer}>
          <View style={styles.timeRow}>
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
              İmsak
            </Text>
            <Text style={[styles.timeValue, { color: colors.textPrimary }]}>
              {item.timings.Fajr.slice(0, 5)}
            </Text>
          </View>
          
          <View style={styles.timeRow}>
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
              Güneş
            </Text>
            <Text style={[styles.timeValue, { color: colors.textPrimary }]}>
              {item.timings.Sunrise.slice(0, 5)}
            </Text>
          </View>
          
          <View style={styles.timeRow}>
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
              Öğle
            </Text>
            <Text style={[styles.timeValue, { color: colors.textPrimary }]}>
              {item.timings.Dhuhr.slice(0, 5)}
            </Text>
          </View>
          
          <View style={styles.timeRow}>
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
              İkindi
            </Text>
            <Text style={[styles.timeValue, { color: colors.textPrimary }]}>
              {item.timings.Asr.slice(0, 5)}
            </Text>
          </View>
          
          <View style={styles.timeRow}>
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
              Akşam
            </Text>
            <Text style={[styles.timeValue, { color: colors.textPrimary }]}>
              {item.timings.Maghrib.slice(0, 5)}
            </Text>
          </View>
          
          <View style={styles.timeRow}>
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
              Yatsı
            </Text>
            <Text style={[styles.timeValue, { color: colors.textPrimary }]}>
              {item.timings.Isha.slice(0, 5)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? colors.background : colors.background },
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? colors.background : colors.background}
      />
      
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Namaz Vakitleri Takvimi
        </Text>
      </View>
      
      <CitySelector />
      {renderMonthSelector()}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Yükleniyor...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            {error}
          </Text>
          <TouchableOpacity onPress={refreshData}>
            <Text style={[styles.refreshText, { color: colors.primary }]}>
              Yenile
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={monthlyData}
          renderItem={renderDayItem}
          keyExtractor={(item) => item.date.gregorian.date}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dayCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  hijriDate: {
    fontSize: 14,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeRow: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
