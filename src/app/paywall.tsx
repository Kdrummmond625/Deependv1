import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { PaperScreen } from "@/components/paper/PaperScreen";
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
import { shouldUseRevenueCat } from "@/features/revenuecat/revenueCatConfig";

export default function PaywallScreen() {
  const unlockProduct = useAccessStore((state) => state.unlockProduct);
  const unlockedProductIds = useAccessStore(
    (state) => state.unlockedProductIds
  );

  const [isPurchasing, setIsPurchasing] = useState(false);

  const baseGameIsUnlocked = unlockedProductIds.includes(BASE_GAME_PRODUCT_ID);

  const handleUnlockBaseGame = async () => {
  if (baseGameIsUnlocked || isPurchasing) return;

  if (!shouldUseRevenueCat()) {
    Alert.alert(
      "Purchases unavailable",
      "Purchases are not available in this build."
    );
    return;
  }

  setIsPurchasing(true);

  try {
    const { purchaseBaseGame } = await import(
      "@/features/revenuecat/revenueCatService"
    );

    const purchasedBaseGame = await purchaseBaseGame();

    if (purchasedBaseGame) {
      unlockProduct(BASE_GAME_PRODUCT_ID);

      Alert.alert("Base Game unlocked", "The Base Game is now available.", [
        {
          text: "Continue",
          onPress: () => router.replace("/decks"),
        },
      ]);

      return;
    }

    Alert.alert(
      "Purchase unavailable",
      "This purchase could not be completed right now. Please try again later."
    );
  } catch {
    Alert.alert(
      "Purchase failed",
      "The purchase could not be completed. Please try again later."
    );
  } finally {
    setIsPurchasing(false);
  }
};

  return (
    <PaperScreen style={styles.screenContent}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.badgeWrap}>
            <View style={styles.badgeShadow} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BASE GAME</Text>
            </View>
          </View>

          <Text style={styles.title}>Unlock the Base Game.</Text>

          <Text style={styles.body}>
            Five more decks built around the choices people make when the
            moment gets real.
          </Text>
        </View>

        <View style={styles.deckList}>
          {[
            "Push or Pull",
            "Guard or Give",
            "Press or Accept",
            "Past or Present",
            "Keep or Release",
          ].map((name) => (
            <View key={name} style={styles.deckRow}>
              <Text style={styles.deckName}>{name}</Text>
              <Text style={styles.deckMark}>✻</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <RaisedButton
            title={
              baseGameIsUnlocked
                ? "BASE GAME UNLOCKED"
                : isPurchasing
                  ? "UNLOCKING..."
                  : "UNLOCK BASE GAME"
            }
            onPress={handleUnlockBaseGame}
            disabled={baseGameIsUnlocked || isPurchasing}
          />

          <RaisedButton
            title="MAYBE LATER"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
    paddingTop: 34,
    gap: paperSpacing.lg,
  },
  badgeWrap: {
    position: "relative",
    marginBottom: paperSpacing.sm,
  },
  badgeShadow: {
    position: "absolute",
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.pill,
  },
  badge: {
    backgroundColor: paperColors.gold,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.pill,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  badgeText: {
    ...paperType.button,
    color: paperColors.ink,
  },
  title: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 38,
    lineHeight: 43,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    color: paperColors.ink,
    opacity: 0.68,
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
    maxWidth: 310,
  },
  deckList: {
    gap: paperSpacing.md,
  },
  deckRow: {
    minHeight: 52,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    backgroundColor: paperColors.paperLight,
    paddingHorizontal: paperSpacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deckName: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 20,
    fontWeight: "700",
  },
  deckMark: {
    color: paperColors.terracotta,
    fontFamily: paperFonts.serif,
    fontSize: 22,
  },
  actions: {
    gap: paperSpacing.md,
    paddingBottom: 2,
  },
});