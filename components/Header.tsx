import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export function Header() {
  return (
    <View className="bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="paw" size={24} color="#4f46e5" />
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
            name="heart-outline"
            size={24}
            color="#4f46e5"
          />
        </Pressable>
      </View>
    </View>
  );
}
