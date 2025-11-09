
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
  useColorScheme,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getColors } from '@/styles/commonStyles';
import { saveFuelEntry, getSettings, getFuelEntries, updateFuelEntry } from '@/utils/storage';
import { FuelEntry, AppSettings } from '@/types/fuel';
import { getTranslation } from '@/utils/translations';
import { IconSymbol } from '@/components/IconSymbol';

export default function FuelEntryScreen() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark');
  const params = useLocalSearchParams();
  const router = useRouter();
  const entryId = params.entryId as string | undefined;
  
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadSettings();
    if (entryId) {
      loadEntry(entryId);
    }
  }, [entryId]);

  const loadSettings = async () => {
    const loadedSettings = await getSettings();
    setSettings(loadedSettings);
  };

  const loadEntry = async (id: string) => {
    const entries = await getFuelEntries();
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setIsEditing(true);
      setDate(new Date(entry.date));
      setCost(entry.cost.toString());
      setAmount(entry.amount.toString());
      setOdometer(entry.odometer?.toString() || '');
      setNotes(entry.notes || '');
    }
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
      id: isEditing ? entryId! : Date.now().toString(),
      date: date.toISOString(),
      cost: costNum,
      amount: amountNum,
      pricePerUnit: costNum / amountNum,
      odometer: odometer ? parseFloat(odometer) : undefined,
      notes: notes || undefined,
    };

    try {
      if (isEditing) {
        await updateFuelEntry(entry);
        Alert.alert(t('success'), t('entryUpdated'), [
          { text: t('ok'), onPress: () => router.back() }
        ]);
      } else {
        await saveFuelEntry(entry);
        Alert.alert(t('success'), t('entrySaved'));
        
        // Reset form
        setCost('');
        setAmount('');
        setOdometer('');
        setNotes('');
        setDate(new Date());
      }
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
          title: isEditing ? t('editEntry') : t('addFuelEntry'),
          headerShown: Platform.OS === 'ios',
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="fuelpump.fill" size={56} color={colors.primary} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {isEditing ? t('editEntry') : t('addFuelEntry')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Track your fuel purchase details for better insights
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Purchase Details</Text>

          <View style={styles.rowContainer}>
            <View style={[styles.halfCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('cost')} ({settings.currency}) *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text }]}
                value={cost}
                onChangeText={setCost}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={[styles.halfCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.label, { color: colors.text }]}>
                {settings.unit === 'liters' ? 'Liters' : 'Gallons'} *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          {cost && amount && parseFloat(cost) > 0 && parseFloat(amount) > 0 && (
            <View style={[styles.card, styles.priceCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Price per Liter</Text>
                <Text style={[styles.priceValue, { color: colors.text }]}>
                  $ Calculated automatically
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.label, { color: colors.text }]}>{t('date')}</Text>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
              onPress={() => setShowDatePicker(true)}
            >
              <IconSymbol name="calendar" size={20} color={colors.text} />
              <Text style={[styles.dateText, { color: colors.text }]}>
                {date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </Text>
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

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.label, { color: colors.text }]}>{t('odometer')} (Optional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text }]}
              value={odometer}
              onChangeText={setOdometer}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.label, { color: colors.text }]}>{t('notes')} (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.text }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
            <IconSymbol name="checkmark.circle.fill" size={24} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>{isEditing ? t('update') : t('save')}</Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: colors.card, borderColor: colors.border }]} 
              onPress={() => router.back()}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>{t('cancel')}</Text>
            </TouchableOpacity>
          )}
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
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  halfCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    gap: 12,
  },
  dateText: {
    fontSize: 16,
  },
  priceCard: {
    borderWidth: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    boxShadow: '0px 4px 12px rgba(0, 217, 255, 0.3)',
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    borderRadius: 16,
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
