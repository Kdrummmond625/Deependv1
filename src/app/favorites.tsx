import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { SettingsModal } from "@/components/SettingsModal";
import { PaperScreen } from "@/components/paper/PaperScreen";
import { RaisedButton } from "@/components/paper/RaisedButton";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";
import { decks } from "@/data/decks";
import { getCardById } from "@/features/game/cardEngine";
import { useFavoritesStore } from "@/features/favorites/favoritesStore";
import { FavoriteCardRecord } from "@/features/favorites/favoritesTypes";
import { formatDeckName } from "@/utils/formatDeckName";

function cleanPrompt(prompt: string) {
  return prompt.replace(/\s+/g, " ").trim();
}

function getDeckNameForFavorite(favorite: FavoriteCardRecord): string {
  const card = getCardById(favorite.cardId);

  if (!card) return "Unknown";

  const deck = decks.find((item) => item.id === card.deckId);

  return deck?.name ?? formatDeckName(card.deckId);
}

function sortFavoritesByDeck(
  favorites: FavoriteCardRecord[]
): FavoriteCardRecord[] {
  return [...favorites].sort((a, b) => {
    const deckNameA = getDeckNameForFavorite(a);
    const deckNameB = getDeckNameForFavorite(b);

    const deckCompare = deckNameA.localeCompare(deckNameB);

    if (deckCompare !== 0) return deckCompare;

    return b.favoritedAt - a.favoritedAt;
  });
}

export default function FavoritesScreen() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const hydrateFavorites = useFavoritesStore((state) => state.hydrateFavorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [selectedFavorite, setSelectedFavorite] =
    useState<FavoriteCardRecord | null>(null);

  useEffect(() => {
    void hydrateFavorites();
  }, [hydrateFavorites]);

  const sortedFavorites = useMemo(() => {
    return sortFavoritesByDeck(favorites).filter((favorite) =>
      Boolean(getCardById(favorite.cardId))
    );
  }, [favorites]);

  const selectedCard = selectedFavorite
    ? getCardById(selectedFavorite.cardId)
    : null;

  const handleRemoveSelected = async () => {
    if (!selectedFavorite) return;

    await removeFavorite(selectedFavorite.cardId);
    setSelectedFavorite(null);
  };

  return (
    <PaperScreen style={styles.screenContent}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.topAction}
          >
            <Text style={styles.topActionText}>← Back</Text>
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

        <View style={styles.header}>
          <Text style={styles.title}>Favorite cards.</Text>
          <Text style={styles.subtitle}>The ones you came back to.</Text>
        </View>

        {sortedFavorites.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyShadow} />
            <View style={styles.emptyCard}>
              <Text style={styles.emptyMark}>♥</Text>
              <Text style={styles.emptyTitle}>No favorites yet.</Text>
              <Text style={styles.emptyBody}>
                Tap the heart on a card while playing. Saved cards will show up
                here.
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={sortedFavorites}
            keyExtractor={(item) => item.cardId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const card = getCardById(item.cardId);

              if (!card) return null;

              const deckLabel = formatDeckName(card.deckId).toUpperCase();

              return (
                <Pressable
                  onPress={() => setSelectedFavorite(item)}
                  accessibilityRole="button"
                  accessibilityLabel="Open favorite card"
                  style={styles.favoriteWrap}
                >
                  <View style={styles.favoriteShadow} />

                  <View style={styles.favoriteCard}>
                    <View style={styles.favoriteHeader}>
                      <View style={styles.deckPill}>
                        <Text style={styles.deckPillText}>{deckLabel}</Text>
                      </View>

                      <Text style={styles.heart}>♥</Text>
                    </View>

                    <Text
                      style={styles.promptPreview}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {cleanPrompt(card.prompt)}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
        )}

        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          showEndGame={false}
        />

        <Modal
          visible={selectedFavorite !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedFavorite(null)}
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => setSelectedFavorite(null)}
              accessibilityRole="button"
              accessibilityLabel="Close favorite card"
            />

            <View style={styles.modalWrap}>
              <View style={styles.modalShadow} />

              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <View style={styles.deckPill}>
                    <Text style={styles.deckPillText}>
                      {selectedCard
                        ? formatDeckName(selectedCard.deckId).toUpperCase()
                        : "FAVORITE"}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => setSelectedFavorite(null)}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Close favorite card"
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeText}>×</Text>
                  </Pressable>
                </View>

                <Text style={styles.modalPrompt}>
                  {selectedCard ? cleanPrompt(selectedCard.prompt) : ""}
                </Text>

                <View style={styles.modalActions}>
                  <RaisedButton
                    title="REMOVE FAVORITE"
                    variant="danger"
                    onPress={handleRemoveSelected}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
    height: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topAction: {
    minWidth: 78,
    height: 38,
    justifyContent: "center",
  },
  topActionText: {
    color: paperColors.ink,
    fontSize: 17,
    fontWeight: "700",
  },
  settingsButton: {
    width: 44,
    height: 44,
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
    marginBottom: 20,
  },
  title: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "700",
  },
  subtitle: {
    color: paperColors.ink,
    opacity: 0.6,
    fontSize: 15,
    marginTop: 4,
  },
  listContent: {
    gap: paperSpacing.md,
    paddingBottom: paperSpacing.xl,
  },
  favoriteWrap: {
    position: "relative",
    minHeight: 132,
  },
  favoriteShadow: {
    position: "absolute",
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.md,
  },
  favoriteCard: {
    minHeight: 132,
    backgroundColor: paperColors.paperLight,
    borderWidth: 2.5,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.md,
    padding: paperSpacing.md,
    gap: paperSpacing.md,
  },
  favoriteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    letterSpacing: 1.7,
  },
  heart: {
    color: paperColors.terracotta,
    fontSize: 24,
    fontWeight: "900",
  },
  promptPreview: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "600",
  },
  emptyWrap: {
    position: "relative",
    marginTop: 54,
  },
  emptyShadow: {
    position: "absolute",
    top: 7,
    left: 7,
    right: -7,
    bottom: -7,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.lg,
  },
  emptyCard: {
    minHeight: 260,
    backgroundColor: paperColors.paperLight,
    borderWidth: 3,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.lg,
    alignItems: "center",
    justifyContent: "center",
    padding: paperSpacing.xl,
    gap: paperSpacing.md,
  },
  emptyMark: {
    color: paperColors.terracotta,
    fontSize: 42,
    lineHeight: 46,
  },
  emptyTitle: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyBody: {
    color: paperColors.ink,
    opacity: 0.62,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(7, 21, 18, 0.64)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalWrap: {
    width: "100%",
    maxWidth: 350,
    maxHeight: "78%",
    position: "relative",
  },
  modalShadow: {
    position: "absolute",
    top: 7,
    left: 7,
    right: -7,
    bottom: -7,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.lg,
  },
  modalCard: {
    backgroundColor: paperColors.paperLight,
    borderWidth: 3,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.lg,
    padding: paperSpacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: paperSpacing.xl,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: 17,
    backgroundColor: paperColors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: paperColors.ink,
    fontSize: 24,
    lineHeight: 25,
    fontWeight: "800",
  },
  modalPrompt: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 25,
    lineHeight: 34,
    fontWeight: "600",
  },
  modalActions: {
    marginTop: paperSpacing.xl,
  },
});