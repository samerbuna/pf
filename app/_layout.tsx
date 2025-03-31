import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { View, SafeAreaView } from 'react-native';
import { FavoritesProvider } from '@/hooks/FavoritesProvider';

import '../assets/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <View className="flex-1 bg-white">
          <SafeAreaView className="flex-1">
            <View className="flex-1">
              <Header />
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="dark" />
            </View>
          </SafeAreaView>
        </View>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}
