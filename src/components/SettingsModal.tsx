import { Alert, Modal, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/components/AppButton";
import { SettingStepper } from "@/components/SettingStepper";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useGameStore } from "@/features/game/gameStore";

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  showEndGame?: boolean;
};

export function SettingsModal({
  visible,
  onClose,
  showEndGame = true,
}: SettingsModalProps) {
  const settings = useGameStore((state) => state.settings);
  const updateSettings = useGameStore((state) => state.updateSettings);

  const handleReplayTutorial = () => {
    onClose();
    router.push("/onboarding");
  };

  const handleEndGame = () => {
    Alert.alert(
      "End session?",
      "This will end the current game.",
      [
        {
          text: "Keep Playing",
          style: "cancel",
        },
        {
          text: "End Game",
          style: "destructive",
          onPress: () => {
            onClose();
            router.push("/end");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close settings"
        />

        <View style={styles.panel}>
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>SETTINGS</Text>
              <Text style={styles.title}>Keep the game moving</Text>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close settings"
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <SettingStepper
              label="Pass Every"
              value={settings.passFrequency}
              min={1}
              max={5}
              onChange={(value) => updateSettings({ passFrequency: value })}
            />

            <SettingStepper
              label="Timer"
              value={settings.hapticTimerMinutes}
              min={1}
              max={15}
              onChange={(value) =>
                updateSettings({ hapticTimerMinutes: value })
              }
            />
          </View>

          <View style={styles.switchSection}>
            <View style={styles.switchRow}>
              <View style={styles.switchCopy}>
                <Text style={styles.switchLabel}>Haptics</Text>
                <Text style={styles.switchDescription}>
                  Interaction feedback and timer nudges.
                </Text>
              </View>

              <Switch
                value={settings.hapticsEnabled}
                onValueChange={(value) =>
                  updateSettings({ hapticsEnabled: value })
                }
                thumbColor={colors.cream}
                trackColor={{
                  false: "rgba(244,235,221,0.18)",
                  true: colors.terracotta,
                }}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <AppButton
              title="REPLAY HOW TO PLAY"
              variant="secondary"
              onPress={handleReplayTutorial}
            />

            {showEndGame && (
              <AppButton
                title="END GAME"
                variant="danger"
                onPress={handleEndGame}
              />
            )}

            <AppButton title="CLOSE" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.forest,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
  title: {
    ...typography.heading,
    color: colors.cream,
    marginTop: spacing.xs,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: colors.mutedCream,
    fontSize: 28,
    lineHeight: 28,
  },
  section: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  switchSection: {
    gap: spacing.md,
  },
  switchRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: spacing.md,
  },
  switchCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  switchLabel: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: "700",
  },
  switchDescription: {
    color: colors.mutedCream,
    fontSize: 12,
    lineHeight: 16,
  },
  actions: {
    gap: spacing.md,
  },
});