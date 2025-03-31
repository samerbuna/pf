import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useAnimals, Animal } from '@/hooks/usePetfinder';
import { AnimalCard } from '@/components/AnimalCard';
import { router } from 'expo-router';

export default function HomeScreen() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useAnimals();

  const handleAnimalPress = (animal: Animal) => {
    // We'll implement this later when we create the detail screen
    console.log('Animal pressed:', animal.id);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator
          testID="loading-indicator"
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center mb-2">
          Error: {error.message}
        </Text>
        <Text className="text-gray-500 text-center">
          Please check your internet connection and try again.
        </Text>
      </View>
    );
  }

  if (!data?.pages[0]?.animals.length) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-gray-500 text-center">No animals found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        testID="animals-list"
        data={data.pages.flatMap((page) => page.animals)}
        renderItem={({ item }) => (
          <AnimalCard animal={item} onPress={handleAnimalPress} />
        )}
        keyExtractor={(item) => `${item.id}-${item.published_at}`}
        contentContainerClassName="p-4"
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
    </View>
  );
}
