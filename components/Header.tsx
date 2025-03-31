import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFavorites } from '@/hooks/useFavorites';

export function Header() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const hasFavorites = favorites.length > 0;

  return (
    <View className="bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            testID="app-icon"
            name="paw"
            size={24}
            color="#4f46e5"
          />
          <Text className="text-xl font-semibold text-gray-900 ml-2">
            Pet Finder
          </Text>
        </View>
        <Pressable
          testID="favorites-button"
          onPress={() => router.push('/favorites')}
          className="p-2 rounded-full bg-gray-50"
        >
          <MaterialCommunityIcons
            testID="favorites-icon"
            name={hasFavorites ? 'heart' : 'heart-outline'}
            size={24}
            color="#4f46e5"
          />
        </Pressable>
      </View>
    </View>
  );
}
