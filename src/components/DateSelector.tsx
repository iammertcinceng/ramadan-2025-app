import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { usePrayerTimes } from '../context/PrayerTimesContext';
import { useTheme } from '../context/ThemeContext';

const DateSelector: React.FC = () => {
  const { date, setDate } = usePrayerTimes();
  const { colors, isDarkMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  // Tarih listesi oluştur (bugün + 7 gün)
  const dates = Array.from({ length: 8 }, (_, i) => {
    const d = moment().add(i, 'days');
    return {
      id: i.toString(),
      date: d.format('YYYY-MM-DD'),
      displayDate: d.format('DD MMMM YYYY'),
      day: d.format('dddd'),
      isToday: i === 0,
    };
  });

  // Seçili tarihi bul
  const selectedDate = dates.find((d) => d.date === date) || dates[0];

  // Tarih seçme işlevi
  const handleSelectDate = (selectedDate: string) => {
    setDate(selectedDate);
    setModalVisible(false);
  };

  // Modal içeriği
  const renderDateItem = ({ item }: { item: typeof dates[0] }) => (
    <TouchableOpacity
      style={[
        styles.dateItem,
        {
          backgroundColor:
            date === item.date
              ? colors.primaryLight
              : isDarkMode
              ? colors.background
              : colors.white,
        },
      ]}
      onPress={() => handleSelectDate(item.date)}
    >
      <View style={styles.dateInfo}>
        <Text
          style={[
            styles.dateDay,
            {
              color:
                date === item.date ? colors.primary : colors.textSecondary,
            },
          ]}
        >
          {item.day}
        </Text>
        <Text
          style={[
            styles.dateText,
            {
              color:
                date === item.date ? colors.primary : colors.textPrimary,
              fontWeight: date === item.date ? '600' : '400',
            },
          ]}
        >
          {item.displayDate}
        </Text>
        {item.isToday && (
          <View
            style={[styles.todayBadge, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.todayText}>Bugün</Text>
          </View>
        )}
      </View>
      {date === item.date && (
        <Ionicons name="checkmark" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.selectorButton,
          {
            backgroundColor: isDarkMode ? colors.background : colors.white,
            borderColor: colors.divider,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="calendar" size={20} color={colors.primary} />
        <View style={styles.dateContainer}>
          <Text
            style={[styles.selectedDate, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {selectedDate.displayDate}
          </Text>
          {selectedDate.isToday && (
            <Text
              style={[styles.todayLabel, { color: colors.textSecondary }]}
            >
              Bugün
            </Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView
          style={[
            styles.modalContainer,
            { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.5)' },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDarkMode ? colors.background : colors.white,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, { color: colors.textPrimary }]}
              >
                Tarih Seçin
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={dates}
              renderItem={renderDateItem}
              keyExtractor={(item) => item.id}
              style={styles.dateList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  todayLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  dateList: {
    flex: 1,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dateInfo: {
    flex: 1,
  },
  dateDay: {
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  todayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default DateSelector;
