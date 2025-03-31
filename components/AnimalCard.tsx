import React from 'react';
import { Image, Text, View, Pressable } from 'react-native';
import { Animal } from '@/hooks/usePetfinder';
import { router } from 'expo-router';

interface AnimalCardProps {
  animal: Animal;
  onPress: (animal: Animal) => void;
}

export function AnimalCard({ animal, onPress }: AnimalCardProps) {
  const photoUrl = animal.photos[0]?.medium;

  return (
    <Pressable
      testID={`animal-card-${animal.id}`}
      onPress={() => onPress(animal)}
      className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
    >
      <View className="w-full h-48">
        {photoUrl ? (
          <Image
            testID={`animal-image-${animal.id}`}
            source={{ uri: photoUrl }}
            className="w-full h-full"
            style={{ width: '100%', height: 192 }}
            resizeMode="cover"
            onError={(e) =>
              console.log('Image loading error:', e.nativeEvent.error)
            }
          />
        ) : (
          <View
            testID={`animal-image-placeholder-${animal.id}`}
            className="w-full h-full bg-gray-200 items-center justify-center"
          >
            <Text className="text-gray-400">No image available</Text>
          </View>
        )}
      </View>
      <View className="p-4">
        <Text
          testID={`animal-name-${animal.id}`}
          className="text-lg font-semibold mb-1"
        >
          {animal.name}
        </Text>
        <Text
          testID={`animal-breed-${animal.id}`}
          className="text-gray-600 mb-2"
        >
          {animal.breeds.primary}
          {animal.breeds.secondary && ` / ${animal.breeds.secondary}`}
        </Text>
        <Text testID={`animal-details-${animal.id}`} className="text-gray-500">
          {animal.age} • {animal.gender} • {animal.size}
        </Text>
      </View>
    </Pressable>
  );
}
