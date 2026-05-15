import { Pressable, StyleSheet, Text, View } from "react-native";
import { DashedLine } from "@/components/paper/DashedLine";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";

type PlayingCardProps = {
  deckLabel: string;
  prompt: string;
  cardNumber?: number;
  totalCards?: number;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
};

export function PlayingCard({
  deckLabel,
  prompt,
  cardNumber,
  totalCards,
  isFavorited = false,
  onToggleFavorite,
}: PlayingCardProps) {
  const hasCount =
    typeof cardNumber === "number" &&
    typeof totalCards === "number" &&
    totalCards > 0;

  return (
    <View style={styles.stackWrap}>
      <View style={styles.backCardLeft} />
      <View style={styles.backCardRight} />

      <View style={styles.mainCardShadow} />

      <View style={styles.mainCard}>
        <View style={styles.cardHeader}>
          <View style={styles.deckPill}>
            <Text style={styles.deckPillText}>{deckLabel}</Text>
          </View>

          <Pressable
            onPress={onToggleFavorite}
            hitSlop={12}
            disabled={!onToggleFavorite}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorited ? "Remove card from favorites" : "Favorite card"
            }
            accessibilityState={{ selected: isFavorited }}
            style={[
              styles.favoriteButton,
              isFavorited && styles.favoriteButtonActive,
            ]}
          >
            <Text
              style={[
                styles.favoriteText,
                isFavorited && styles.favoriteTextActive,
              ]}
            >
              {isFavorited ? "♥" : "♡"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.promptWrap}>
          <Text style={styles.prompt}>{prompt}</Text>
        </View>

        <View style={styles.footerWrap}>
  <DashedLine />

  <View style={styles.footer}>
    <Text style={styles.countText}>
      {hasCount ? `#${cardNumber} / ${totalCards}` : "DEEP END"}
    </Text>

    <Text style={styles.brandText}>DEEP END</Text>
  </View>
</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stackWrap: {
    width: "100%",
    height: 292,
    position: "relative",
    marginBottom: paperSpacing.xl,
  },
  backCardLeft: {
    position: "absolute",
    top: 24,
    left: -12,
    width: "88%",
    height: "86%",
    backgroundColor: paperColors.paperMuted,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    transform: [{ rotate: "-6deg" }],
  },
  backCardRight: {
    position: "absolute",
    top: 18,
    right: -14,
    width: "86%",
    height: "86%",
    backgroundColor: paperColors.paperDust,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    transform: [{ rotate: "5deg" }],
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
    padding: paperSpacing.lg,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deckPill: {
    backgroundColor: paperColors.gold,
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deckPillText: {
    ...paperType.label,
    color: paperColors.ink,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: paperColors.ink,
    backgroundColor: paperColors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButtonActive: {
    backgroundColor: paperColors.terracotta,
  },
  favoriteText: {
    color: paperColors.ink,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "800",
  },
  favoriteTextActive: {
    color: paperColors.paper,
  },
  promptWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: paperSpacing.xs,
  },
  prompt: {
    ...paperType.prompt,
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    textAlign: "center",
  },
  footerWrap: {
  gap: paperSpacing.sm,
},
footer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},
  countText: {
    color: paperColors.ink,
    opacity: 0.78,
    fontSize: 11,
    fontWeight: "500",
  },
  brandText: {
    color: paperColors.terracotta,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "700",
  },
});