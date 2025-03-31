import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnimalModal } from '../AnimalModal';
import { Animal } from '@/hooks/usePetfinder';
import { FavoritesProvider } from '@/hooks/FavoritesProvider';

// Mock MaterialCommunityIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: () => 'MaterialCommunityIcons',
  Ionicons: () => 'Ionicons',
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
    secondary: 'White',
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

describe('AnimalModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all sections when visible', () => {
    const { getByText, getByTestId } = render(
      <FavoritesProvider>
        <AnimalModal animal={mockAnimal} visible={true} onClose={mockOnClose} />
      </FavoritesProvider>
    );

    // Check header
    expect(getByText('Buddy')).toBeTruthy();
    expect(getByTestId('close-modal-button')).toBeTruthy();

    // Check basic info tags
    expect(getByText('Dog')).toBeTruthy();
    expect(getByText('Labrador')).toBeTruthy();
    expect(getByText('Young')).toBeTruthy();
    expect(getByText('Male')).toBeTruthy();
    expect(getByText('Medium')).toBeTruthy();
    expect(getByText('Black')).toBeTruthy();
    expect(getByText('White')).toBeTruthy();

    // Check description
    expect(
      getByText('A friendly and playful dog looking for a loving home.')
    ).toBeTruthy();

    // Check health & care section
    expect(getByText('Health & Care')).toBeTruthy();
    expect(getByText('Spayed/Neutered')).toBeTruthy();
    expect(getByText('House Trained')).toBeTruthy();
    expect(getByText('Shots Current')).toBeTruthy();

    // Check environment section
    expect(getByText('Environment')).toBeTruthy();
    expect(getByText('Good with Children')).toBeTruthy();
    expect(getByText('Good with Dogs')).toBeTruthy();

    // Check contact section
    expect(getByText('Contact Information')).toBeTruthy();
    expect(getByText('Happy Paws Shelter')).toBeTruthy();
    expect(getByText('San Francisco, CA')).toBeTruthy();
    expect(getByText('(555) 123-4567')).toBeTruthy();
    expect(getByText('adopt@happypaws.org')).toBeTruthy();
  });

  it('shows placeholder image when no photos are available', () => {
    const animalWithoutPhotos = {
      ...mockAnimal,
      photos: [],
    };

    const { getByTestId } = render(
      <FavoritesProvider>
        <AnimalModal
          animal={animalWithoutPhotos}
          visible={true}
          onClose={mockOnClose}
        />
      </FavoritesProvider>
    );

    expect(getByTestId('placeholder-image')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(
      <FavoritesProvider>
        <AnimalModal animal={mockAnimal} visible={true} onClose={mockOnClose} />
      </FavoritesProvider>
    );

    fireEvent.press(getByTestId('close-modal-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <FavoritesProvider>
        <AnimalModal
          animal={mockAnimal}
          visible={false}
          onClose={mockOnClose}
        />
      </FavoritesProvider>
    );

    expect(queryByText('Buddy')).toBeNull();
  });

  it('handles missing optional fields gracefully', () => {
    const animalWithMissingFields = {
      ...mockAnimal,
      description: '',
      organization: undefined,
      attributes: {
        ...mockAnimal.attributes,
        spayed_neutered: false,
        house_trained: false,
        shots_current: false,
      },
      environment: {
        ...mockAnimal.environment,
        children: false,
        dogs: false,
        cats: false,
      },
    };

    const { queryByText } = render(
      <FavoritesProvider>
        <AnimalModal
          animal={animalWithMissingFields}
          visible={true}
          onClose={mockOnClose}
        />
      </FavoritesProvider>
    );

    // Description section should not be present
    expect(
      queryByText('A friendly and playful dog looking for a loving home.')
    ).toBeNull();

    // Health & Care section should not show any tags
    expect(queryByText('Spayed/Neutered')).toBeNull();
    expect(queryByText('House Trained')).toBeNull();
    expect(queryByText('Shots Current')).toBeNull();

    // Environment section should not show any tags
    expect(queryByText('Good with Children')).toBeNull();
    expect(queryByText('Good with Dogs')).toBeNull();
    expect(queryByText('Good with Cats')).toBeNull();

    // Contact section should not be present
    expect(queryByText('Contact Information')).toBeNull();
  });

  it('displays secondary breed when available', () => {
    const animalWithSecondaryBreed = {
      ...mockAnimal,
      breeds: {
        ...mockAnimal.breeds,
        secondary: 'Golden Retriever',
      },
    };

    const { getByText } = render(
      <FavoritesProvider>
        <AnimalModal
          animal={animalWithSecondaryBreed}
          visible={true}
          onClose={mockOnClose}
        />
      </FavoritesProvider>
    );

    expect(getByText('Golden Retriever')).toBeTruthy();
  });

  it('displays secondary color when available', () => {
    const animalWithSecondaryColor = {
      ...mockAnimal,
      colors: {
        ...mockAnimal.colors,
        secondary: 'Brown',
      },
    };

    const { getByText } = render(
      <FavoritesProvider>
        <AnimalModal
          animal={animalWithSecondaryColor}
          visible={true}
          onClose={mockOnClose}
        />
      </FavoritesProvider>
    );

    expect(getByText('Brown')).toBeTruthy();
  });
});
