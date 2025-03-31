import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useAnimalTypes } from '@/hooks/usePetfinder';
import { AnimalType } from '@/hooks/usePetfinder';

interface TypeDetailsProps {
  label: string;
  items: string[];
}

function TypeDetails({ label, items }: TypeDetailsProps) {
  if (!items.length) return null;

  return (
    <View className="mt-2">
      <Text className="text-gray-500 font-medium">{label}:</Text>
      <Text className="text-gray-600 mt-1">{items.join(', ')}</Text>
    </View>
  );
}

interface TypeCardProps {
  type: AnimalType;
}

function TypeCard({ type }: TypeCardProps) {
  return (
    <View className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden mx-4">
      <View className="p-4">
        <Text className="text-lg font-semibold text-gray-900">{type.name}</Text>
        <TypeDetails label="Coats" items={type.coats} />
        <TypeDetails label="Colors" items={type.colors} />
        <TypeDetails label="Genders" items={type.genders} />
      </View>
    </View>
  );
}

export default function TypesScreen() {
  const { data: types, isLoading, error } = useAnimalTypes();

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

  if (!types?.length) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-gray-500 text-center">
          No animal types found.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={types}
        renderItem={({ item }) => <TypeCard type={item} />}
        keyExtractor={(item) => item.name}
        contentContainerClassName="py-4"
      />
    </View>
  );
}
