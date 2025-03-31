import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnimalCard } from '@/components/AnimalCard';
import { Animal } from '@/hooks/usePetfinder';
import { FavoritesProvider } from '@/hooks/FavoritesProvider';

// Mock MaterialCommunityIcons and Ionicons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: () => 'MaterialCommunityIcons',
  Ionicons: () => 'Ionicons',
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }),
}));

// Mock the useFavorites hook
jest.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: jest.fn().mockReturnValue(false),
    addFavorite: jest.fn().mockResolvedValue(undefined),
    removeFavorite: jest.fn().mockResolvedValue(undefined),
  }),
}));

const mockAnimal: Animal = {
  id: 123,
  name: 'Buddy',
  type: 'Dog',
  breeds: {
    primary: 'Labrador',
    secondary: null,
  },
  colors: {
    primary: 'Black',
    secondary: null,
  },
  age: 'Young',
  gender: 'Male',
  size: 'Medium',
  status: 'adoptable',
  published_at: '2024-03-20T12:00:00Z',
  description: 'A friendly and playful dog looking for a loving home.',
  photos: [
    {
      small: 'https://example.com/small.jpg',
      medium: 'https://example.com/medium.jpg',
      large: 'https://example.com/large.jpg',
      full: 'https://example.com/full.jpg',
    },
  ],
  attributes: {
    spayed_neutered: true,
    house_trained: true,
    declawed: false,
    special_needs: false,
    shots_current: true,
  },
  environment: {
    children: true,
    dogs: true,
    cats: false,
  },
  organization: {
    name: 'Happy Paws Shelter',
    email: 'adopt@happypaws.org',
    phone: '(555) 123-4567',
    address: {
      city: 'San Francisco',
      state: 'CA',
    },
  },
};

describe('AnimalCard', () => {
  it('renders animal information correctly', () => {
    const { getByText, getByTestId } = render(
      <FavoritesProvider>
        <AnimalCard animal={mockAnimal} />
      </FavoritesProvider>
    );

    expect(getByText('Buddy')).toBeTruthy();
    expect(getByText('Labrador')).toBeTruthy();
    expect(getByText('Young')).toBeTruthy();
    expect(getByText('Male')).toBeTruthy();
    expect(getByTestId(`animal-image-${mockAnimal.id}`)).toBeTruthy();
  });

  it('shows placeholder when no photo is available', () => {
    const animalWithoutPhoto = {
      ...mockAnimal,
      photos: [],
    };
    const { getByTestId } = render(
      <FavoritesProvider>
        <AnimalCard animal={animalWithoutPhoto} />
      </FavoritesProvider>
    );

    expect(
      getByTestId(`placeholder-image-${animalWithoutPhoto.id}`)
    ).toBeTruthy();
  });

  it('displays image when photo is available', () => {
    const { getByTestId } = render(
      <FavoritesProvider>
        <AnimalCard animal={mockAnimal} />
      </FavoritesProvider>
    );

    const image = getByTestId(`animal-image-${mockAnimal.id}`);
    expect(image.props.source.uri).toBe(mockAnimal.photos[0].medium);
  });

  it('opens modal when card is pressed', () => {
    const { getByTestId } = render(
      <FavoritesProvider>
        <AnimalCard animal={mockAnimal} />
      </FavoritesProvider>
    );

    fireEvent.press(getByTestId(`animal-card-${mockAnimal.id}`));
    expect(getByTestId('close-modal-button')).toBeTruthy();
  });
});
