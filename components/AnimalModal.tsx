import React from 'react';
import { View, Text, Image, Modal, ScrollView, Pressable } from 'react-native';
import { Animal } from '@/hooks/usePetfinder';
import { PlaceholderImage } from './PlaceholderImage';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '@/hooks/useFavorites';

interface AnimalModalProps {
  animal: Animal;
  visible: boolean;
  onClose: () => void;
}

export function AnimalModal({ animal, visible, onClose }: AnimalModalProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isAnimalFavorite = isFavorite(animal.id);

  const photoUrl =
    animal.photos[0]?.large ??
    animal.photos[0]?.medium ??
    animal.photos[0]?.full;

  const handleFavoritePress = async () => {
    if (isAnimalFavorite) {
      await removeFavorite(animal.id);
    } else {
      await addFavorite(animal);
    }
  };

  const renderInfoSection = (title: string, children: React.ReactNode) => {
    if (!children) return null;
    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-gray-800">
          {title}
        </Text>
        <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          {children}
        </View>
      </View>
    );
  };

  const renderTag = (
    text: string,
    color: string = 'bg-blue-100 text-blue-800'
  ) => {
    if (!text) return null;
    return (
      <View className={`${color} px-3 py-1 rounded-full mr-2 mb-2`}>
        <Text className="text-sm font-medium">{text}</Text>
      </View>
    );
  };

  const renderHealthCareTags = () => {
    const tags = [];
    if (animal.attributes.spayed_neutered) tags.push('Spayed/Neutered');
    if (animal.attributes.house_trained) tags.push('House Trained');
    if (animal.attributes.shots_current) tags.push('Shots Current');
    if (animal.attributes.special_needs) tags.push('Special Needs');
    if (animal.attributes.declawed) tags.push('Declawed');

    if (tags.length === 0) return null;

    return (
      <View className="flex-row flex-wrap">
        {tags.map((tag) => (
          <View key={tag} className="mr-2 mb-2">
            {renderTag(tag, 'bg-green-100 text-green-800')}
          </View>
        ))}
      </View>
    );
  };

  const renderEnvironmentTags = () => {
    const tags = [];
    if (animal.environment.children) tags.push('Good with Children');
    if (animal.environment.dogs) tags.push('Good with Dogs');
    if (animal.environment.cats) tags.push('Good with Cats');

    if (tags.length === 0) return null;

    return (
      <View className="flex-row flex-wrap">
        {tags.map((tag) => (
          <View key={tag} className="mr-2 mb-2">
            {renderTag(tag, 'bg-purple-100 text-purple-800')}
          </View>
        ))}
      </View>
    );
  };

  const renderBasicInfoTags = () => {
    const tags = [];
    if (animal.type)
      tags.push({ text: animal.type, color: 'bg-indigo-100 text-indigo-800' });
    if (animal.breeds.primary)
      tags.push({
        text: animal.breeds.primary,
        color: 'bg-blue-100 text-blue-800',
      });
    if (animal.breeds.secondary)
      tags.push({
        text: animal.breeds.secondary,
        color: 'bg-blue-100 text-blue-800',
      });
    if (animal.gender)
      tags.push({ text: animal.gender, color: 'bg-pink-100 text-pink-800' });
    if (animal.age)
      tags.push({ text: animal.age, color: 'bg-yellow-100 text-yellow-800' });
    if (animal.size)
      tags.push({ text: animal.size, color: 'bg-orange-100 text-orange-800' });
    if (animal.colors.primary)
      tags.push({
        text: animal.colors.primary,
        color: 'bg-red-100 text-red-800',
      });
    if (animal.colors.secondary)
      tags.push({
        text: animal.colors.secondary,
        color: 'bg-red-100 text-red-800',
      });

    if (tags.length === 0) return null;

    return (
      <View className="flex-row flex-wrap mb-6">
        {tags.map((tag) => (
          <View key={tag.text} className="mr-2 mb-2">
            {renderTag(tag.text, tag.color)}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">{animal.name}</Text>
          <Pressable
            onPress={onClose}
            className="p-2 rounded-full bg-gray-100"
            testID="close-modal-button"
          >
            <Ionicons name="close" size={24} color="#374151" />
          </Pressable>
        </View>

        <ScrollView className="flex-1">
          {/* Main Image */}
          <View className="w-full aspect-[4/3] bg-gray-100 items-center justify-center">
            {animal.photos.length === 0 ? (
              <PlaceholderImage testID="placeholder-image" />
            ) : (
              <Image source={{ uri: photoUrl }} className="w-full h-64" />
            )}
          </View>

          {/* Favorite Button */}
          <View className="px-4 py-2">
            <Pressable
              onPress={handleFavoritePress}
              className={`flex-row items-center justify-center rounded-lg p-3 shadow-sm ${
                isAnimalFavorite
                  ? 'bg-rose-50 border border-rose-200'
                  : 'bg-white border border-gray-200'
              }`}
              testID="favorite-button"
            >
              <Ionicons
                name={isAnimalFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isAnimalFavorite ? '#e11d48' : '#6b7280'}
                style={{ marginRight: 8 }}
              />
              <Text
                className={`text-base font-medium ${
                  isAnimalFavorite ? 'text-rose-600' : 'text-gray-600'
                }`}
              >
                {isAnimalFavorite ? 'Unfavorite' : 'Favorite'}
              </Text>
            </Pressable>
          </View>

          <View className="p-4">
            {/* Basic Info Tags */}
            {renderBasicInfoTags()}

            {/* Description */}
            {animal.description && (
              <View className="mb-6">
                <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <Text className="text-gray-900 leading-relaxed">
                    {animal.description}
                  </Text>
                </View>
              </View>
            )}

            {/* Health & Care */}
            {renderInfoSection('Health & Care', renderHealthCareTags())}

            {/* Environment */}
            {renderInfoSection('Environment', renderEnvironmentTags())}

            {/* Contact */}
            {animal.organization &&
              renderInfoSection(
                'Contact Information',
                <View className="space-y-3">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-600">Organization</Text>
                    <Text className="font-medium text-gray-900">
                      {animal.organization.name || 'Not available'}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-600">Location</Text>
                    <Text className="font-medium text-gray-900">
                      {animal.organization.address
                        ? `${animal.organization.address.city || 'N/A'}, ${
                            animal.organization.address.state || 'N/A'
                          }`
                        : 'Not available'}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-600">Phone</Text>
                    <Text className="font-medium text-gray-900">
                      {animal.organization.phone || 'Not available'}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-600">Email</Text>
                    <Text className="font-medium text-gray-900">
                      {animal.organization.email || 'Not available'}
                    </Text>
                  </View>
                </View>
              )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
