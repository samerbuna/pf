import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function TypeDetailsScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold capitalize">{type}</Text>
    </View>
  );
}
