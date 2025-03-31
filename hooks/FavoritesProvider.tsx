import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animal } from './usePetfinder';

const FAVORITES_KEY = '@pet-finder:favorites';

interface FavoritesContextType {
  favorites: Animal[];
  isLoading: boolean;
  error: Error | null;
  addFavorite: (animal: Animal) => Promise<void>;
  removeFavorite: (animalId: number) => Promise<void>;
  isFavorite: (animalId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadFavorites = async () => {
    try {
      setError(null);
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      const parsedFavorites = storedFavorites
        ? JSON.parse(storedFavorites)
        : [];
      setFavorites(parsedFavorites);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to load favorites')
      );
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadFavorites();
  }, []);

  const addFavorite = async (animal: Animal) => {
    try {
      setError(null);
      const newFavorites = [...favorites, animal];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (err) {
      console.error('Error adding favorite:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to add favorite')
      );
    }
  };

  const removeFavorite = async (animalId: number) => {
    try {
      setError(null);
      const newFavorites = favorites.filter((fav) => fav.id !== animalId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to remove favorite')
      );
    }
  };

  const isFavorite = (animalId: number) => {
    return favorites.some((fav) => fav.id === animalId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        error,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
