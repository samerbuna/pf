import React from 'react';
import { Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useFavorites } from '@/hooks/useFavorites';
import { AnimalCard } from '@/components/AnimalCard';

export default function FavoritesScreen() {
  const { favorites, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator
          testID="loading-indicator"
          size="large"
          color="#4f46e5"
        />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-xl font-bold text-gray-900 mb-2">
          No Favorites
        </Text>
        <Text className="text-gray-500 text-center">
          You haven't added any pets to your favorites yet.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        testID="favorites-list"
        data={favorites}
        renderItem={({ item }) => <AnimalCard animal={item} />}
        keyExtractor={(item) => `${item.id}-${item.published_at}`}
        contentContainerClassName="p-4"
      />
    </View>
  );
}
