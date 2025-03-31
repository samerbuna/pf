import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { AnimalCard } from '../AnimalCard';
import { Animal } from '@/hooks/usePetfinder';
import { FavoritesProvider } from '@/hooks/FavoritesProvider';

// Mock MaterialCommunityIcons and Ionicons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: () => 'MaterialCommunityIcons',
  Ionicons: () => 'Ionicons',
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
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

const mockAnimal: Animal = {
  id: 1,
  type: 'Dog',
  breeds: {
    primary: 'Labrador',
    secondary: 'Golden Retriever',
  },
  age: 'Young',
  gender: 'Male',
  size: 'Medium',
  name: 'Buddy',
  description: 'A friendly dog',
  photos: [
    {
      small: 'https://example.com/small.jpg',
      medium: 'https://example.com/medium.jpg',
      large: 'https://example.com/large.jpg',
      full: 'https://example.com/full.jpg',
    },
  ],
  status: 'adoptable',
  published_at: '2024-03-31T00:00:00Z',
  colors: {
    primary: 'Black',
    secondary: 'Brown',
  },
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
    cats: true,
  },
  organization: {
    name: 'Happy Pets Shelter',
    address: {
      city: 'San Francisco',
      state: 'CA',
    },
    phone: '(555) 123-4567',
    email: 'adopt@happypets.org',
  },
};

const renderWithFavorites = (ui: React.ReactElement) => {
  return render(<FavoritesProvider>{ui}</FavoritesProvider>);
};

describe('AnimalCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders animal information correctly', async () => {
    const { getByTestId } = renderWithFavorites(
      <AnimalCard animal={mockAnimal} />
    );

    await waitFor(() => {
      expect(getByTestId(`animal-name-${mockAnimal.id}`)).toHaveTextContent(
        'Buddy'
      );
      expect(getByTestId(`animal-breed-${mockAnimal.id}`)).toHaveTextContent(
        'Labrador'
      );
      expect(getByTestId(`animal-gender-${mockAnimal.id}`)).toHaveTextContent(
        'Male'
      );
      expect(getByTestId(`animal-age-${mockAnimal.id}`)).toHaveTextContent(
        'Young'
      );
    });
  });

  it('shows placeholder when no photo is available', async () => {
    const animalWithoutPhoto = {
      ...mockAnimal,
      photos: [],
    };
    const { getByTestId } = renderWithFavorites(
      <AnimalCard animal={animalWithoutPhoto} />
    );

    await waitFor(() => {
      expect(
        getByTestId(`placeholder-image-${animalWithoutPhoto.id}`)
      ).toBeTruthy();
    });
  });

  it('displays image when photo is available', async () => {
    const { getByTestId } = renderWithFavorites(
      <AnimalCard animal={mockAnimal} />
    );

    await waitFor(() => {
      const image = getByTestId(`animal-image-${mockAnimal.id}`);
      expect(image.props.source.uri).toBe(mockAnimal.photos[0].medium);
    });
  });

  it('opens modal when card is pressed', async () => {
    const { getByTestId } = renderWithFavorites(
      <AnimalCard animal={mockAnimal} />
    );

    await act(async () => {
      fireEvent.press(getByTestId(`animal-card-${mockAnimal.id}`));
    });

    await waitFor(() => {
      expect(getByTestId('close-modal-button')).toBeTruthy();
    });
  });
});
