
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useColorScheme,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors, getColors } from '@/styles/commonStyles';
import { getFuelEntries, getSettings } from '@/utils/storage';
import { FuelEntry, AppSettings } from '@/types/fuel';
import { getTranslation } from '@/utils/translations';
import { formatCurrency, formatAmount, formatDate } from '@/utils/statistics';
import { IconSymbol } from '@/components/IconSymbol';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = getColors(colorScheme === 'dark');
  
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    currency: 'USD',
    unit: 'liters',
  });
  const [entries, setEntries] = useState<FuelEntry[]>([]);
  const [currentMonthStats, setCurrentMonthStats] = useState({
    totalCost: 0,
    totalAmount: 0,
    avgPerFill: 0,
    entryCount: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const loadedSettings = await getSettings();
    const loadedEntries = await getFuelEntries();
    setSettings(loadedSettings);
    setEntries(loadedEntries);
    calculateCurrentMonthStats(loadedEntries);
  };

  const calculateCurrentMonthStats = (allEntries: FuelEntry[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthEntries = allEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });

    const totalCost = monthEntries.reduce((sum, entry) => sum + entry.cost, 0);
    const totalAmount = monthEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const avgPerFill = monthEntries.length > 0 ? totalCost / monthEntries.length : 0;

    setCurrentMonthStats({
      totalCost,
      totalAmount,
      avgPerFill,
      entryCount: monthEntries.length,
    });
  };

  const t = (key: string) => getTranslation(settings.language, key);

  const getCurrentMonthYear = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const recentEntries = entries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.monthContainer}>
              <Text style={[styles.monthText, { color: themeColors.text }]}>
                {getCurrentMonthYear()}
              </Text>
              <IconSymbol name="calendar" size={20} color={themeColors.text} />
            </View>
            <TouchableOpacity
              style={[styles.settingsButton, { backgroundColor: themeColors.card }]}
              onPress={() => router.push('/(tabs)/settings')}
            >
              <IconSymbol name="gearshape.fill" size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>

          {/* Main Amount Display */}
          <View style={styles.mainAmountContainer}>
            <IconSymbol name="arrow.down" size={24} color={themeColors.textSecondary} />
            <Text style={[styles.mainAmount, { color: themeColors.primary }]}>
              {formatCurrency(currentMonthStats.totalCost, settings.currency).replace(/\.\d{2}$/, '')}
            </Text>
            <Text style={[styles.mainAmountLabel, { color: themeColors.text }]}>
              {t('spentOnFuelThisMonth')}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                {settings.unit === 'liters' ? t('totalLiters') : t('totalGallons')}
              </Text>
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {currentMonthStats.totalAmount.toFixed(1)}{settings.unit === 'liters' ? 'L' : 'gal'}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                {t('avgPerFill')}
              </Text>
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {formatCurrency(currentMonthStats.avgPerFill, settings.currency).replace(/\.\d{2}$/, '')}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                {t('totalEntries')}
              </Text>
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {currentMonthStats.entryCount}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Entries */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[styles.recentTitle, { color: themeColors.text }]}>
              {t('recentEntries')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/statistics')}>
              <Text style={[styles.viewAllText, { color: themeColors.secondary }]}>
                {t('viewAll')} →
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.entriesList}
            contentContainerStyle={styles.entriesListContent}
            showsVerticalScrollIndicator={false}
          >
            {recentEntries.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="fuelpump" size={48} color={themeColors.textSecondary} />
                <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
                  {t('noEntriesYet')}
                </Text>
              </View>
            ) : (
              recentEntries.map((entry) => (
                <View
                  key={entry.id}
                  style={[styles.entryCard, { backgroundColor: themeColors.card }]}
                >
                  <View style={[styles.entryIcon, { backgroundColor: themeColors.primary + '20' }]}>
                    <IconSymbol name="fuelpump.fill" size={24} color={themeColors.primary} />
                  </View>
                  <View style={styles.entryContent}>
                    <Text style={[styles.entryTitle, { color: themeColors.text }]}>
                      {entry.notes || t('fuelPurchase')}
                    </Text>
                    <View style={styles.entryDetails}>
                      <IconSymbol name="drop.fill" size={12} color={themeColors.textSecondary} />
                      <Text style={[styles.entryAmount, { color: themeColors.textSecondary }]}>
                        {entry.amount.toFixed(1)}{settings.unit === 'liters' ? 'L' : 'gal'}
                      </Text>
                      {entry.odometer && (
                        <>
                          <IconSymbol name="location.fill" size={12} color={themeColors.textSecondary} style={{ marginLeft: 8 }} />
                          <Text style={[styles.entryAmount, { color: themeColors.textSecondary }]}>
                            {entry.odometer} km
                          </Text>
                        </>
                      )}
                    </View>
                    <Text style={[styles.entryDate, { color: themeColors.textSecondary }]}>
                      {formatDate(entry.date)}
                    </Text>
                  </View>
                  <View style={styles.entryRight}>
                    <Text style={[styles.entryCost, { color: themeColors.primary }]}>
                      {formatCurrency(entry.cost, settings.currency).replace(/\.\d{2}$/, '')}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: themeColors.secondary }]}
          onPress={() => router.push('/(tabs)/fuelEntry')}
          activeOpacity={0.8}
        >
          <IconSymbol name="plus" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainAmountContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainAmount: {
    fontSize: 56,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  mainAmountLabel: {
    fontSize: 16,
    fontWeight: '400',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  recentSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  entriesList: {
    flex: 1,
  },
  entriesListContent: {
    paddingBottom: 120,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  entryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  entryContent: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  entryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  entryAmount: {
    fontSize: 12,
  },
  entryDate: {
    fontSize: 12,
  },
  entryRight: {
    alignItems: 'flex-end',
  },
  entryCost: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 16px rgba(232, 155, 167, 0.4)',
    elevation: 8,
  },
});
