import React, { useState } from 'react';
import { Image, Text, View, Pressable } from 'react-native';
import { Animal } from '@/hooks/usePetfinder';
import { PlaceholderImage } from './PlaceholderImage';
import { AnimalModal } from './AnimalModal';

interface TagProps {
  text: string;
  color: string;
  testID?: string;
}

// Update TAG_COLORS to ensure text colors work on iOS
const TAG_COLORS = {
  breed: 'bg-blue-100 text-blue-800',
  gender: 'bg-pink-100 text-pink-800',
  age: 'bg-green-100 text-green-800',
} as const;

function Tag({ text, color, testID }: TagProps) {
  // Split the color classes to handle background and text separately
  const [bgColor, textColor] = color.split(' ');

  return (
    <View className={`${bgColor} px-3 py-1.5 rounded-full`} testID={testID}>
      <Text className={`text-sm font-medium ${textColor}`}>{text}</Text>
    </View>
  );
}

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const photoUrl = animal.photos[0]?.medium;

  const handlePress = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <Pressable
        testID={`animal-card-${animal.id}`}
        onPress={handlePress}
        className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden border border-gray-100"
      >
        <View className="w-full aspect-[4/3] bg-gray-200 items-center justify-center">
          {photoUrl ? (
            <Image
              testID={`animal-image-${animal.id}`}
              source={{ uri: photoUrl }}
              className="w-full h-full"
              resizeMode="cover"
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
            <Tag
              text={animal.breeds.primary}
              color={TAG_COLORS.breed}
              testID={`animal-breed-${animal.id}`}
            />
            <View className="flex-row gap-2">
              <Tag
                text={animal.gender}
                color={TAG_COLORS.gender}
                testID={`animal-gender-${animal.id}`}
              />
              <Tag
                text={animal.age}
                color={TAG_COLORS.age}
                testID={`animal-age-${animal.id}`}
              />
            </View>
          </View>
        </View>
      </Pressable>

      <AnimalModal
        animal={animal}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}
