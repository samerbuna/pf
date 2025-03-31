import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from '../Header';
import { router } from 'expo-router';

// Mock MaterialCommunityIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: () => 'MaterialCommunityIcons',
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Header', () => {
  it('renders the app title and icon', () => {
    const { getByText } = render(<Header />);
    expect(getByText('Pet Finder')).toBeTruthy();
  });

  it('navigates to favorites when heart icon is pressed', () => {
    const { getByTestId } = render(<Header />);
    fireEvent.press(getByTestId('favorites-button'));
    expect(router.push).toHaveBeenCalledWith('/favorites');
  });
});
