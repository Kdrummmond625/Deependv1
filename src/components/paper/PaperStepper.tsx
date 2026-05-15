import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";
import { useGameStore } from "@/features/game/gameStore";

type PaperStepperProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  accentColor?: string;
};

export function PaperStepper({
  label,
  value,
  min = 1,
  max = 10,
  onChange,
  accentColor = paperColors.gold,
}: PaperStepperProps) {
  const hapticsEnabled = useGameStore((state) => state.settings.hapticsEnabled);

  const handleChange = async (nextValue: number) => {
    if (nextValue === value) return;

    if (hapticsEnabled) {
      await Haptics.selectionAsync();
    }

    onChange(nextValue);
  };

  return (
    <View style={styles.card}>
      <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />

      <Text style={styles.label}>{label}</Text>

      <View style={styles.row}>
        <Pressable
          onPress={() => handleChange(Math.max(min, value - 1))}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
          style={styles.controlButton}
        >
          <Text style={styles.control}>−</Text>
        </Pressable>

        <Text style={styles.value}>{value}</Text>

        <Pressable
          onPress={() => handleChange(Math.min(max, value + 1))}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
          style={styles.controlButton}
        >
          <Text style={styles.control}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    backgroundColor: paperColors.paperLight,
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.sm,
    overflow: "hidden",
  },
  accentStrip: {
    height: 5,
    borderRadius: paperRadii.pill,
    marginBottom: paperSpacing.sm,
  },
  label: {
    ...paperType.label,
    color: paperColors.ink,
    opacity: 0.72,
    marginBottom: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlButton: {
    minWidth: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  control: {
    color: paperColors.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  value: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 22,
    fontWeight: "700",
  },
});