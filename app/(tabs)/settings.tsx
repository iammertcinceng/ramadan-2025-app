import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/src/context/ThemeContext';
import { useNotifications } from '@/src/context/NotificationContext';
import { clearAllData } from '@/src/utils/storageUtils';
import { usePrayerTimes } from '@/src/context/PrayerTimesContext';
import { CityPickerModal } from '@/components/CityPickerModal';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { settings, updateSettings, isPermissionGranted } = useNotifications();
  const { selectedCity, setSelectedCity } = usePrayerTimes();
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  const handleClearData = async () => {
    await clearAllData();
    alert('Tüm veriler temizlendi. Uygulamayı yeniden başlatın.');
  };

  return (
    <>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? colors.background : colors.background },
        ]}
        edges={['top']}
      >
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? colors.background : colors.background}
        />
        
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Ayarlar
          </Text>
        </View>
        
        <ScrollView style={styles.scrollView}>
          {/* Şehir Seçimi */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Konum
            </Text>
            
            <TouchableOpacity
              style={[
                styles.settingItem,
                { backgroundColor: isDarkMode ? colors.background : colors.white },
              ]}
              onPress={() => setCityPickerVisible(true)}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="location" size={24} color={colors.primary} />
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>
                  Şehir Seçimi
                </Text>
              </View>
              <View style={styles.settingValue}>
                <Text style={[styles.settingValueText, { color: colors.textSecondary }]}>
                  {selectedCity?.name || 'Seçiniz'}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Tema Ayarları */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Görünüm
            </Text>
            
            <View
              style={[
                styles.settingItem,
                { backgroundColor: isDarkMode ? colors.background : colors.white },
              ]}
            >
              <View style={styles.settingInfo}>
                <Ionicons
                  name={isDarkMode ? 'moon' : 'sunny'}
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>
                  Karanlık Mod
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: colors.primaryLight }}
                thumbColor={isDarkMode ? colors.primary : '#f4f3f4'}
              />
            </View>
          </View>
          
          {/* Bildirim Ayarları */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Bildirimler
            </Text>
            
            <View
              style={[
                styles.settingItem,
                { backgroundColor: isDarkMode ? colors.background : colors.white },
              ]}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={24} color={colors.primary} />
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>
                  İftar Bildirimleri
                </Text>
              </View>
              <Switch
                value={settings.iftarEnabled}
                onValueChange={(value) => updateSettings({ iftarEnabled: value })}
                trackColor={{ false: '#767577', true: colors.primaryLight }}
                thumbColor={settings.iftarEnabled ? colors.primary : '#f4f3f4'}
                disabled={!isPermissionGranted}
              />
            </View>
            
            <View
              style={[
                styles.settingItem,
                { backgroundColor: isDarkMode ? colors.background : colors.white },
              ]}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={24} color={colors.primary} />
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>
                  Sahur Bildirimleri
                </Text>
              </View>
              <Switch
                value={settings.sahurEnabled}
                onValueChange={(value) => updateSettings({ sahurEnabled: value })}
                trackColor={{ false: '#767577', true: colors.primaryLight }}
                thumbColor={settings.sahurEnabled ? colors.primary : '#f4f3f4'}
                disabled={!isPermissionGranted}
              />
            </View>
            <View
              style={[
                styles.settingItem,
                { backgroundColor: isDarkMode ? colors.background : colors.white },
              ]}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={24} color={colors.primary} />
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>
                  Günün Mesajı Bildirimleri
                </Text>
              </View>
              <Switch
                value={settings.dailyQuoteEnabled}
                onValueChange={(value) => updateSettings({ dailyQuoteEnabled: value })}
                trackColor={{ false: '#767577', true: colors.primaryLight }}
                thumbColor={settings.dailyQuoteEnabled ? colors.primary : '#f4f3f4'}
                disabled={!isPermissionGranted}
              />
            </View>
            
            {!isPermissionGranted && (
              <Text
                style={[
                  styles.permissionWarning,
                  { color: colors.error },
                ]}
              >
                Bildirim izinleri verilmedi. Bildirimleri etkinleştirmek için lütfen cihaz ayarlarınızı kontrol edin.
              </Text>
            )}
          </View>
          
          {/* Diğer Ayarlar */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Diğer
            </Text>
            
            <TouchableOpacity
              style={[
                styles.settingItem,
                { backgroundColor: isDarkMode ? colors.background : colors.white },
              ]}
              onPress={handleClearData}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="trash-outline" size={24} color={colors.error} />
                <Text style={[styles.settingText, { color: colors.error }]}>
                  Tüm Verileri Temizle
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          
          {/* Uygulama Bilgileri */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Uygulama Hakkında
            </Text>
            
            <View
              style={[
                styles.settingItem,
                { backgroundColor: isDarkMode ? colors.background : colors.white },
              ]}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="information-circle" size={24} color={colors.primary} />
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>
                  Versiyon
                </Text>
              </View>
              <Text style={[styles.versionText, { color: colors.textSecondary }]}>
                1.0.0
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <CityPickerModal
        visible={cityPickerVisible}
        onClose={() => setCityPickerVisible(false)}
        onSelectCity={setSelectedCity}
        selectedCity={selectedCity}
      />
    </>
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  versionText: {
    fontSize: 14,
  },
  permissionWarning: {
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 8,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 16,
    marginRight: 8,
  },
});
