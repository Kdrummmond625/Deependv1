import { create } from "zustand";
import { FavoriteCardRecord } from "./favoritesTypes";
import { getFavoriteCards, saveFavoriteCards } from "./favoritesStorage";

type FavoritesState = {
  favorites: FavoriteCardRecord[];
  hasHydrated: boolean;
  hydrateFavorites: () => Promise<void>;
  toggleFavorite: (cardId: string) => Promise<boolean>;
  removeFavorite: (cardId: string) => Promise<void>;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  hasHydrated: false,

  hydrateFavorites: async () => {
    if (get().hasHydrated) return;

    const favorites = await getFavoriteCards();

    set({
      favorites,
      hasHydrated: true,
    });
  },

  toggleFavorite: async (cardId) => {
    const currentFavorites = get().favorites;
    const alreadyFavorited = currentFavorites.some(
      (favorite) => favorite.cardId === cardId
    );

    const nextFavorites = alreadyFavorited
      ? currentFavorites.filter((favorite) => favorite.cardId !== cardId)
      : [{ cardId, favoritedAt: Date.now() }, ...currentFavorites];

    set({
      favorites: nextFavorites,
    });

    await saveFavoriteCards(nextFavorites);

    return !alreadyFavorited;
  },

  removeFavorite: async (cardId) => {
    const nextFavorites = get().favorites.filter(
      (favorite) => favorite.cardId !== cardId
    );

    set({
      favorites: nextFavorites,
    });

    await saveFavoriteCards(nextFavorites);
  },
}));