import { StyleSheet, Text, View } from "react-native";
import { paperColors, paperFonts } from "@/constants/paperTheme";

export function DoodleLayer() {
  return (
    <View style={styles.layer} pointerEvents="none">
      <Text style={[styles.doodle, styles.starOne]}>✻</Text>
      <Text style={[styles.doodle, styles.starTwo]}>✻</Text>
      <Text style={[styles.doodle, styles.sparkOne]}>✦</Text>
      <Text style={[styles.doodle, styles.circleOne]}>○</Text>
      <Text style={[styles.doodle, styles.lineOne]}>━</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  doodle: {
    position: "absolute",
    fontFamily: paperFonts.serif,
  },
  starOne: {
    top: 34,
    left: 24,
    color: paperColors.gold,
    fontSize: 24,
    transform: [{ rotate: "-12deg" }],
  },
  starTwo: {
    bottom: 92,
    left: 20,
    color: paperColors.terracotta,
    fontSize: 22,
    transform: [{ rotate: "8deg" }],
  },
  sparkOne: {
    top: 230,
    left: 16,
    color: paperColors.ink,
    opacity: 0.28,
    fontSize: 13,
  },
  circleOne: {
    bottom: 44,
    right: 68,
    color: paperColors.gold,
    fontSize: 17,
    transform: [{ rotate: "-15deg" }],
  },
  lineOne: {
    top: 210,
    right: 20,
    color: paperColors.terracotta,
    fontSize: 20,
    transform: [{ rotate: "25deg" }],
  },
});