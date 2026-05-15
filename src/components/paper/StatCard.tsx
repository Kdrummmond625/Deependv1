import { StyleSheet, Text, View } from "react-native";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";

type StatCardProps = {
  value: string | number;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.shadow} />

      <View style={styles.card}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    position: "relative",
  },
  shadow: {
    position: "absolute",
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.md,
  },
  card: {
    minHeight: 92,
    backgroundColor: paperColors.paperLight,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    paddingVertical: paperSpacing.lg,
    paddingHorizontal: paperSpacing.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: paperSpacing.xs,
  },
  value: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 31,
    lineHeight: 34,
    fontWeight: "700",
    textAlign: "center",
  },
  label: {
    ...paperType.label,
    color: paperColors.ink,
    opacity: 0.72,
    textAlign: "center",
  },
});