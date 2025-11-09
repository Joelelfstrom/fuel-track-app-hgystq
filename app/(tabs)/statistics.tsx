
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
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
      <Text style={styles.emptyTitle}>{t('noData')}</Text>
      <Text style={styles.emptyText}>{t('addFirstEntry')}</Text>
    </View>
  );

  const renderMonthlyStats = () => (
    <View>
      {monthlyStats.map((stat, index) => (
        <View key={stat.month} style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statMonth}>{formatMonthYear(stat.month)}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {stat.entryCount} {t('entries')}
              </Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol name="dollarsign.circle.fill" size={24} color={colors.primary} />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>{t('totalCost')}</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(stat.totalCost, settings.currency)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol name="fuelpump.fill" size={24} color={colors.secondary} />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>{t('totalAmount')}</Text>
                <Text style={styles.statValue}>
                  {formatAmount(stat.totalAmount, settings.unit)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={colors.accent} />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>{t('averagePrice')}</Text>
                <Text style={styles.statValue}>
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
        <View key={stat.year} style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statYear}>{stat.year}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {stat.entryCount} {t('entries')}
              </Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol name="dollarsign.circle.fill" size={24} color={colors.primary} />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>{t('totalCost')}</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(stat.totalCost, settings.currency)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol name="fuelpump.fill" size={24} color={colors.secondary} />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>{t('totalAmount')}</Text>
                <Text style={styles.statValue}>
                  {formatAmount(stat.totalAmount, settings.unit)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={colors.accent} />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>{t('averagePrice')}</Text>
                <Text style={styles.statValue}>
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
              viewMode === 'monthly' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('monthly')}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === 'monthly' && styles.toggleTextActive,
              ]}
            >
              {t('monthlyStats')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'yearly' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('yearly')}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === 'yearly' && styles.toggleTextActive,
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
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.card,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  toggleTextActive: {
    color: colors.card,
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
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  statRow: {
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    marginLeft: 12,
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
