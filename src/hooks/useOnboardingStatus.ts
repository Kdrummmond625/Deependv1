import { useEffect, useState } from "react";
import { getOnboardingCompleted } from "@/features/onboarding/onboardingStorage";

export function useOnboardingStatus() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      const completed = await getOnboardingCompleted();

      if (!isMounted) return;

      setHasCompletedOnboarding(completed);
      setIsLoading(false);
    }

    void loadStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isLoading,
    hasCompletedOnboarding,
  };
}