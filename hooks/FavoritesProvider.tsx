import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animal } from './usePetfinder';

const FAVORITES_KEY = '@pet-finder:favorites';

interface FavoritesContextType {
  favorites: Animal[];
  isLoading: boolean;
  addFavorite: (animal: Animal) => Promise<void>;
  removeFavorite: (animalId: number) => Promise<void>;
  isFavorite: (animalId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const addFavorite = async (animal: Animal) => {
    try {
      const newFavorites = [...favorites, animal];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      await loadFavorites();
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (animalId: number) => {
    try {
      const newFavorites = favorites.filter((fav) => fav.id !== animalId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      await loadFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
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
