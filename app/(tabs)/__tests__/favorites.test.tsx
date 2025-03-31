import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import FavoritesScreen from '../favorites';
import { FavoritesProvider } from '@/hooks/FavoritesProvider';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

// Mock the useFavorites hook
const mockUseFavorites = jest.fn();

jest.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => mockUseFavorites(),
}));

describe('FavoritesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFavorites.mockReturnValue({
      favorites: [],
      isLoading: false,
      error: null,
    });
  });

  it('renders empty state when no favorites', async () => {
    const { getByText } = render(
      <FavoritesProvider>
        <FavoritesScreen />
      </FavoritesProvider>
    );

    await act(async () => {
      await waitFor(() => {
        expect(getByText('No Favorites')).toBeTruthy();
        expect(
          getByText("You haven't added any pets to your favorites yet.")
        ).toBeTruthy();
      });
    });
  });

  it('renders loading state', async () => {
    mockUseFavorites.mockReturnValue({
      favorites: [],
      isLoading: true,
      error: null,
    });

    const { getByTestId } = render(
      <FavoritesProvider>
        <FavoritesScreen />
      </FavoritesProvider>
    );

    await act(async () => {
      await waitFor(() => {
        expect(getByTestId('loading-indicator')).toBeTruthy();
      });
    });
  });

  it('renders error state', async () => {
    mockUseFavorites.mockReturnValue({
      favorites: [],
      isLoading: false,
      error: new Error('Failed to load favorites'),
    });

    const { getByText } = render(
      <FavoritesProvider>
        <FavoritesScreen />
      </FavoritesProvider>
    );

    await act(async () => {
      await waitFor(() => {
        expect(getByText('Error: Failed to load favorites')).toBeTruthy();
      });
    });
  });
});
