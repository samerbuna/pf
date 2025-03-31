import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

// Types for the Petfinder API
export interface Animal {
  id: number;
  type: string;
  breeds: {
    primary: string;
    secondary: string | null;
  };
  age: string;
  gender: string;
  size: string;
  name: string;
  description: string;
  photos: {
    small: string;
    medium: string;
    large: string;
    full: string;
  }[];
  status: string;
  published_at: string;
}

export interface AnimalsResponse {
  animals: Animal[];
  pagination: {
    count_per_page: number;
    total_count: number;
    current_page: number;
    total_pages: number;
  };
}

// API configuration
const API_KEY = process.env.EXPO_PUBLIC_PETFINDER_API_KEY;
const API_SECRET = process.env.EXPO_PUBLIC_PETFINDER_API_SECRET;
const BASE_URL = 'https://api.petfinder.com/v2';

// Helper function to get access token
async function getAccessToken() {
  const response = await fetch(`${BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`,
  });
  const data = await response.json();
  return data.access_token;
}

// Hook for fetching animals with infinite scroll
export function useAnimals() {
  return useInfiniteQuery({
    queryKey: ['animals'],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getAccessToken();
      const response = await fetch(
        `${BASE_URL}/animals?page=${pageParam}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch animals');
      }
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
      return data as AnimalsResponse;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.current_page < lastPage.pagination.total_pages) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

// Hook for fetching animal types
export function useAnimalTypes() {
  return useQuery({
    queryKey: ['types'],
    queryFn: async () => {
      const token = await getAccessToken();
      const response = await fetch(`${BASE_URL}/types`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch animal types');
      }
      return response.json();
    },
  });
}
