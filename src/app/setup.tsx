import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/components/AppButton";
import { AppScreen } from "@/components/AppScreen";
import { AppTextInput } from "@/components/AppTextInput";
import { HeaderGear } from "@/components/HeaderGear";
import { SettingStepper } from "@/components/SettingStepper";
import { SettingsModal } from "@/components/SettingsModal";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
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
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View />
          <HeaderGear onPress={() => setSettingsVisible(true)} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Who&apos;s Playing</Text>
          <Text style={styles.subtitle}>customize your experience</Text>
        </View>

        <View style={styles.playerList}>
          {players.map((player, index) => (
            <View key={index} style={styles.playerRow}>
              <Text style={styles.number}>{index + 1}</Text>

              <AppTextInput
                value={player}
                onChangeText={(value) => updatePlayer(index, value)}
                placeholder="NAME"
                style={styles.playerInput}
              />

              <Pressable
                onPress={() => removePlayer(index)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={`Remove player ${index + 1}`}
                style={styles.removeInline}
              >
                <Text style={styles.removeInlineText}>×</Text>
              </Pressable>
            </View>
          ))}

          <Pressable
            onPress={addPlayer}
            style={styles.addRow}
            accessibilityRole="button"
            accessibilityLabel="Add another player"
          >
            <View style={styles.addCircle}>
              <Text style={styles.addCircleText}>+</Text>
            </View>
            <Text style={styles.addText}>Add another player</Text>
            <Text style={styles.countText}>{players.length}/8</Text>
          </Pressable>
        </View>

        <View style={styles.settingsRow}>
          <SettingStepper
            label="Pass Frequency (Cards)"
            value={settings.passFrequency}
            min={1}
            max={5}
            onChange={(value) => updateSettings({ passFrequency: value })}
          />

          <SettingStepper
            label="Haptic Timer (Mins)"
            value={settings.hapticTimerMinutes}
            min={1}
            max={15}
            onChange={(value) => updateSettings({ hapticTimerMinutes: value })}
          />
        </View>

        <View style={styles.bottomActions}>
          <AppButton title="LET’S GO" onPress={handleStart} />
          <Text style={styles.skipJustCards} onPress={handleSkipNames}>
            SKIP - Just the cards
          </Text>
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
  container: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    ...typography.heading,
    color: colors.cream,
    textAlign: "center",
  },
  subtitle: {
    color: colors.mutedCream,
    fontSize: 12,
    textAlign: "center",
  },
  playerList: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  number: {
    width: 18,
    color: colors.mutedCream,
    fontSize: 12,
    textAlign: "center",
  },
  playerInput: {
    flex: 1,
    minHeight: 36,
    fontSize: 12,
  },
  removeInline: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  removeInlineText: {
    color: colors.mutedCream,
    fontSize: 22,
    lineHeight: 22,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  addCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  addCircleText: {
    color: colors.cream,
    fontSize: 14,
    fontWeight: "700",
  },
  addText: {
    color: colors.mutedCream,
    fontSize: 13,
    flex: 1,
  },
  countText: {
    color: colors.mutedCream,
    fontSize: 12,
  },
  settingsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: "auto",
    marginBottom: spacing.lg,
  },
  bottomActions: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  skipJustCards: {
    color: colors.mutedCream,
    fontSize: 12,
    textAlign: "center",
  },
});