import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

type PrayerTimeCardProps = {
  name: string;
  time: string;
  isNext?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
};

const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({
  name,
  time,
  isNext = false,
  iconName = 'time-outline',
}) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? colors.background : colors.white,
          borderColor: isNext ? colors.primary : colors.divider,
          borderWidth: isNext ? 2 : 1,
        },
      ]}
    >
      <View style={styles.leftContent}>
        <Ionicons
          name={iconName}
          size={24}
          color={isNext ? colors.primary : colors.textSecondary}
        />
        <Text
          style={[
            styles.prayerName,
            { color: isNext ? colors.primary : colors.textPrimary },
          ]}
        >
          {name}
        </Text>
      </View>
      <View style={styles.rightContent}>
        <Text
          style={[
            styles.prayerTime,
            { color: isNext ? colors.primary : colors.textPrimary },
          ]}
        >
          {time}
        </Text>
        {isNext && (
          <View style={[styles.nextBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.nextText}>Sıradaki</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default PrayerTimeCard;
