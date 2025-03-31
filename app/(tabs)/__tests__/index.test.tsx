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
  },
];

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (useAnimals as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows error state when there is an error', () => {
    const errorMessage = 'Failed to fetch animals';
    (useAnimals as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error(errorMessage),
      data: null,
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText(`Error: ${errorMessage}`)).toBeTruthy();
  });

  it('renders list of animals when data is loaded', () => {
    (useAnimals as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: {
        pages: [
          {
            animals: mockAnimals,
            pagination: {
              current_page: 1,
              total_pages: 1,
            },
          },
        ],
      },
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText('Buddy')).toBeTruthy();
    expect(getByText('Labrador')).toBeTruthy();
    expect(getByText('Male')).toBeTruthy();
    expect(getByText('Young')).toBeTruthy();
  });

  it('loads more animals when scrolling to bottom', async () => {
    const fetchNextPage = jest.fn();
    (useAnimals as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: {
        pages: [
          {
            animals: mockAnimals,
            pagination: {
              current_page: 1,
              total_pages: 2,
            },
          },
        ],
      },
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage,
      refetch: jest.fn(),
    });

    const { getByTestId } = render(<HomeScreen />);
    const flatList = getByTestId('animals-list');

    // Directly trigger onEndReached
    const onEndReached = flatList.props.onEndReached;
    onEndReached();

    expect(fetchNextPage).toHaveBeenCalled();
  });
});
