import { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { AppScreen } from "@/components/AppScreen";
import { HeaderGear } from "@/components/HeaderGear";
import { SettingsModal } from "@/components/SettingsModal";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { decks } from "@/data/decks";
import { startCardFlow } from "@/features/game/startCardFlow";
import { useGameStore } from "@/features/game/gameStore";
import { getUnlockedDeckIds } from "@/features/purchases/purchaseTypes";
import { DeckId } from "@/types/deck";

const hasFullAccess = true;

const unlockedDeckIds = getUnlockedDeckIds(hasFullAccess);

const availableDeckIds = decks
  .filter((deck) => unlockedDeckIds.includes(deck.id))
  .map((deck) => deck.id) as DeckId[];

export default function DecksScreen() {
  const session = useGameStore((state) => state.session);
  const selectSingleDeck = useGameStore((state) => state.selectSingleDeck);
  const selectRandomize = useGameStore((state) => state.selectRandomize);

  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleLockedDeck = () => {
    Alert.alert(
      "Full deck locked",
      "This deck will be part of the full version.",
      [
        {
          text: "Not Now",
          style: "cancel",
        },
        {
          text: "Continue",
          style: "default",
        },
      ],
      { cancelable: true }
    );
  };

  const handleSelectDeck = (deckId: DeckId) => {
    const isUnlocked = unlockedDeckIds.includes(deckId);

    if (!isUnlocked) {
      handleLockedDeck();
      return;
    }

    selectSingleDeck(deckId);
    startCardFlow({ activeDeckIds: [deckId] });
  };

  const handleRandomizeAll = () => {
    selectRandomize(availableDeckIds);
    startCardFlow({ activeDeckIds: availableDeckIds });
  };

  const renderItem = ({ item }: { item: (typeof decks)[number] }) => {
    const isUnlocked = unlockedDeckIds.includes(item.id);
    const deckStatus = isUnlocked ? (item.isFree ? "FREE" : "UNLOCKED") : "LOCKED";

    return (
      <Pressable
        onPress={() => handleSelectDeck(item.id)}
        style={[styles.tile, !isUnlocked && styles.lockedTile]}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}. ${item.shortDescription}. ${deckStatus}`}
      >
        <View style={styles.tileTopRow}>
          <Text style={styles.tileTitle}>{item.name.toUpperCase()}</Text>
          <Text style={styles.deckStatus}>{deckStatus}</Text>
        </View>

        <Text style={styles.tileBody}>{item.shortDescription}</Text>
      </Pressable>
    );
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View />
          <HeaderGear onPress={() => setSettingsVisible(true)} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Choose a deck.</Text>
        </View>

        <FlatList
          data={decks}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrap}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          scrollEnabled={false}
        />

        <Pressable
          onPress={handleRandomizeAll}
          style={styles.randomizeButton}
          accessibilityRole="button"
          accessibilityLabel="Random Mix. Pull from unlocked decks."
        >
          <Text style={styles.randomizeText}>RANDOM MIX</Text>
          <Text style={styles.randomizeSubtext}>Pull from unlocked decks.</Text>
        </Pressable>

        <Text
          style={styles.backText}
          onPress={() =>
            router.replace(session.isPlayerlessMode ? "/setup" : "/pass")
          }
        >
          Back
        </Text>

        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    height: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.cream,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "700",
  },
  listContent: {
    gap: spacing.md,
  },
  columnWrap: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  tile: {
    flex: 1,
    minHeight: 110,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    padding: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.03)",
    justifyContent: "space-between",
  },
  lockedTile: {
    opacity: 0.48,
  },
  tileTopRow: {
    gap: spacing.xs,
  },
  tileTitle: {
    color: colors.cream,
    fontSize: 14,
    fontWeight: "700",
  },
  deckStatus: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  tileBody: {
    color: colors.mutedCream,
    fontSize: 11,
    lineHeight: 14,
  },
  randomizeButton: {
    marginTop: spacing.md,
    minHeight: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.terracotta,
    gap: 2,
  },
  randomizeText: {
    color: colors.cream,
    fontSize: 14,
    fontWeight: "700",
  },
  randomizeSubtext: {
    color: colors.cream,
    opacity: 0.82,
    fontSize: 11,
  },
  backText: {
    color: colors.mutedCream,
    fontSize: 13,
    textAlign: "center",
    marginTop: spacing.md,
  },
});