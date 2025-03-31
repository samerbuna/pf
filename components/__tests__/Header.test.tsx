import { render, screen, fireEvent } from '@testing-library/react-native';
import { FavoritesProvider } from '@/hooks/FavoritesProvider';
import { Header } from '../Header';

const mockPush = jest.fn();

jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => ({
  MaterialCommunityIcons: function MockIcon({
    testID,
    name,
  }: {
    testID?: string;
    name: string;
  }) {
    return testID ? `mock-icon-${name}-${testID}` : `mock-icon-${name}`;
  },
}));

jest.mock('expo-font', () => ({
  isLoaded: () => true,
  loadAsync: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  router: { push: mockPush },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

describe('Header', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders correctly', () => {
    render(
      <FavoritesProvider>
        <Header />
      </FavoritesProvider>
    );

    expect(screen.getByText('Pet Finder')).toBeTruthy();
    expect(screen.getByTestId('app-icon')).toBeTruthy();
  });

  it('shows outline heart icon when no favorites', () => {
    render(
      <FavoritesProvider>
        <Header />
      </FavoritesProvider>
    );

    expect(screen.getByTestId('favorites-button')).toBeTruthy();
  });

  it('navigates to favorites screen when favorites button is pressed', () => {
    render(
      <FavoritesProvider>
        <Header />
      </FavoritesProvider>
    );

    const favoritesButton = screen.getByTestId('favorites-button');
    fireEvent.press(favoritesButton);
    expect(mockPush).toHaveBeenCalledWith('/favorites');
  });
});
