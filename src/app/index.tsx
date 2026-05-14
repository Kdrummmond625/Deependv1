import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/components/AppButton";
import { AppScreen } from "@/components/AppScreen";
import { HeaderGear } from "@/components/HeaderGear";
import { SettingsModal } from "@/components/SettingsModal";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";

export default function IndexScreen() {
  const { isLoading, hasCompletedOnboarding } = useOnboardingStatus();
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [isLoading, hasCompletedOnboarding]);

  if (isLoading) {
    return (
      <AppScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.gold} />
        </View>
      </AppScreen>
    );
  }

  if (!hasCompletedOnboarding) {
    return null;
  }

  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View />
          <HeaderGear onPress={() => setSettingsVisible(true)} />
        </View>

        <View style={styles.centerContent}>
          <Text style={styles.logo}>DEEP END</Text>

          <Text style={styles.body}>
            Everyday situations.{"\n"}Choices you have to say out loud.
          </Text>
        </View>

        <View style={styles.actions}>
          <AppButton title="START GAME" onPress={() => router.push("/setup")} />

          <AppButton
            title="HOW TO PLAY"
            variant="secondary"
            onPress={() => router.push("/onboarding")}
          />
        </View>

        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          showEndGame={false}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  topRow: {
    height: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  logo: {
    ...typography.title,
    color: colors.cream,
    textAlign: "center",
    letterSpacing: 2,
  },
  body: {
    ...typography.body,
    color: colors.mutedCream,
    textAlign: "center",
  },
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
});