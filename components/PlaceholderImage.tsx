import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PlaceholderImageProps {
  testID?: string;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  testID,
}) => {
  return (
    <View
      testID={testID}
      className="w-full h-full bg-gray-200 items-center justify-center"
    >
      <MaterialCommunityIcons name="paw" size={48} color="#9ca3af" />
      <Text className="text-gray-400 mt-2">No image available</Text>
    </View>
  );
};
