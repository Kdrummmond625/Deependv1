import { StyleSheet, Text, View } from "react-native";
import {
  paperColors,
  paperFonts,
  paperRadii,
} from "@/constants/paperTheme";

export function StackedLogoCard() {
  return (
    <View style={styles.deckStack}>
      <View style={styles.backCardLeft} />
      <View style={styles.backCardRight} />

      <View style={styles.mainCardShadow} />

      <View style={styles.mainCard}>
        <Text style={[styles.cornerMark, styles.cornerTopLeft]}>✻</Text>
        <Text style={[styles.cornerMark, styles.cornerTopRight]}>✻</Text>
        <Text style={[styles.cornerMark, styles.cornerBottomLeft]}>✻</Text>
        <Text style={[styles.cornerMark, styles.cornerBottomRight]}>✻</Text>

        <View style={styles.logoShadow} />
        <View style={styles.logoBlock}>
          <Text style={styles.logoText}>DEEP{"\n"}END</Text>
          <View style={styles.logoUnderline} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deckStack: {
    width: 218,
    height: 282,
    position: "relative",
  },
  backCardLeft: {
    position: "absolute",
    top: 34,
    left: -2,
    width: "88%",
    height: "84%",
    backgroundColor: paperColors.paperMuted,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    transform: [{ rotate: "-10deg" }],
  },
  backCardRight: {
    position: "absolute",
    top: 26,
    right: -8,
    width: "86%",
    height: "85%",
    backgroundColor: paperColors.paperDust,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    transform: [{ rotate: "7deg" }],
  },
  mainCardShadow: {
    position: "absolute",
    top: 7,
    left: 7,
    right: -7,
    bottom: -7,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.lg,
  },
  mainCard: {
    position: "relative",
    height: "100%",
    backgroundColor: paperColors.paperLight,
    borderWidth: 3,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.lg,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-2deg" }],
  },
  cornerMark: {
    position: "absolute",
    color: paperColors.gold,
    fontFamily: paperFonts.serif,
    fontSize: 17,
  },
  cornerTopLeft: {
    top: 14,
    left: 15,
  },
  cornerTopRight: {
    top: 14,
    right: 15,
  },
  cornerBottomLeft: {
    bottom: 14,
    left: 15,
  },
  cornerBottomRight: {
    bottom: 14,
    right: 15,
  },
  logoShadow: {
    position: "absolute",
    width: 126,
    height: 100,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.sm,
    transform: [{ translateX: 5 }, { translateY: 5 }, { rotate: "3deg" }],
  },
  logoBlock: {
    width: 126,
    minHeight: 100,
    backgroundColor: paperColors.terracotta,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    paddingHorizontal: 16,
    transform: [{ rotate: "3deg" }],
  },
  logoText: {
    color: paperColors.paper,
    fontFamily: paperFonts.serif,
    fontSize: 26,
    lineHeight: 27,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 1,
  },
  logoUnderline: {
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: paperColors.gold,
    marginTop: 9,
  },
});