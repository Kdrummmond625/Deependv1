import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoriteCardRecord } from "./favoritesTypes";

const FAVORITES_KEY = "deep_end_favorite_cards";
const FAVORITES_INTRO_SHOWN_KEY = "deep_end_favorites_intro_shown";

export async function getFavoriteCards(): Promise<FavoriteCardRecord[]> {
  const rawValue = await AsyncStorage.getItem(FAVORITES_KEY);

  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is FavoriteCardRecord =>
        typeof item?.cardId === "string" &&
        typeof item?.favoritedAt === "number"
    );
  } catch {
    return [];
  }
}

export async function saveFavoriteCards(
  favorites: FavoriteCardRecord[]
): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export async function getFavoritesIntroShown(): Promise<boolean> {
  const value = await AsyncStorage.getItem(FAVORITES_INTRO_SHOWN_KEY);
  return value === "true";
}

export async function setFavoritesIntroShown(): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_INTRO_SHOWN_KEY, "true");
}