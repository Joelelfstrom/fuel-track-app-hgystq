
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, commonStyles } from '@/styles/commonStyles';
import { saveFuelEntry, getSettings } from '@/utils/storage';
import { FuelEntry, AppSettings } from '@/types/fuel';
import { getTranslation } from '@/utils/translations';
import { IconSymbol } from '@/components/IconSymbol';

export default function FuelEntryScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    currency: 'USD',
    unit: 'liters',
  });
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cost, setCost] = useState('');
  const [amount, setAmount] = useState('');
  const [odometer, setOdometer] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = await getSettings();
    setSettings(loadedSettings);
  };

  const t = (key: string) => getTranslation(settings.language, key);

  const handleSave = async () => {
    if (!cost || !amount) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    const costNum = parseFloat(cost);
    const amountNum = parseFloat(amount);

    if (isNaN(costNum) || isNaN(amountNum) || costNum <= 0 || amountNum <= 0) {
      Alert.alert(t('error'), t('invalidAmount'));
      return;
    }

    const entry: FuelEntry = {
      id: Date.now().toString(),
      date: date.toISOString(),
      cost: costNum,
      amount: amountNum,
      pricePerUnit: costNum / amountNum,
      odometer: odometer ? parseFloat(odometer) : undefined,
      notes: notes || undefined,
    };

    try {
      await saveFuelEntry(entry);
      Alert.alert(t('entrySaved'));
      
      // Reset form
      setCost('');
      setAmount('');
      setOdometer('');
      setNotes('');
      setDate(new Date());
    } catch (error) {
      Alert.alert(t('error'), String(error));
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('addFuelEntry'),
          headerShown: Platform.OS === 'ios',
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <IconSymbol name="fuelpump.fill" size={48} color={colors.primary} />
            <Text style={styles.headerTitle}>{t('addFuelEntry')}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>{t('date')}</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <IconSymbol name="calendar" size={20} color={colors.primary} />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>{t('cost')} ({settings.currency})</Text>
            <TextInput
              style={styles.input}
              value={cost}
              onChangeText={setCost}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              {t('amount')} ({settings.unit === 'liters' ? 'L' : 'gal'})
            </Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {cost && amount && parseFloat(cost) > 0 && parseFloat(amount) > 0 && (
            <View style={[styles.card, styles.priceCard]}>
              <Text style={styles.priceLabel}>{t('averagePrice')}</Text>
              <Text style={styles.priceValue}>
                {(parseFloat(cost) / parseFloat(amount)).toFixed(3)} {settings.currency}/
                {settings.unit === 'liters' ? 'L' : 'gal'}
              </Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.label}>{t('odometer')}</Text>
            <TextInput
              style={styles.input}
              value={odometer}
              onChangeText={setOdometer}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>{t('notes')}</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('notes')}
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.card} />
            <Text style={styles.saveButtonText}>{t('save')}</Text>
          </TouchableOpacity>
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
    marginBottom: 24,
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  priceCard: {
    backgroundColor: colors.highlight,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(41, 98, 255, 0.3)',
    elevation: 5,
  },
  saveButtonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
