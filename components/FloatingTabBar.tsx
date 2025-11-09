
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { BlurView } from 'expo-blur';
import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { getColors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 24,
  bottomMargin = 16,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark');

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const tabWidth = containerWidth / tabs.length;

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safeArea, { marginBottom: bottomMargin }]}
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 100}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={[
          styles.container,
          {
            width: containerWidth,
            borderRadius,
            backgroundColor: Platform.OS === 'ios' 
              ? 'transparent' 
              : colorScheme === 'dark'
                ? 'rgba(42, 42, 42, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
          },
        ]}
      >
        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => {
            const isActive = pathname.includes(tab.name);
            return (
              <TouchableOpacity
                key={tab.name}
                style={[styles.tab, { width: tabWidth }]}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={tab.icon as any}
                  size={24}
                  color={isActive ? colors.primary : colors.text}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: isActive ? colors.primary : colors.text,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tab: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});
