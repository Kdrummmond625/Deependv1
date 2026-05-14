import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageKeys } from "@/constants/storageKeys";
import { GameSettings } from "./gameTypes";

export async function saveSettings(settings: GameSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.settings, JSON.stringify(settings));
  } catch (error) {
    console.warn("Failed to save settings", error);
  }
}

export async function loadSettings(): Promise<Partial<GameSettings> | null> {
  try {
    const storedSettings = await AsyncStorage.getItem(storageKeys.settings);

    if (!storedSettings) return null;

    return JSON.parse(storedSettings) as Partial<GameSettings>;
  } catch (error) {
    console.warn("Failed to load settings", error);
    return null;
  }
}