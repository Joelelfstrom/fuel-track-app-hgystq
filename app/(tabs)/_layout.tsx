
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
      name: '(home)',
      route: '/(tabs)/(home)',
      icon: 'fuelpump.fill',
      label: 'Home',
    },
    {
      name: 'fuelEntry',
      route: '/(tabs)/fuelEntry',
      icon: 'plus.circle.fill',
      label: 'Add Fuel',
    },
    {
      name: 'statistics',
      route: '/(tabs)/statistics',
      icon: 'chart.pie.fill',
      label: 'Statistics',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="fuelpump.fill" drawable="ic_fuel" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="fuelEntry">
          <Icon sf="plus.circle.fill" drawable="ic_add" />
          <Label>Add Fuel</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="statistics">
          <Icon sf="chart.pie.fill" drawable="ic_stats" />
          <Label>Statistics</Label>
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
        <Stack.Screen name="(home)" />
        <Stack.Screen name="fuelEntry" />
        <Stack.Screen name="statistics" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
