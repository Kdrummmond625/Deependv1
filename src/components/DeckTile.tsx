import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useGameStore } from "@/features/game/gameStore";

type DeckTileProps = {
  name: string;
  description: string;
  isLocked?: boolean;
  label?: string;
  onPress: () => void;
};

export function DeckTile({
  name,
  description,
  isLocked = false,
  label,
  onPress,
}: DeckTileProps) {
  const hapticsEnabled = useGameStore((state) => state.settings.hapticsEnabled);

  const handlePress = async () => {
    if (isLocked) return;

    if (hapticsEnabled) {
      await Haptics.selectionAsync();
    }

    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLocked}
      accessibilityRole="button"
      accessibilityLabel={`${name}. ${description}`}
      style={({ pressed }) => [
        styles.tile,
        pressed && !isLocked && styles.pressed,
        isLocked && styles.locked,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.name}>{name}</Text>

        {!!label && (
          <View style={styles.labelPill}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
        )}
      </View>

      <Text style={styles.description}>{description}</Text>

      {isLocked && <Text style={styles.lockText}>Locked</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  locked: {
    opacity: 0.45,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  name: {
    ...typography.heading,
    color: colors.cream,
    flex: 1,
  },
  description: {
    ...typography.body,
    color: colors.mutedCream,
  },
  labelPill: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  labelText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  lockText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});