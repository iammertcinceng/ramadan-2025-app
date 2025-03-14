import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { TURKISH_CITIES } from '@/src/services/api';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectCity: (city: typeof TURKISH_CITIES[0]) => void;
  selectedCity: typeof TURKISH_CITIES[0] | null;
};

export function CityPickerModal({ visible, onClose, onSelectCity, selectedCity }: Props) {
  const { colors, isDarkMode } = useTheme();

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Şehir Seçin</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={TURKISH_CITIES}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.cityItem,
                {
                  backgroundColor: selectedCity?.name === item.name ? colors.primaryLight : 'transparent',
                },
              ]}
              onPress={() => {
                onSelectCity(item);
                onClose();
              }}>
              <Text
                style={[
                  styles.cityName,
                  {
                    color: selectedCity?.name === item.name ? colors.primary : colors.textPrimary,
                    fontWeight: selectedCity?.name === item.name ? 'bold' : 'normal',
                  },
                ]}>
                {item.name}
              </Text>
              {selectedCity?.name === item.name && (
                <Ionicons name="checkmark" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cityName: {
    fontSize: 16,
  },
});
