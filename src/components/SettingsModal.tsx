import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import {
  shouldShowDevPurchaseControls,
  shouldUseRevenueCat,
} from "@/features/revenuecat/revenueCatConfig";
import { PaperStepper } from "@/components/paper/PaperStepper";
import { RaisedButton } from "@/components/paper/RaisedButton";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";
import { BASE_GAME_PRODUCT_ID } from "@/features/access/accessRules";
import { useAccessStore } from "@/features/access/accessStore";
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

  const unlockedProductIds = useAccessStore(
    (state) => state.unlockedProductIds
  );
  const unlockProduct = useAccessStore((state) => state.unlockProduct);
  const lockProduct = useAccessStore((state) => state.lockProduct);
  const syncRevenueCatAccess = useAccessStore(
    (state) => state.syncRevenueCatAccess
  );
  const isSyncingRevenueCatAccess = useAccessStore(
    (state) => state.isSyncingRevenueCatAccess
  );

  const baseGameIsUnlocked = unlockedProductIds.includes(BASE_GAME_PRODUCT_ID);
  const showDevPurchaseControls = shouldShowDevPurchaseControls();

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

  const handleUnlockBaseGame = () => {
    unlockProduct(BASE_GAME_PRODUCT_ID);
  };

  const handleResetBaseGame = () => {
    Alert.alert(
      "Reset Base Game access?",
      "This will lock the Base Game again for testing.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => lockProduct(BASE_GAME_PRODUCT_ID),
        },
      ],
      { cancelable: true }
    );
  };

  const handleRestorePurchases = async () => {
    if (!shouldUseRevenueCat()) {
      Alert.alert(
        "Restore unavailable",
        "Purchases are not available in this build."
      );
      return;
    }

    try {
      const { restoreRevenueCatPurchases } = await import(
        "@/features/revenuecat/revenueCatService"
      );

      const restoredBaseGame = await restoreRevenueCatPurchases();

      if (restoredBaseGame) {
        await syncRevenueCatAccess();

        Alert.alert(
          "Purchases restored",
          "Base Game access has been restored."
        );
        return;
      }

      Alert.alert(
        "No purchases found",
        "No Base Game purchase was found for this Apple ID."
      );
    } catch {
      Alert.alert(
        "Restore failed",
        "Purchases could not be restored. Try again later."
      );
    }
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
                <Text style={styles.toggleTitle}>Time Check</Text>
<Text style={styles.toggleBody}>
  Shows a reminder when a card has been open for a while.
</Text>
              </View>

              <Pressable
                onPress={toggleHaptics}
                accessibilityRole="switch"
                accessibilityState={{ checked: settings.hapticsEnabled }}
                accessibilityLabel="Toggle time check"
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

            {showDevPurchaseControls && (
              <View style={styles.accessPanel}>
                <Text style={styles.accessLabel}>DEV TESTING ONLY</Text>

                <Text style={styles.accessStatus}>
                  Base Game:{" "}
                  <Text style={styles.accessStatusStrong}>
                    {baseGameIsUnlocked ? "Unlocked" : "Locked"}
                  </Text>
                </Text>

                <View style={styles.accessActions}>
                  <RaisedButton
                    title={
                      baseGameIsUnlocked
                        ? "BASE GAME UNLOCKED"
                        : "UNLOCK BASE GAME"
                    }
                    variant="gold"
                    onPress={handleUnlockBaseGame}
                    disabled={baseGameIsUnlocked}
                  />

                  <RaisedButton
                    title="RESET BASE GAME LOCK"
                    variant="danger"
                    onPress={handleResetBaseGame}
                    disabled={!baseGameIsUnlocked}
                  />
                </View>
              </View>
            )}

            <View style={styles.actions}>
              <RaisedButton
                title={
                  isSyncingRevenueCatAccess
                    ? "RESTORING..."
                    : "RESTORE PURCHASES"
                }
                variant="gold"
                onPress={handleRestorePurchases}
                disabled={isSyncingRevenueCatAccess}
              />

              <RaisedButton
                title="REPLAY TUTORIAL"
                variant="secondary"
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
  accessPanel: {
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    backgroundColor: paperColors.paper,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.lg,
    gap: paperSpacing.sm,
  },
  accessLabel: {
    color: paperColors.terracotta,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "900",
  },
  accessStatus: {
    color: paperColors.ink,
    fontSize: 13,
    fontWeight: "600",
  },
  accessStatusStrong: {
    fontWeight: "900",
  },
  accessActions: {
    gap: paperSpacing.sm,
  },
  actions: {
    gap: paperSpacing.md,
  },
});