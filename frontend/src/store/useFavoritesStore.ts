import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
  id: string;
  type: 'destination' | 'trail' | 'cruise';
  name: string;
  image: string;
  url: string;
}

interface FavoritesState {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (item) => set((state) => {
        if (!state.favorites.find(f => f.id === item.id)) {
          return { favorites: [...state.favorites, item] };
        }
        return state;
      }),
      removeFavorite: (id) => set((state) => ({
        favorites: state.favorites.filter((f) => f.id !== id),
      })),
      isFavorite: (id) => !!get().favorites.find((f) => f.id === id),
    }),
    {
      name: 'norway-favorites-storage',
    }
  )
);
