import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../index';
import { useAnimals } from '@/hooks/usePetfinder';

// Mock the useAnimals hook
jest.mock('@/hooks/usePetfinder', () => ({
  useAnimals: jest.fn(),
}));

const mockAnimals = [
  {
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
  },
];

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useAnimals as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to fetch animals';
    (useAnimals as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error(errorMessage),
      data: null,
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText(`Error: ${errorMessage}`)).toBeTruthy();
  });

  it('renders empty state when no animals are available', () => {
    (useAnimals as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: { pages: [{ animals: [] }] },
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText('No animals found.')).toBeTruthy();
  });

  it('renders list of animals', () => {
    (useAnimals as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: { pages: [{ animals: mockAnimals }] },
    });

    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('animals-list')).toBeTruthy();
  });
});
