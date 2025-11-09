
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: 'fuelEntry',
      route: '/(tabs)/fuelEntry',
      icon: 'fuelpump.fill',
      label: 'Add Fuel',
    },
    {
      name: 'statistics',
      route: '/(tabs)/statistics',
      icon: 'chart.bar.fill',
      label: 'Statistics',
    },
    {
      name: 'settings',
      route: '/(tabs)/settings',
      icon: 'gearshape.fill',
      label: 'Settings',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="fuelEntry">
          <Icon sf="fuelpump.fill" drawable="ic_fuel" />
          <Label>Add Fuel</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="statistics">
          <Icon sf="chart.bar.fill" drawable="ic_stats" />
          <Label>Statistics</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <Icon sf="gearshape.fill" drawable="ic_settings" />
          <Label>Settings</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="fuelEntry" />
        <Stack.Screen name="statistics" />
        <Stack.Screen name="settings" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
