import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePrayerTimes } from '../context/PrayerTimesContext';
import { useTheme } from '../context/ThemeContext';

type City = {
  name: string;
  latitude: number;
  longitude: number;
};

const CitySelector: React.FC = () => {
  const { selectedCity, cities, setSelectedCity } = usePrayerTimes();
  const { colors, isDarkMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Şehirleri filtrele
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Şehir seçme işlevi
  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setModalVisible(false);
  };

  // Modal içeriği
  const renderCityItem = ({ item }: { item: City }) => (
    <TouchableOpacity
      style={[
        styles.cityItem,
        {
          backgroundColor:
            selectedCity?.name === item.name
              ? colors.primaryLight
              : isDarkMode
              ? colors.background
              : colors.white,
        },
      ]}
      onPress={() => handleSelectCity(item)}
    >
      <Text
        style={[
          styles.cityName,
          {
            color:
              selectedCity?.name === item.name
                ? colors.primary
                : colors.textPrimary,
            fontWeight: selectedCity?.name === item.name ? '600' : '400',
          },
        ]}
      >
        {item.name}
      </Text>
      {selectedCity?.name === item.name && (
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
        <Ionicons name="location" size={20} color={colors.primary} />
        <Text
          style={[styles.cityText, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {selectedCity?.name || 'Şehir Seçin'}
        </Text>
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
                Şehir Seçin
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <Ionicons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Şehir Ara..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredCities}
              renderItem={renderCityItem}
              keyExtractor={(item) => item.name}
              style={styles.cityList}
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
  cityText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 8,
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
    height: '80%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    padding: 4,
  },
  cityList: {
    flex: 1,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  cityName: {
    fontSize: 16,
  },
});

export default CitySelector;
