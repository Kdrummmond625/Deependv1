import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { PaperStepper } from "@/components/paper/PaperStepper";
import { RaisedButton } from "@/components/paper/RaisedButton";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";
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

  const toggleHaptics = () => {
    updateSettings({
      hapticsEnabled: !settings.hapticsEnabled,
    });
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

        <View style={styles.sheetWrap}>
          <View style={styles.sheetShadow} />

          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>SETTINGS</Text>
                </View>

                <Text style={styles.title}>Keep the game moving.</Text>
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

            <View style={styles.stepperRow}>
              <PaperStepper
                label="PASS EVERY"
                value={settings.passFrequency}
                min={1}
                max={5}
                accentColor={paperColors.gold}
                onChange={(value) => updateSettings({ passFrequency: value })}
              />

              <PaperStepper
                label="TIMER (MIN)"
                value={settings.hapticTimerMinutes}
                min={1}
                max={15}
                accentColor={paperColors.terracotta}
                onChange={(value) =>
                  updateSettings({ hapticTimerMinutes: value })
                }
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleAccent} />

              <View style={styles.toggleCopy}>
                <Text style={styles.toggleTitle}>Haptics</Text>
                <Text style={styles.toggleBody}>
                  Interaction feedback and timer nudges.
                </Text>
              </View>

              <Pressable
                onPress={toggleHaptics}
                accessibilityRole="switch"
                accessibilityState={{ checked: settings.hapticsEnabled }}
                accessibilityLabel="Toggle haptics"
                style={[
                  styles.switchTrack,
                  !settings.hapticsEnabled && styles.switchOff,
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    settings.hapticsEnabled && styles.switchThumbOn,
                  ]}
                />
              </Pressable>
            </View>

            <View style={styles.actions}>
              <RaisedButton
                title="REPLAY TUTORIAL"
                variant="gold"
                onPress={handleReplayTutorial}
              />

              {showEndGame && (
                <RaisedButton
                  title="END GAME"
                  variant="danger"
                  onPress={handleEndGame}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(7, 21, 18, 0.55)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetWrap: {
    position: "relative",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sheetShadow: {
    position: "absolute",
    top: 7,
    left: 7,
    right: -7,
    bottom: -7,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.xl,
  },
  sheet: {
    backgroundColor: paperColors.paperLight,
    borderWidth: 3,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.xl,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.lg,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: paperRadii.pill,
    backgroundColor: paperColors.ink,
    opacity: 0.28,
    alignSelf: "center",
    marginBottom: paperSpacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: paperSpacing.lg,
    gap: paperSpacing.md,
  },
  headerCopy: {
    flex: 1,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: paperColors.gold,
    borderWidth: 1.8,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: paperSpacing.sm,
  },
  badgeText: {
    ...paperType.label,
    color: paperColors.ink,
    letterSpacing: 2,
  },
  title: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 23,
    lineHeight: 27,
    fontWeight: "700",
  },
  closeButton: {
    width: 34,
    height: 34,
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: 17,
    backgroundColor: paperColors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: paperColors.ink,
    fontSize: 24,
    lineHeight: 25,
    fontWeight: "700",
  },
  stepperRow: {
    flexDirection: "row",
    gap: paperSpacing.sm,
    marginBottom: paperSpacing.lg,
  },
  toggleRow: {
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    backgroundColor: paperColors.paper,
    paddingVertical: paperSpacing.md,
    paddingHorizontal: paperSpacing.md,
    marginBottom: paperSpacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: paperSpacing.md,
    overflow: "hidden",
  },
  toggleAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 7,
    backgroundColor: paperColors.moss,
  },
  toggleCopy: {
    flex: 1,
    paddingLeft: paperSpacing.sm,
  },
  toggleTitle: {
    color: paperColors.ink,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  toggleBody: {
    color: paperColors.ink,
    opacity: 0.62,
    fontSize: 11,
    lineHeight: 15,
  },
  switchTrack: {
    width: 48,
    height: 28,
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.pill,
    backgroundColor: paperColors.terracotta,
    padding: 2,
    justifyContent: "center",
  },
  switchOff: {
    backgroundColor: paperColors.paperMuted,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: paperColors.ink,
    backgroundColor: paperColors.paper,
  },
  switchThumbOn: {
    alignSelf: "flex-end",
  },
  actions: {
    gap: paperSpacing.md,
  },
});