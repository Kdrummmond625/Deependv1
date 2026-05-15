import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";

type DeckMiniCardProps = {
  name: string;
  description: string;
  status: string;
  accentColor?: string;
  rotation?: "-1deg" | "1deg" | "0deg";
  disabled?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function DeckMiniCard({
  name,
  description,
  status,
  accentColor = paperColors.terracotta,
  rotation = "0deg",
  disabled = false,
  onPress,
  accessibilityLabel,
}: DeckMiniCardProps) {
  const titleParts = name.replace(" or ", "\n").toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      disabled={false}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? `${name}. ${description}. ${status}`
      }
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.wrap,
        { transform: [{ rotate: rotation }] },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.shadow} />

      <View style={styles.card}>
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <View style={styles.titleWrap}>
          <Text style={styles.title}>{titleParts}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.bottomRow}>
  <View />

  <View
    style={[
      styles.statusPill,
      status === "FREE" && styles.freePill,
      status === "LOCKED" && styles.lockedPill,
    ]}
  >
    <Text style={styles.statusText}>{status}</Text>
  </View>
</View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({

    bottomRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
  wrap: {
  flex: 1,
  height: 152,
  position: "relative",
  paddingBottom: 10,
},
shadow: {
  position: "absolute",
  top: 5,
  left: 5,
  right: -5,
  bottom: 5,
  backgroundColor: paperColors.ink,
  borderRadius: paperRadii.sm,
},
card: {
  flex: 1,
  backgroundColor: paperColors.paperLight,
  borderWidth: 2.5,
  borderColor: paperColors.ink,
  borderRadius: paperRadii.sm,
  padding: paperSpacing.md,
  justifyContent: "space-between",
},
  accentBar: {
    height: 7,
    borderRadius: paperRadii.pill,
    marginBottom: paperSpacing.sm,
  },
  titleWrap: {
    gap: 5,
  },
  title: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 17,
    lineHeight: 18,
    fontWeight: "600",
  },
  description: {
    color: paperColors.ink,
    opacity: 0.58,
    fontSize: 11,
    lineHeight: 15,
  },
  statusPill: {
    alignSelf: "flex-start",
    borderWidth: 1.7,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    backgroundColor: paperColors.paperLight,
  },
  freePill: {
    backgroundColor: paperColors.gold,
  },
  lockedPill: {
    opacity: 0.62,
  },
  statusText: {
    ...paperType.label,
    color: paperColors.ink,
    fontSize: 9,
    letterSpacing: 1.4,
  },
  disabled: {
    opacity: 0.58,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
});
