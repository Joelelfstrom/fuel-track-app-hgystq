
import { StyleSheet, ViewStyle, TextStyle, useColorScheme } from 'react-native';

export const lightColors = {
  background: '#F5F5F5',
  backgroundSecondary: '#FFFFFF',
  text: '#1E1E1E',
  textSecondary: '#6B6B6B',
  primary: '#00D9FF',
  secondary: '#E89BA7',
  accent: '#FFB800',
  card: '#FFFFFF',
  cardDark: '#F0F0F0',
  border: '#E0E0E0',
  error: '#FF5252',
  success: '#4CAF50',
};

export const darkColors = {
  background: '#1E1E1E',
  backgroundSecondary: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  primary: '#00D9FF',
  secondary: '#E89BA7',
  accent: '#FFB800',
  card: '#2A2A2A',
  cardDark: '#353535',
  border: '#3A3A3A',
  error: '#FF5252',
  success: '#4CAF50',
};

// Default to dark colors for now
export const colors = darkColors;

export const getColors = (isDark: boolean) => isDark ? darkColors : lightColors;

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});
