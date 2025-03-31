import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabBarBackground() {
  return <View className="absolute inset-0 bg-white" />;
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
