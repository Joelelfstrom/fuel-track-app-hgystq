
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
import { Stack } from 'expo-router';
import { getColors } from '@/styles/commonStyles';
import { getFuelEntries, getSettings } from '@/utils/storage';
import { FuelEntry, AppSettings } from '@/types/fuel';
import { getTranslation } from '@/utils/translations';
import {
  calculateMonthlyStats,
  calculateYearlyStats,
  formatCurrency,
  formatAmount,
  formatMonthYear,
} from '@/utils/statistics';
import { IconSymbol } from '@/components/IconSymbol';
import { useFocusEffect } from '@react-navigation/native';

export default function StatisticsScreen() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark');
  
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    currency: 'USD',
    unit: 'liters',
  });
  const [entries, setEntries] = useState<FuelEntry[]>([]);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

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
  };

  const t = (key: string) => getTranslation(settings.language, key);

  const monthlyStats = calculateMonthlyStats(entries);
  const yearlyStats = calculateYearlyStats(entries);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="chart.bar.xaxis" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('noData')}</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('addFirstEntry')}</Text>
    </View>
  );

  const renderMonthlyStats = () => (
    <View>
      {monthlyStats.map((stat, index) => (
        <View key={stat.month} style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={styles.statHeader}>
            <Text style={[styles.statMonth, { color: colors.text }]}>{formatMonthYear(stat.month)}</Text>
            <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {stat.entryCount} {t('entries')}
              </Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="dollarsign.circle.fill" size={24} color={colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('totalCost')}</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatCurrency(stat.totalCost, settings.currency)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
                <IconSymbol name="fuelpump.fill" size={24} color={colors.secondary} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('totalAmount')}</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatAmount(stat.totalAmount, settings.unit)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={colors.accent} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('averagePrice')}</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatCurrency(stat.averagePricePerUnit, settings.currency)}/
                  {settings.unit === 'liters' ? 'L' : 'gal'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderYearlyStats = () => (
    <View>
      {yearlyStats.map((stat) => (
        <View key={stat.year} style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={styles.statHeader}>
            <Text style={[styles.statYear, { color: colors.text }]}>{stat.year}</Text>
            <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {stat.entryCount} {t('entries')}
              </Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="dollarsign.circle.fill" size={24} color={colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('totalCost')}</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatCurrency(stat.totalCost, settings.currency)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
                <IconSymbol name="fuelpump.fill" size={24} color={colors.secondary} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('totalAmount')}</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatAmount(stat.totalAmount, settings.unit)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={colors.accent} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('averagePrice')}</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatCurrency(stat.averagePricePerUnit, settings.currency)}/
                  {settings.unit === 'liters' ? 'L' : 'gal'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t('statistics'),
          headerShown: Platform.OS === 'ios',
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              viewMode === 'monthly' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setViewMode('monthly')}
          >
            <Text
              style={[
                styles.toggleText,
                { color: colors.text },
                viewMode === 'monthly' && { color: '#FFFFFF' },
              ]}
            >
              {t('monthlyStats')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              viewMode === 'yearly' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setViewMode('yearly')}
          >
            <Text
              style={[
                styles.toggleText,
                { color: colors.text },
                viewMode === 'yearly' && { color: '#FFFFFF' },
              ]}
            >
              {t('yearlyStats')}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {entries.length === 0
            ? renderEmptyState()
            : viewMode === 'monthly'
            ? renderMonthlyStats()
            : renderYearlyStats()}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statMonth: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statYear: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statRow: {
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
