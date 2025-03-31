import React from 'react';
import { Image, Text, View, Pressable } from 'react-native';
import { Animal } from '@/hooks/usePetfinder';
import { PlaceholderImage } from './PlaceholderImage';
import { ThemedText } from './ThemedText';

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
          <PlaceholderImage testID={`placeholder-image-${animal.id}`} />
        )}
      </View>
      <View className="p-4">
        <Text
          testID={`animal-name-${animal.id}`}
          className="text-lg font-semibold mb-2"
        >
          {animal.name}
        </Text>
        <View className="flex-row justify-between items-center py-3">
          <View className="bg-blue-100 px-3 py-1.5 rounded-full">
            <ThemedText
              testID={`animal-breed-${animal.id}`}
              className="text-sm text-blue-800"
            >
              {animal.breeds.primary}
            </ThemedText>
          </View>
          <View className="flex-row gap-2">
            <View className="bg-pink-100 px-3 py-1.5 rounded-full">
              <ThemedText
                testID={`animal-gender-${animal.id}`}
                className="text-sm text-pink-800"
              >
                {animal.gender}
              </ThemedText>
            </View>
            <View className="bg-green-100 px-3 py-1.5 rounded-full">
              <ThemedText
                testID={`animal-age-${animal.id}`}
                className="text-sm text-green-800"
              >
                {animal.age}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
