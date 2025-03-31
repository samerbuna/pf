import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomeScreen from '../index';
import { FavoritesProvider } from '@/hooks/FavoritesProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

// Mock the usePetfinder hook
jest.mock('@/hooks/usePetfinder', () => ({
  useAnimals: jest.fn().mockReturnValue({
    data: { pages: [{ animals: [] }] },
    isLoading: false,
    error: null,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: jest.fn(),
    refetch: jest.fn(),
  }),
}));

// Mock the @expo/vector-icons module
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  Ionicons: 'Ionicons',
}));

const queryClient = new QueryClient();

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', async () => {
    const { useAnimals } = require('@/hooks/usePetfinder');
    (useAnimals as jest.Mock).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      error: null,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          <HomeScreen />
        </FavoritesProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });
  });

  it('renders error state', async () => {
    const { useAnimals } = require('@/hooks/usePetfinder');
    (useAnimals as jest.Mock).mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch animals'),
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          <HomeScreen />
        </FavoritesProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByText('Error: Failed to fetch animals')).toBeTruthy();
    });
  });

  it('renders empty state when no animals are available', async () => {
    const { useAnimals } = require('@/hooks/usePetfinder');
    (useAnimals as jest.Mock).mockReturnValueOnce({
      data: { pages: [{ animals: [] }] },
      isLoading: false,
      error: null,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          <HomeScreen />
        </FavoritesProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByText('No animals found.')).toBeTruthy();
    });
  });

  it('renders list of animals', async () => {
    const mockAnimal = {
      id: 1,
      name: 'Test Animal',
      type: 'Dog',
      breeds: { primary: 'Mixed', secondary: null },
      colors: { primary: 'Brown', secondary: null },
      age: 'Young',
      gender: 'Male',
      size: 'Medium',
      status: 'adoptable',
      description: 'A friendly dog',
      photos: [{ medium: 'test.jpg' }],
      published_at: '2024-03-20T12:00:00Z',
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
      contact: {
        email: 'test@example.com',
        phone: '123-456-7890',
        address: {
          city: 'Test City',
          state: 'TS',
        },
      },
      organization: {
        id: 'ORG1',
        name: 'Test Organization',
      },
    };

    const { useAnimals } = require('@/hooks/usePetfinder');
    (useAnimals as jest.Mock).mockReturnValueOnce({
      data: { pages: [{ animals: [mockAnimal] }] },
      isLoading: false,
      error: null,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          <HomeScreen />
        </FavoritesProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByTestId('animals-list')).toBeTruthy();
    });
  });
});
