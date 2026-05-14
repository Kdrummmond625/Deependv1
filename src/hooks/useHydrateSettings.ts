import { useEffect } from "react";
import { loadSettings } from "@/features/game/settingsStorage";
import { useGameStore } from "@/features/game/gameStore";

export function useHydrateSettings() {
  const hydrateSettings = useGameStore((state) => state.hydrateSettings);

  useEffect(() => {
    async function hydrate() {
      const storedSettings = await loadSettings();

      if (storedSettings) {
        hydrateSettings(storedSettings);
      }
    }

    void hydrate();
  }, [hydrateSettings]);
}