import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageKeys } from "@/constants/storageKeys";

export function useOnboardingStatus() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        const value = await AsyncStorage.getItem(storageKeys.onboardingComplete);
        setHasCompletedOnboarding(value === "true");
      } catch (error) {
        console.warn("Failed to check onboarding status", error);
        setHasCompletedOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    }

    void checkOnboardingStatus();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(storageKeys.onboardingComplete, "true");
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.warn("Failed to save onboarding status", error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(storageKeys.onboardingComplete);
      setHasCompletedOnboarding(false);
    } catch (error) {
      console.warn("Failed to reset onboarding status", error);
    }
  };

  return {
    isLoading,
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}