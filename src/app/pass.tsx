import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SettingsModal } from "@/components/SettingsModal";
import { PaperScreen } from "@/components/paper/PaperScreen";
import { RaisedButton } from "@/components/paper/RaisedButton";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";
import { useGameStore } from "@/features/game/gameStore";

export default function PassScreen() {
  const session = useGameStore((state) => state.session);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    if (session.isPlayerlessMode) {
      router.replace("/decks");
      return;
    }

    if (session.players.length === 0) {
      router.replace("/setup");
    }
  }, [session.isPlayerlessMode, session.players.length]);

  if (session.isPlayerlessMode || session.players.length === 0) {
    return null;
  }

  const currentPlayer =
    session.players[session.currentPlayerIndex] ?? "PLAYER";

  return (
    <PaperScreen style={styles.screenContent}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.topSpacer} />

          <Pressable
            onPress={() => setSettingsVisible(true)}
            hitSlop={14}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            style={styles.settingsButton}
          >
            <Text style={styles.settingsText}>⚙︎</Text>
          </Pressable>
        </View>

        <View style={styles.centerContent}>
          <Text style={styles.kicker}>PASS THE PHONE TO</Text>

          <View style={styles.nameCardWrap}>
            <View style={styles.backCardLeft} />
            <View style={styles.backCardRight} />
            <View style={styles.nameShadow} />

            <View style={styles.nameCard}>
              <Text style={styles.cornerMark}>✻</Text>

              <Text style={styles.playerName}>{currentPlayer}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.footerText}>DEEP END</Text>
              </View>
            </View>
          </View>

          <Text style={styles.subcopy}>
            Let them read the next card out loud.
          </Text>
        </View>

        <View style={styles.actions}>
          <RaisedButton
            title="CHOOSE DECK →"
            onPress={() => router.push("/decks")}
          />
        </View>

        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
        />
      </View>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 18,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  topRow: {
    height: 42,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  topSpacer: {
    flex: 1,
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsText: {
    color: paperColors.ink,
    fontSize: 28,
    lineHeight: 30,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: paperSpacing.xl,
  },
  kicker: {
    ...paperType.label,
    color: paperColors.ink,
    fontSize: 12,
    letterSpacing: 2.2,
    textAlign: "center",
  },
  nameCardWrap: {
    width: "100%",
    maxWidth: 286,
    height: 300,
    position: "relative",
  },
  backCardLeft: {
    position: "absolute",
    top: 26,
    left: -8,
    width: "88%",
    height: "84%",
    backgroundColor: paperColors.paperMuted,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    transform: [{ rotate: "-7deg" }],
  },
  backCardRight: {
    position: "absolute",
    top: 20,
    right: -10,
    width: "86%",
    height: "84%",
    backgroundColor: paperColors.paperDust,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    transform: [{ rotate: "6deg" }],
  },
  nameShadow: {
    position: "absolute",
    top: 7,
    left: 7,
    right: -7,
    bottom: -7,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.lg,
  },
  nameCard: {
    position: "relative",
    height: "100%",
    backgroundColor: paperColors.paperLight,
    borderWidth: 3,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.lg,
    alignItems: "center",
    justifyContent: "center",
    padding: paperSpacing.xl,
    transform: [{ rotate: "-1deg" }],
  },
  cornerMark: {
    position: "absolute",
    top: 16,
    right: 18,
    color: paperColors.terracotta,
    fontFamily: paperFonts.serif,
    fontSize: 24,
  },
  playerName: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "700",
    textAlign: "center",
  },
  cardFooter: {
    position: "absolute",
    left: paperSpacing.lg,
    right: paperSpacing.lg,
    bottom: paperSpacing.lg,
    borderTopWidth: 1.5,
    borderTopColor: paperColors.ink,
    borderStyle: "dashed",
    paddingTop: paperSpacing.sm,
    alignItems: "center",
  },
  footerText: {
    color: paperColors.terracotta,
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "800",
  },
  subcopy: {
    color: paperColors.ink,
    opacity: 0.6,
    fontSize: 13,
    textAlign: "center",
  },
  actions: {
    gap: paperSpacing.lg,
    paddingBottom: 4,
  },
});