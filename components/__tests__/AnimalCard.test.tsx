import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnimalCard } from '../AnimalCard';
import { Animal } from '@/hooks/usePetfinder';

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
};

describe('AnimalCard', () => {
  it('renders animal information correctly', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AnimalCard animal={mockAnimal} onPress={onPress} />
    );

    expect(getByText('Buddy')).toBeTruthy();
    expect(getByText('Labrador / Golden Retriever')).toBeTruthy();
    expect(getByText('Young • Male • Medium')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AnimalCard animal={mockAnimal} onPress={onPress} />
    );

    fireEvent.press(getByTestId(`animal-card-${mockAnimal.id}`));
    expect(onPress).toHaveBeenCalledWith(mockAnimal);
  });

  it('shows placeholder when no photo is available', () => {
    const animalWithoutPhoto = {
      ...mockAnimal,
      photos: [],
    };
    const { getByText } = render(
      <AnimalCard animal={animalWithoutPhoto} onPress={jest.fn()} />
    );

    expect(getByText('No image available')).toBeTruthy();
  });
});
