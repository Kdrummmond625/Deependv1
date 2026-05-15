import { StyleSheet, View } from "react-native";
import { paperColors } from "@/constants/paperTheme";

type DashedLineProps = {
  dashCount?: number;
};

export function DashedLine({ dashCount = 18 }: DashedLineProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: dashCount }).map((_, index) => (
        <View key={index} style={styles.dash} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dash: {
    width: 8,
    height: 1.5,
    borderRadius: 999,
    backgroundColor: paperColors.ink,
    opacity: 0.75,
  },
});