import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { usePrayerTimes } from '../context/PrayerTimesContext';
import moment from 'moment';

type CountdownTimerProps = {
  type: 'iftar' | 'sahur' | 'yatsi';
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ type }) => {
  const { colors } = useTheme();
  const { nextPrayer, iftarTime, sahurTime } = usePrayerTimes();
  
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Kalan süreyi hesapla
  const calculateRemainingTime = (targetTime: string) => {
    const now = moment();
    const target = moment(targetTime, 'HH:mm');
    
    // Eğer hedef zaman bugün geçtiyse, yarına ayarla
    if (target.isBefore(now)) {
      target.add(1, 'day');
    }
    
    const duration = moment.duration(target.diff(now));
    return {
      hours: Math.floor(duration.asHours()),
      minutes: duration.minutes(),
      seconds: duration.seconds()
    };
  };

  // Geri sayım için zamanlayıcı
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // İftar için özel kontrol
    if (type === 'iftar' && iftarTime && ['Güneş', 'Öğle', 'İkindi', 'Akşam'].includes(nextPrayer?.name || '')) {
      const remaining = calculateRemainingTime(iftarTime);
      setHours(remaining.hours);
      setMinutes(remaining.minutes);
      setSeconds(remaining.seconds);
      setTimerActive(true);
    }
    // Normal vakitler için
    else if (nextPrayer?.remainingTime) {
      setHours(nextPrayer.remainingTime.hours);
      setMinutes(nextPrayer.remainingTime.minutes);
      setSeconds(nextPrayer.remainingTime.seconds);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
    
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              if (hours === 0) {
                clearInterval(interval);
                return 0;
              }
              setHours((prevHours) => prevHours - 1);
              setMinutes(59);
              return 59;
            }
            setMinutes((prevMinutes) => prevMinutes - 1);
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [type, nextPrayer, iftarTime, timerActive]);

  // Aktif değilse gösterme
  if (!timerActive) {
    return null;
  }

  // Geri sayım metni
  const getTimerText = () => {
    switch (type) {
      case 'iftar':
        return 'İftar Vaktine Kalan Süre';
      case 'sahur':
        return 'İmsak Vaktine Kalan Süre';
      case 'yatsi':
        return 'Yatsı Vaktine Kalan Süre';
      default:
        return '';
    }
  };

  // Gradient renkleri
  const getGradientColors = (): [string, string] => {
    switch (type) {
      case 'iftar':
        return [colors.primary, colors.primaryDark];
      case 'sahur':
        return [colors.primaryDark, '#164419'];
      case 'yatsi':
        return [colors.primaryDark, '#113255'];
      default:
        return [colors.primary, colors.primaryDark];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.timerText}>{getTimerText()}</Text>
      <View style={styles.timeContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>{hours.toString().padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>Saat</Text>
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>{minutes.toString().padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>Dakika</Text>
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>{seconds.toString().padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>Saniye</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timeLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 8,
  },
});

export default CountdownTimer;
