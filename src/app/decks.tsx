import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SettingsModal } from "@/components/SettingsModal";
import { DeckMiniCard } from "@/components/paper/DeckMiniCard";
import { PaperScreen } from "@/components/paper/PaperScreen";
import { RaisedButton } from "@/components/paper/RaisedButton";
import {
  paperColors,
  paperFonts,
  paperSpacing,
} from "@/constants/paperTheme";
import { decks } from "@/data/decks";
import {
  deckHasCards,
  getCardCountForDeck,
  getDeckIdsWithCards,
} from "@/features/game/cardStats";
import { startCardFlow } from "@/features/game/startCardFlow";
import { useGameStore } from "@/features/game/gameStore";
import { useFavoritesStore } from "@/features/favorites/favoritesStore";
import { DeckId } from "@/types/deck";

const TEST_FULL_ACCESS = true;

const unlockedDeckIds = TEST_FULL_ACCESS
  ? (decks.map((deck) => deck.id) as DeckId[])
  : (decks.filter((deck) => deck.isFree).map((deck) => deck.id) as DeckId[]);

const availableDeckIds = getDeckIdsWithCards(
  decks
    .filter((deck) => unlockedDeckIds.includes(deck.id) && !deck.isLocked)
    .map((deck) => deck.id) as DeckId[]
);

const deckAccentMap: Record<DeckId, string> = {
  ask_assume: paperColors.terracotta,
  push_pull: paperColors.terracotta,
  guard_give: paperColors.gold,
  press_accept: paperColors.ink,
  past_present: paperColors.gold,
  keep_release: paperColors.ink,
};

const deckRotations: Array<"-1deg" | "1deg" | "0deg"> = [
  "-1deg",
  "1deg",
  "1deg",
  "-1deg",
  "-1deg",
  "1deg",
];

export default function DecksScreen() {
  const session = useGameStore((state) => state.session);
  const selectSingleDeck = useGameStore((state) => state.selectSingleDeck);
  const selectRandomize = useGameStore((state) => state.selectRandomize);

  const favorites = useFavoritesStore((state) => state.favorites);
  const hydrateFavorites = useFavoritesStore((state) => state.hydrateFavorites);

  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    void hydrateFavorites();
  }, [hydrateFavorites]);

  const handleBack = () => {
    router.replace(session.isPlayerlessMode ? "/setup" : "/pass");
  };

  const handleLockedDeck = () => {
    Alert.alert(
      "Deck locked",
      "This deck will be part of the full version.",
      [{ text: "Close", style: "cancel" }],
      { cancelable: true }
    );
  };

  const handleEmptyDeck = () => {
    Alert.alert(
      "No cards loaded",
      "This deck does not have cards loaded in this build.",
      [{ text: "Close", style: "cancel" }],
      { cancelable: true }
    );
  };

  const handleSelectDeck = (deckId: DeckId) => {
    const deck = decks.find((item) => item.id === deckId);
    const isUnlocked = unlockedDeckIds.includes(deckId);
    const hasCards = deckHasCards(deckId);

    if (!deck) return;

    if (deck.isLocked || !isUnlocked) {
      handleLockedDeck();
      return;
    }

    if (!hasCards) {
      handleEmptyDeck();
      return;
    }

    selectSingleDeck(deckId);
    startCardFlow({ activeDeckIds: [deckId] });
  };

  const handleRandomizeAll = () => {
    if (availableDeckIds.length === 0) {
      Alert.alert(
        "No cards available",
        "There are no unlocked cards available for Random Mix.",
        [{ text: "Close", style: "cancel" }],
        { cancelable: true }
      );
      return;
    }

    selectRandomize(availableDeckIds);
    startCardFlow({ activeDeckIds: availableDeckIds });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof decks)[number];
    index: number;
  }) => {
    const cardCount = getCardCountForDeck(item.id);
    const isUnlocked = unlockedDeckIds.includes(item.id) && !item.isLocked;
    const hasCards = cardCount > 0;
    const isPlayable = isUnlocked && hasCards;

    const status = !isUnlocked || item.isLocked
      ? "LOCKED"
      : item.isFree
        ? "FREE"
        : `${cardCount} CARDS`;

    return (
      <DeckMiniCard
        name={item.name}
        description={item.shortDescription}
        status={status}
        accentColor={deckAccentMap[item.id]}
        rotation={deckRotations[index] ?? "0deg"}
        disabled={!isPlayable}
        onPress={() => handleSelectDeck(item.id)}
        accessibilityLabel={`${item.name}. ${item.shortDescription}. ${status}`}
      />
    );
  };

  return (
    <PaperScreen style={styles.screenContent}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.topAction}
          >
            <Text style={styles.topActionText}>← Back</Text>
          </Pressable>

          <View style={styles.topRightActions}>
            <Pressable
              onPress={() => router.push("/favorites")}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Open favorite cards"
              style={styles.favoriteNavButton}
            >
              <Text style={styles.favoriteNavText}>♥</Text>

              {favorites.length > 0 && (
                <View style={styles.favoriteCountBadge}>
                  <Text style={styles.favoriteCountText}>
                    {favorites.length > 99 ? "99+" : favorites.length}
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={() => setSettingsVisible(true)}
              hitSlop={14}
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              style={styles.settingsButton}
            >
              <Text style={styles.settingsText}>⚙︎</Text>
            </Pressable>
          </View>
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

        <View style={styles.randomWrap}>
          <RaisedButton
            title="RANDOM MIX"
            variant="gold"
            onPress={handleRandomizeAll}
            disabled={availableDeckIds.length === 0}
            accessibilityLabel={`Random Mix. Pull from ${availableDeckIds.length} available decks.`}
          />

          <Text style={styles.randomSubtext}>
            Pull from{" "}
            <Text style={styles.randomStrong}>
              {availableDeckIds.length} available deck
              {availableDeckIds.length === 1 ? "" : "s"}
            </Text>
          </Text>
        </View>

        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
        />
      </View>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  container: {
    flex: 1,
  },
  topRow: {
    height: 38,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topAction: {
    minWidth: 78,
    height: 38,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  topActionText: {
    color: paperColors.ink,
    fontSize: 17,
    fontWeight: "700",
  },
  topRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: paperSpacing.sm,
  },
  favoriteNavButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2.2,
    borderColor: paperColors.ink,
    backgroundColor: paperColors.terracotta,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  favoriteNavText: {
    color: paperColors.paper,
    fontSize: 21,
    lineHeight: 23,
    fontWeight: "800",
  },
  favoriteCountBadge: {
    position: "absolute",
    top: -7,
    right: -7,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.6,
    borderColor: paperColors.ink,
    backgroundColor: paperColors.gold,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  favoriteCountText: {
    color: paperColors.ink,
    fontSize: 9,
    fontWeight: "900",
  },
  settingsButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsText: {
    color: paperColors.ink,
    fontSize: 28,
    lineHeight: 30,
  },
  header: {
    marginTop: 18,
    marginBottom: 24,
  },
  title: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 39,
    lineHeight: 43,
    fontWeight: "600",
    marginBottom: 20,
  },
  listContent: {
    gap: 14,
    paddingBottom: 8,
  },
  columnWrap: {
    gap: 16,
    marginBottom: 14,
  },
  randomWrap: {
    marginTop: "auto",
    gap: paperSpacing.md,
    paddingTop: 22,
    paddingBottom: 2,
  },
  randomSubtext: {
    color: paperColors.ink,
    opacity: 0.72,
    fontSize: 16,
    textAlign: "center",
  },
  randomStrong: {
    fontWeight: "800",
    opacity: 1,
  },
});