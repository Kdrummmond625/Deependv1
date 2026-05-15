import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SettingsModal } from "@/components/SettingsModal";
import { InkLink } from "@/components/paper/InkLink";
import { PaperScreen } from "@/components/paper/PaperScreen";
import { PaperStepper } from "@/components/paper/PaperStepper";
import { PlayerNameRow } from "@/components/paper/PlayerNameRow";
import { RaisedButton } from "@/components/paper/RaisedButton";
import {
  paperColors,
  paperFonts,
  paperSpacing,
} from "@/constants/paperTheme";
import { useGameStore } from "@/features/game/gameStore";

const MAX_PLAYERS = 12;

export default function SetupScreen() {
  const startSession = useGameStore((state) => state.startSession);
  const settings = useGameStore((state) => state.settings);
  const updateSettings = useGameStore((state) => state.updateSettings);

  const [players, setPlayers] = useState<string[]>(["", "", ""]);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const updatePlayer = (index: number, value: string) => {
    setPlayers((current) =>
      current.map((player, i) => (i === index ? value : player))
    );
  };

  const addPlayer = () => {
    if (players.length >= MAX_PLAYERS) return;
    setPlayers((current) => [...current, ""]);
  };

  const removePlayer = (index: number) => {
    setPlayers((current) => {
      const nextPlayers = current.filter((_, i) => i !== index);
      return nextPlayers.length > 0 ? nextPlayers : [""];
    });
  };

  const handleStart = () => {
    const cleanPlayers = players.map((p) => p.trim()).filter(Boolean);
    startSession(cleanPlayers);

    if (cleanPlayers.length === 0) {
      router.replace("/decks");
      return;
    }

    router.replace("/pass");
  };

  const handleSkipNames = () => {
    startSession([]);
    router.replace("/decks");
  };

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

        <View style={styles.header}>
          <Text style={styles.title}>Who's playing?</Text>
          <Text style={styles.subtitle}>customize your experience</Text>
        </View>

        <View style={styles.playerList}>
          {players.map((player, index) => (
            <PlayerNameRow
              key={index}
              index={index}
              value={player}
              onChangeText={(value) => updatePlayer(index, value)}
              onRemove={() => removePlayer(index)}
            />
          ))}

          <Pressable
            onPress={addPlayer}
            disabled={players.length >= MAX_PLAYERS}
            accessibilityRole="button"
            accessibilityLabel="Add another player"
            accessibilityState={{ disabled: players.length >= MAX_PLAYERS }}
            style={[
              styles.addRow,
              players.length >= MAX_PLAYERS && styles.disabled,
            ]}
          >
            <View style={styles.addCircle}>
              <Text style={styles.addPlus}>+</Text>
            </View>

            <Text style={styles.addText}>Add another player</Text>
            <Text style={styles.countText}>{players.length}/{MAX_PLAYERS}</Text>
          </Pressable>
        </View>

        <View style={styles.stepperRow}>
          <PaperStepper
            label="PASS EVERY"
            value={settings.passFrequency}
            min={1}
            max={5}
            onChange={(value) => updateSettings({ passFrequency: value })}
          />

          <PaperStepper
            label="TIMER (MIN)"
            value={settings.hapticTimerMinutes}
            min={1}
            max={15}
            onChange={(value) => updateSettings({ hapticTimerMinutes: value })}
          />
        </View>

        <View style={styles.actions}>
          <RaisedButton title="LET'S GO →" onPress={handleStart} />

          <InkLink
            title="SKIP — just the cards"
            onPress={handleSkipNames}
            accessibilityLabel="Skip player names and play with just the cards"
          />
        </View>

        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          showEndGame={false}
        />
      </View>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
  container: {
    flex: 1,
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
  header: {
    alignItems: "center",
    marginTop: 18,
    marginBottom: 24,
  },
  title: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 33,
    lineHeight: 37,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    color: paperColors.ink,
    opacity: 0.62,
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
  playerList: {
    gap: 11,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: paperSpacing.sm,
    paddingVertical: 8,
  },
  addCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: paperColors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  addPlus: {
    color: paperColors.ink,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "700",
  },
  addText: {
    color: paperColors.ink,
    opacity: 0.75,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  countText: {
    color: paperColors.ink,
    opacity: 0.55,
    fontFamily: paperFonts.serif,
    fontSize: 12,
  },
  stepperRow: {
    flexDirection: "row",
    gap: paperSpacing.sm,
    marginTop: "auto",
    marginBottom: 18,
  },
  actions: {
    gap: 14,
    paddingBottom: 4,
  },
  disabled: {
    opacity: 0.45,
  },
});