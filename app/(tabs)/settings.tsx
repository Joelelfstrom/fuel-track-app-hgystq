
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { getSettings, saveSettings } from '@/utils/storage';
import { AppSettings } from '@/types/fuel';
import { getTranslation } from '@/utils/translations';
import { IconSymbol } from '@/components/IconSymbol';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
];

const UNITS = [
  { code: 'liters', name: 'Liters', symbol: 'L' },
  { code: 'gallons', name: 'Gallons', symbol: 'gal' },
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    currency: 'USD',
    unit: 'liters',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = await getSettings();
    setSettings(loadedSettings);
  };

  const t = (key: string) => getTranslation(settings.language, key);

  const handleLanguageChange = async (language: 'en' | 'es' | 'fr' | 'de') => {
    const newSettings = { ...settings, language };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleCurrencyChange = async (currency: string) => {
    const newSettings = { ...settings, currency };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleUnitChange = async (unit: 'liters' | 'gallons') => {
    const newSettings = { ...settings, unit };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('settings'),
          headerShown: Platform.OS === 'ios',
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <IconSymbol name="gearshape.fill" size={48} color={colors.primary} />
            <Text style={styles.headerTitle}>{t('settings')}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="globe" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>{t('language')}</Text>
            </View>
            <View style={styles.optionsContainer}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.optionButton,
                    settings.language === lang.code && styles.optionButtonActive,
                  ]}
                  onPress={() => handleLanguageChange(lang.code as any)}
                >
                  <Text style={styles.optionFlag}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.optionText,
                      settings.language === lang.code && styles.optionTextActive,
                    ]}
                  >
                    {lang.name}
                  </Text>
                  {settings.language === lang.code && (
                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.card} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="dollarsign.circle.fill" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>{t('currency')}</Text>
            </View>
            <View style={styles.optionsContainer}>
              {CURRENCIES.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.optionButton,
                    settings.currency === curr.code && styles.optionButtonActive,
                  ]}
                  onPress={() => handleCurrencyChange(curr.code)}
                >
                  <Text style={styles.optionSymbol}>{curr.symbol}</Text>
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionText,
                        settings.currency === curr.code && styles.optionTextActive,
                      ]}
                    >
                      {curr.name}
                    </Text>
                    <Text
                      style={[
                        styles.optionSubtext,
                        settings.currency === curr.code && styles.optionSubtextActive,
                      ]}
                    >
                      {curr.code}
                    </Text>
                  </View>
                  {settings.currency === curr.code && (
                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.card} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="fuelpump.fill" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>{t('unit')}</Text>
            </View>
            <View style={styles.optionsContainer}>
              {UNITS.map((unit) => (
                <TouchableOpacity
                  key={unit.code}
                  style={[
                    styles.optionButton,
                    settings.unit === unit.code && styles.optionButtonActive,
                  ]}
                  onPress={() => handleUnitChange(unit.code as any)}
                >
                  <Text style={styles.optionSymbol}>{unit.symbol}</Text>
                  <Text
                    style={[
                      styles.optionText,
                      settings.unit === unit.code && styles.optionTextActive,
                    ]}
                  >
                    {unit.name}
                  </Text>
                  {settings.unit === unit.code && (
                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.card} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  optionSymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 12,
    width: 30,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  optionTextActive: {
    color: colors.card,
  },
  optionSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  optionSubtextActive: {
    color: colors.card,
    opacity: 0.8,
  },
});
