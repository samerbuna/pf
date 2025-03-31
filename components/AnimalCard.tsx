import React from 'react';
import { Image, Text, View, Pressable } from 'react-native';
import { Animal } from '@/hooks/usePetfinder';
import { router } from 'expo-router';
import { PlaceholderImage } from './PlaceholderImage';

interface AnimalCardProps {
  animal: Animal;
  onPress: (animal: Animal) => void;
}

export function AnimalCard({ animal, onPress }: AnimalCardProps) {
  const photoUrl =
    animal.photos[0]?.medium ??
    animal.photos[0]?.small ??
    animal.photos[0]?.full;

  return (
    <Pressable
      testID={`animal-card-${animal.id}`}
      onPress={() => onPress(animal)}
      className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden"
      style={{
        borderWidth: 1,
        borderColor: '#f3f4f6',
      }}
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
          <PlaceholderImage />
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
