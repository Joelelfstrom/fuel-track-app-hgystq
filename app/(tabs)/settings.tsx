
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  useColorScheme,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { getColors } from '@/styles/commonStyles';
import { AppSettings } from '@/types/fuel';
import { getSettings, saveSettings, clearAllData } from '@/utils/storage';
import { getTranslation } from '@/utils/translations';

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Svenska', value: 'sv' },
];

const CURRENCIES = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'GBP (£)', value: 'GBP' },
  { label: 'JPY (¥)', value: 'JPY' },
  { label: 'CAD ($)', value: 'CAD' },
  { label: 'AUD ($)', value: 'AUD' },
  { label: 'SEK (kr)', value: 'SEK' },
];

const UNITS = [
  { label: 'Liters', value: 'liters' },
  { label: 'Gallons', value: 'gallons' },
];

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark');
  
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

  const handleLanguageChange = async (language: 'en' | 'es' | 'fr' | 'de' | 'sv') => {
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

  const handleEraseAllData = () => {
    Alert.alert(
      t('eraseAllData'),
      t('eraseAllDataWarning'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('eraseAll'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('confirmErase'),
              t('confirmEraseMessage'),
              [
                { text: t('cancel'), style: 'cancel' },
                {
                  text: t('eraseAll'),
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await clearAllData();
                      Alert.alert(t('success'), t('allDataErased'));
                    } catch (error) {
                      Alert.alert(t('error'), String(error));
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings')}</Text>
          </View>

          {/* Language Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</Text>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              {LANGUAGES.map((lang, index) => (
                <TouchableOpacity
                  key={lang.value}
                  style={[
                    styles.option,
                    index !== LANGUAGES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                  onPress={() => handleLanguageChange(lang.value as any)}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>{lang.label}</Text>
                  {settings.language === lang.value && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Currency Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('currency')}</Text>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              {CURRENCIES.map((curr, index) => (
                <TouchableOpacity
                  key={curr.value}
                  style={[
                    styles.option,
                    index !== CURRENCIES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                  onPress={() => handleCurrencyChange(curr.value)}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>{curr.label}</Text>
                  {settings.currency === curr.value && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Unit Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('unit')}</Text>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              {UNITS.map((unit, index) => (
                <TouchableOpacity
                  key={unit.value}
                  style={[
                    styles.option,
                    index !== UNITS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                  onPress={() => handleUnitChange(unit.value as any)}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>{unit.label}</Text>
                  {settings.unit === unit.value && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Data Management Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('dataManagement')}</Text>
            <TouchableOpacity
              style={[styles.dangerButton, { backgroundColor: colors.card, borderColor: '#FF3B30' }]}
              onPress={handleEraseAllData}
            >
              <IconSymbol name="trash.fill" size={24} color="#FF3B30" />
              <Text style={[styles.dangerButtonText, { color: '#FF3B30' }]}>{t('eraseAllData')}</Text>
            </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
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
    marginTop: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
