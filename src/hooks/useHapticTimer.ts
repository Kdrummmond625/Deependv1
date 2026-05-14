import { useEffect } from "react";
import * as Haptics from "expo-haptics";

type UseHapticTimerInput = {
  cardId: string | null;
  minutes: number;
  enabled: boolean;
};

export function useHapticTimer({
  cardId,
  minutes,
  enabled,
}: UseHapticTimerInput) {
  useEffect(() => {
    if (!enabled) return;
    if (!cardId) return;
    if (minutes <= 0) return;

    const timerMs = minutes * 60 * 1000;

    const timeoutId = setTimeout(() => {
      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning
      );
    }, timerMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [cardId, minutes, enabled]);
}