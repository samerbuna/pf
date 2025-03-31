import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnimalModal } from '../AnimalModal';
import { Animal } from '@/hooks/usePetfinder';

// Mock MaterialCommunityIcons and Ionicons
const MaterialCommunityIcons = function MaterialCommunityIcons(props: any) {
  return null;
};

const Ionicons = function Ionicons(props: any) {
  return null;
};

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons,
  Ionicons,
}));

MaterialCommunityIcons.displayName = 'MaterialCommunityIcons';
Ionicons.displayName = 'Ionicons';

const mockAnimal: Animal = {
  id: 123,
  name: 'Buddy',
  type: 'Dog',
  breeds: {
    primary: 'Labrador',
    secondary: 'Golden Retriever',
  },
  colors: {
    primary: 'Black',
    secondary: 'White',
  },
  age: 'Young',
  gender: 'Male',
  size: 'Medium',
  description: 'A friendly and playful dog',
  photos: [
    {
      small: 'small.jpg',
      medium: 'medium.jpg',
      large: 'large.jpg',
      full: 'full.jpg',
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
    name: 'Happy Pets Shelter',
    email: 'contact@happypets.org',
    phone: '(555) 123-4567',
    address: {
      city: 'Pet City',
      state: 'PC',
    },
  },
  status: 'adoptable',
  published_at: '2024-03-31T00:00:00Z',
};

describe('AnimalModal', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders all sections when visible', () => {
    const { getByText, getByTestId } = render(
      <AnimalModal animal={mockAnimal} visible={true} onClose={onClose} />
    );

    // Check header
    expect(getByText('Buddy')).toBeTruthy();
    expect(getByTestId('close-modal-button')).toBeTruthy();

    // Check basic info tags
    expect(getByText('Dog')).toBeTruthy();
    expect(getByText('Labrador')).toBeTruthy();
    expect(getByText('Golden Retriever')).toBeTruthy();
    expect(getByText('Male')).toBeTruthy();
    expect(getByText('Young')).toBeTruthy();
    expect(getByText('Medium')).toBeTruthy();
    expect(getByText('Black')).toBeTruthy();
    expect(getByText('White')).toBeTruthy();

    // Check description
    expect(getByText('A friendly and playful dog')).toBeTruthy();

    // Check health & care tags
    expect(getByText('Spayed/Neutered')).toBeTruthy();
    expect(getByText('House Trained')).toBeTruthy();
    expect(getByText('Shots Current')).toBeTruthy();

    // Check environment tags
    expect(getByText('Good with Children')).toBeTruthy();
    expect(getByText('Good with Dogs')).toBeTruthy();

    // Check contact info
    expect(getByText('Happy Pets Shelter')).toBeTruthy();
    expect(getByText('Pet City, PC')).toBeTruthy();
    expect(getByText('(555) 123-4567')).toBeTruthy();
    expect(getByText('contact@happypets.org')).toBeTruthy();
  });

  it('handles missing photos', () => {
    const animalWithoutPhotos = {
      ...mockAnimal,
      photos: [],
    };
    const { getByTestId } = render(
      <AnimalModal
        animal={animalWithoutPhotos}
        visible={true}
        onClose={onClose}
      />
    );
    expect(getByTestId('placeholder-image')).toBeTruthy();
  });

  it('handles missing optional information', () => {
    const animalWithMinimalInfo = {
      ...mockAnimal,
      breeds: { primary: 'Labrador', secondary: null },
      colors: { primary: 'Black', secondary: null },
      description: '',
      attributes: {
        spayed_neutered: false,
        house_trained: false,
        declawed: false,
        special_needs: false,
        shots_current: false,
      },
      environment: {
        children: false,
        dogs: false,
        cats: false,
      },
    };

    const { queryByText } = render(
      <AnimalModal
        animal={animalWithMinimalInfo}
        visible={true}
        onClose={onClose}
      />
    );

    // Check that optional sections are not rendered
    expect(queryByText('Golden Retriever')).toBeNull();
    expect(queryByText('White')).toBeNull();
    expect(queryByText('A friendly and playful dog')).toBeNull();
    expect(queryByText('Spayed/Neutered')).toBeNull();
    expect(queryByText('Good with Children')).toBeNull();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(
      <AnimalModal animal={mockAnimal} visible={true} onClose={onClose} />
    );
    fireEvent.press(getByTestId('close-modal-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
