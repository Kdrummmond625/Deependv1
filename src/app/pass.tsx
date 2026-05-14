import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/components/AppButton";
import { AppScreen } from "@/components/AppScreen";
import { HeaderGear } from "@/components/HeaderGear";
import { SettingsModal } from "@/components/SettingsModal";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useGameStore } from "@/features/game/gameStore";

export default function PassScreen() {
  const session = useGameStore((state) => state.session);
  const [settingsVisible, setSettingsVisible] = useState(false);

  if (session.isPlayerlessMode) {
    router.replace("/decks");
    return null;
  }

  if (session.players.length === 0) {
    router.replace("/setup");
    return null;
  }

  const currentPlayer =
    session.players[session.currentPlayerIndex] ?? "PLAYER";

  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View />
          <HeaderGear onPress={() => setSettingsVisible(true)} />
        </View>

        <View style={styles.centerContent}>
          <Text style={styles.heading}>PASS THE PHONE TO</Text>

          <View style={styles.playerPanel}>
            <Text style={styles.playerName}>{currentPlayer.toUpperCase()}</Text>
          </View>
        </View>

        <AppButton
          title="CHOOSE PATTERN"
          onPress={() => router.push("/decks")}
        />

        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
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
    gap: spacing.xl,
  },
  heading: {
    ...typography.heading,
    color: colors.cream,
    textAlign: "center",
  },
  playerPanel: {
    width: "100%",
    maxWidth: 280,
    height: 180,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  playerName: {
    color: colors.cream,
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
});