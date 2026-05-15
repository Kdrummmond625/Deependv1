import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SettingsModal } from "@/components/SettingsModal";
import { DoodleLayer } from "@/components/paper/DoodleLayer";
import { InkLink } from "@/components/paper/InkLink";
import { PaperScreen } from "@/components/paper/PaperScreen";
import { RaisedButton } from "@/components/paper/RaisedButton";
import { StackedLogoCard } from "@/components/paper/StackedLogoCard";
import {
  paperColors,
  paperFonts,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";
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
      <PaperScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={paperColors.terracotta} />
        </View>
      </PaperScreen>
    );
  }

  if (!hasCompletedOnboarding) {
    return null;
  }

  return (
    <PaperScreen>
      <DoodleLayer />

      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.brandSmall}>DEEP END</Text>

          <Pressable
            onPress={() => setSettingsVisible(true)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            style={styles.settingsButton}
          >
            <Text style={styles.settingsText}>⚙︎</Text>
          </Pressable>
        </View>

        <View style={styles.centerContent}>
          <StackedLogoCard />

          <View style={styles.copyBlock}>
            <Text style={styles.headline}>
              Everyday situations.{"\n"}Choices you have to say out loud.
            </Text>

            <Text style={styles.subcopy}>
              Pull a card. Read it out loud. Let the room answer.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <RaisedButton
            title="START GAME →"
            onPress={() => router.push("/setup")}
            accessibilityLabel="Start game"
          />

          <InkLink
            title="How to play"
            onPress={() => router.push("/onboarding")}
          />
        </View>
      </View>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        showEndGame={false}
      />
    </PaperScreen>
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandSmall: {
    ...paperType.brandSmall,
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
  },
  settingsButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsText: {
    color: paperColors.ink,
    fontSize: 23,
    lineHeight: 24,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: paperSpacing.xxl,
  },
  copyBlock: {
    alignItems: "center",
    paddingHorizontal: paperSpacing.sm,
    gap: paperSpacing.sm,
  },
  headline: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 21,
    lineHeight: 29,
    textAlign: "center",
    fontWeight: "500",
  },
  subcopy: {
    ...paperType.body,
    color: paperColors.ink,
    opacity: 0.64,
    textAlign: "center",
    maxWidth: 260,
  },
  actions: {
    gap: paperSpacing.lg,
    paddingBottom: paperSpacing.xs,
  },
});