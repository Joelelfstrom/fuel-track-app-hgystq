
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FuelEntry, AppSettings } from '@/types/fuel';

const FUEL_ENTRIES_KEY = '@fuel_entries';
const SETTINGS_KEY = '@app_settings';

export const defaultSettings: AppSettings = {
  language: 'en',
  currency: 'USD',
  unit: 'liters',
};

// Fuel Entries
export const saveFuelEntry = async (entry: FuelEntry): Promise<void> => {
  try {
    const entries = await getFuelEntries();
    entries.push(entry);
    await AsyncStorage.setItem(FUEL_ENTRIES_KEY, JSON.stringify(entries));
    console.log('Fuel entry saved:', entry);
  } catch (error) {
    console.error('Error saving fuel entry:', error);
    throw error;
  }
};

export const getFuelEntries = async (): Promise<FuelEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(FUEL_ENTRIES_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error getting fuel entries:', error);
    return [];
  }
};

export const deleteFuelEntry = async (id: string): Promise<void> => {
  try {
    const entries = await getFuelEntries();
    const filtered = entries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(FUEL_ENTRIES_KEY, JSON.stringify(filtered));
    console.log('Fuel entry deleted:', id);
  } catch (error) {
    console.error('Error deleting fuel entry:', error);
    throw error;
  }
};

export const updateFuelEntry = async (updatedEntry: FuelEntry): Promise<void> => {
  try {
    const entries = await getFuelEntries();
    const index = entries.findIndex(entry => entry.id === updatedEntry.id);
    if (index !== -1) {
      entries[index] = updatedEntry;
      await AsyncStorage.setItem(FUEL_ENTRIES_KEY, JSON.stringify(entries));
      console.log('Fuel entry updated:', updatedEntry);
    }
  } catch (error) {
    console.error('Error updating fuel entry:', error);
    throw error;
  }
};

// Settings
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    console.log('Settings saved:', settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return defaultSettings;
  } catch (error) {
    console.error('Error getting settings:', error);
    return defaultSettings;
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FUEL_ENTRIES_KEY);
    console.log('All fuel entries cleared');
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
