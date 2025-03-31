import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnimalCard } from '@/components/AnimalCard';
import { Animal } from '@/hooks/usePetfinder';

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

describe('AnimalCard', () => {
  it('renders animal information correctly', () => {
    const { getByTestId } = render(<AnimalCard animal={mockAnimal} />);

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

  it('shows placeholder when no photo is available', () => {
    const animalWithoutPhoto = {
      ...mockAnimal,
      photos: [],
    };
    const { getByTestId } = render(<AnimalCard animal={animalWithoutPhoto} />);

    expect(
      getByTestId(`placeholder-image-${animalWithoutPhoto.id}`)
    ).toBeTruthy();
  });

  it('displays image when photo is available', () => {
    const { getByTestId } = render(<AnimalCard animal={mockAnimal} />);

    const image = getByTestId(`animal-image-${mockAnimal.id}`);
    expect(image.props.source.uri).toBe(mockAnimal.photos[0].medium);
  });

  it('opens modal when card is pressed', () => {
    const { getByTestId } = render(<AnimalCard animal={mockAnimal} />);

    fireEvent.press(getByTestId(`animal-card-${mockAnimal.id}`));
    expect(getByTestId('close-modal-button')).toBeTruthy();
  });
});
