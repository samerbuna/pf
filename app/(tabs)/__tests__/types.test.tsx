import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import TypesScreen from '../types';
import { useAnimalTypes } from '@/hooks/usePetfinder';

// Mock the useAnimalTypes hook
jest.mock('@/hooks/usePetfinder', () => ({
  useAnimalTypes: jest.fn(),
}));

describe('TypesScreen', () => {
  const mockTypes = [
    {
      name: 'Dog',
      coats: ['Short', 'Medium', 'Long'],
      colors: ['Black', 'Brown', 'White'],
      genders: ['Male', 'Female'],
    },
    {
      name: 'Cat',
      coats: ['Short', 'Long'],
      colors: ['Black', 'White', 'Orange'],
      genders: ['Male', 'Female'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useAnimalTypes as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    const { getByTestId } = render(<TypesScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to fetch types';
    (useAnimalTypes as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error(errorMessage),
      data: null,
    });

    const { getByText } = render(<TypesScreen />);
    expect(getByText(`Error: ${errorMessage}`)).toBeTruthy();
  });

  it('renders empty state when no types are available', () => {
    (useAnimalTypes as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: [],
    });

    const { getByText } = render(<TypesScreen />);
    expect(getByText('No animal types found.')).toBeTruthy();
  });

  it('renders list of animal types', async () => {
    (useAnimalTypes as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockTypes,
    });

    const { getByText, getAllByText } = render(<TypesScreen />);

    await waitFor(() => {
      // Check if type names are rendered
      expect(getByText('Dog')).toBeTruthy();
      expect(getByText('Cat')).toBeTruthy();

      // Check if type details are rendered
      expect(getByText('Short, Medium, Long')).toBeTruthy();
      expect(getByText('Short, Long')).toBeTruthy();
      expect(getByText('Black, Brown, White')).toBeTruthy();
      expect(getByText('Black, White, Orange')).toBeTruthy();

      // Check for multiple instances of shared text
      const genderTexts = getAllByText('Male, Female');
      expect(genderTexts).toHaveLength(2);
    });
  });
});
