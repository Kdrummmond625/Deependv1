import { Share, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/components/AppButton";
import { AppScreen } from "@/components/AppScreen";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useGameStore } from "@/features/game/gameStore";
import { formatDuration, getElapsedSeconds } from "@/utils/time";

export default function EndScreen() {
  const session = useGameStore((state) => state.session);
  const resetSession = useGameStore((state) => state.resetSession);

  const elapsedSeconds = getElapsedSeconds(session.sessionStartedAt);
  const timeSpent = formatDuration(elapsedSeconds);

  const handlePlayAgain = () => {
    resetSession();
    router.replace("/setup");
  };

  const handleChooseDeck = () => {
    resetSession();
    router.replace("/setup");
  };

  const handleHome = () => {
    resetSession();
    router.replace("/");
  };

  const handleShare = async () => {
    await Share.share({
      message: `We played ${session.cardsDiscussed} card${
        session.cardsDiscussed === 1 ? "" : "s"
      } in Deep End.`,
    });
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.kicker}>SESSION ENDED</Text>
          <Text style={styles.title}>Some cards leave after the game does.</Text>

          <View style={styles.statsPanel}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Cards played</Text>
              <Text style={styles.statValue}>{session.cardsDiscussed}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Time played</Text>
              <Text style={styles.statValue}>{timeSpent}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <AppButton title="PLAY AGAIN" onPress={handlePlayAgain} />
          <AppButton
            title="CHOOSE DECK"
            variant="secondary"
            onPress={handleChooseDeck}
          />
          <AppButton title="SHARE" variant="secondary" onPress={handleShare} />
          <Text style={styles.homeText} onPress={handleHome}>
            Home
          </Text>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg,
  },
  kicker: {
    color: colors.gold,
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: "700",
    textAlign: "center",
  },
  title: {
    ...typography.title,
    color: colors.cream,
    textAlign: "center",
  },
  statsPanel: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  statLabel: {
    color: colors.mutedCream,
    fontSize: 14,
    fontWeight: "600",
  },
  statValue: {
    color: colors.cream,
    fontSize: 18,
    fontWeight: "700",
  },
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  homeText: {
    color: colors.mutedCream,
    fontSize: 13,
    textAlign: "center",
  },
});