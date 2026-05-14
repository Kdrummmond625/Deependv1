import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { useGameStore } from "@/features/game/gameStore";

type SettingStepperProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export function SettingStepper({
  label,
  value,
  min = 1,
  max = 10,
  onChange,
}: SettingStepperProps) {
  const hapticsEnabled = useGameStore((state) => state.settings.hapticsEnabled);

  const handleChange = async (nextValue: number) => {
    if (nextValue === value) return;

    if (hapticsEnabled) {
      await Haptics.selectionAsync();
    }

    onChange(nextValue);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.row}>
        <Pressable
          hitSlop={8}
          onPress={() => handleChange(Math.max(min, value - 1))}
          style={styles.circle}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
        >
          <Text style={styles.circleText}>−</Text>
        </Pressable>

        <Text style={styles.value}>{value}</Text>

        <Pressable
          hitSlop={8}
          onPress={() => handleChange(Math.min(max, value + 1))}
          style={styles.circle}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
        >
          <Text style={styles.circleText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
    flex: 1,
  },
  label: {
    color: colors.cream,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    color: colors.cream,
    fontSize: 18,
    lineHeight: 18,
    fontWeight: "600",
  },
  value: {
    minWidth: 18,
    textAlign: "center",
    color: colors.cream,
    fontSize: 18,
    fontWeight: "600",
  },
});