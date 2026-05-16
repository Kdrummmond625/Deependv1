import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { SettingsModal } from "@/components/SettingsModal";
import { InkLink } from "@/components/paper/InkLink";
import { PaperScreen } from "@/components/paper/PaperScreen";
import { PlayingCard } from "@/components/paper/PlayingCard";
import { RaisedButton } from "@/components/paper/RaisedButton";
import {
  paperColors,
  paperFonts,
  paperRadii,
  paperSpacing,
  paperType,
} from "@/constants/paperTheme";
import {
  getCardById,
  getCardsForDecks,
  getNextCard,
  shouldPassPhone,
} from "@/features/game/cardEngine";
import { useGameStore } from "@/features/game/gameStore";
import { useFavoritesStore } from "@/features/favorites/favoritesStore";
import {
  getFavoritesIntroShown,
  setFavoritesIntroShown,
} from "@/features/favorites/favoritesStorage";
import { formatDeckName } from "@/utils/formatDeckName";

export default function PlayScreen() {
  const session = useGameStore((state) => state.session);
  const settings = useGameStore((state) => state.settings);
  const setCurrentCard = useGameStore((state) => state.setCurrentCard);
  const setDeckComplete = useGameStore((state) => state.setDeckComplete);
  const markCardDiscussed = useGameStore((state) => state.markCardDiscussed);
  const goToNextPlayer = useGameStore((state) => state.goToNextPlayer);
  const skipCard = useGameStore((state) => state.skipCard);
  const goBackInHistory = useGameStore((state) => state.goBackInHistory);

  const favorites = useFavoritesStore((state) => state.favorites);
  const hydrateFavorites = useFavoritesStore((state) => state.hydrateFavorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [timerPromptVisible, setTimerPromptVisible] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);

  useEffect(() => {
    void hydrateFavorites();
  }, [hydrateFavorites]);

  const currentCard = getCardById(session.currentCardId);

  const currentHistoryIndex = session.currentCardId
    ? session.cardHistory.indexOf(session.currentCardId)
    : -1;

  const hasPreviousCard = currentHistoryIndex > 0;
  const isEmptyState = session.isDeckComplete || !currentCard;

  const activeCardCount = getCardsForDecks(session.activeDeckIds).length;
  const displayedCardNumber =
    currentHistoryIndex >= 0 ? currentHistoryIndex + 1 : undefined;

  const isCurrentCardFavorited = currentCard
    ? favorites.some((favorite) => favorite.cardId === currentCard.id)
    : false;

const fireHaptic = () => {
  if (!settings.hapticsEnabled) return;

  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    .catch(() => {
      Vibration.vibrate(50);
    });
};

  const loadNextCardFromLatestState = () => {
    const latestSession = useGameStore.getState().session;

    const nextCard = getNextCard({
      activeDeckIds: latestSession.activeDeckIds,
      currentCardId: latestSession.currentCardId,
      usedCardIds: latestSession.usedCardIds,
      skippedCardIds: latestSession.skippedCardIds,
    });

    if (!nextCard) {
      setDeckComplete(true);
      return;
    }

    setDeckComplete(false);
    setCurrentCard(nextCard.id);
  };

  const advanceToNextCard = () => {
    const latestSession = useGameStore.getState().session;
    const latestCard = getCardById(latestSession.currentCardId);

    if (!latestCard || latestSession.isDeckComplete) return;

    setTimerPromptVisible(false);
    fireHaptic();

    markCardDiscussed(latestCard.id, latestCard.deckId);

    const sessionAfterMarking = useGameStore.getState().session;

    const shouldRouteToPassScreen =
      !sessionAfterMarking.isPlayerlessMode &&
      shouldPassPhone(
        sessionAfterMarking.cardsSinceLastPass,
        settings.passFrequency
      );

    if (shouldRouteToPassScreen) {
      goToNextPlayer();
      router.push("/pass");
      return;
    }

    loadNextCardFromLatestState();
  };

  const goToPreviousCard = () => {
    const latestSession = useGameStore.getState().session;

    if (latestSession.historyIndex <= 0 && currentHistoryIndex <= 0) return;

    setTimerPromptVisible(false);
    fireHaptic();
    goBackInHistory();
  };

  const skipCurrentCard = () => {
    const latestSession = useGameStore.getState().session;
    const latestCard = getCardById(latestSession.currentCardId);

    if (!latestCard || latestSession.isDeckComplete) return;

    setTimerPromptVisible(false);
    fireHaptic();

    skipCard(latestCard.id);
    loadNextCardFromLatestState();
  };

  const handleKeepTalking = () => {
    setTimerPromptVisible(false);
    setTimerResetKey((value) => value + 1);
    fireHaptic();
  };

  const handleToggleFavorite = async () => {
    if (!currentCard) return;

    fireHaptic();

    const wasAdded = await toggleFavorite(currentCard.id);

    if (!wasAdded) return;

    const hasSeenIntro = await getFavoritesIntroShown();

    if (hasSeenIntro) return;

    await setFavoritesIntroShown();

    Alert.alert(
      "Saved to Favorites",
      "You can find your favorite cards from the heart on the Choose a Deck screen.",
      [{ text: "Got it" }],
      { cancelable: true }
    );
  };

  const handleEndGame = () => {
    Alert.alert(
      "End session?",
      "This will end the current game.",
      [
        {
          text: "Keep Playing",
          style: "cancel",
        },
        {
          text: "End Game",
          style: "destructive",
          onPress: () => router.push("/end"),
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    setTimerPromptVisible(false);
    setTimerResetKey(0);
  }, [currentCard?.id]);

  useEffect(() => {
  if (!currentCard || isEmptyState) return;
  if (!settings.hapticsEnabled) return;
  if (timerPromptVisible) return;

  const timerMs = settings.hapticTimerMinutes * 60 * 1000;

  const timeout = setTimeout(() => {
    setTimerPromptVisible(true);
  }, timerMs);

  return () => clearTimeout(timeout);
}, [
  currentCard?.id,
  isEmptyState,
  settings.hapticTimerMinutes,
  settings.hapticsEnabled,
  timerPromptVisible,
  timerResetKey,
]);

  return (
    <PaperScreen>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Pressable
            onPress={goToPreviousCard}
            hitSlop={12}
            disabled={!hasPreviousCard}
            accessibilityRole="button"
            accessibilityLabel="Previous card"
            accessibilityState={{ disabled: !hasPreviousCard }}
            style={[styles.topAction, !hasPreviousCard && styles.disabled]}
          >
            <Text style={styles.topActionText}>← Back</Text>
          </Pressable>

          <Pressable
            onPress={() => setSettingsVisible(true)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            style={styles.settingsButton}
          >
            <Text style={styles.settingsText}>⚙︎</Text>
          </Pressable>

          <Pressable
            onPress={skipCurrentCard}
            hitSlop={12}
            disabled={isEmptyState}
            accessibilityRole="button"
            accessibilityLabel="Skip card"
            accessibilityState={{ disabled: isEmptyState }}
            style={[styles.topAction, isEmptyState && styles.disabled]}
          >
            <Text style={styles.topActionText}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.centerArea}>
          {isEmptyState ? (
            <View style={styles.emptyCardWrap}>
              <View style={styles.emptyShadow} />
              <View style={styles.emptyCard}>
                <Text style={styles.emptyKicker}>DECK COMPLETE</Text>
                <Text style={styles.emptyTitle}>
                  You reached the end of this pull.
                </Text>
                <Text style={styles.emptyBody}>
                  Choose another deck or end the session here.
                </Text>
              </View>
            </View>
          ) : (
            <PlayingCard
              deckLabel={formatDeckName(currentCard.deckId).toUpperCase()}
              prompt={currentCard.prompt}
              cardNumber={displayedCardNumber}
              totalCards={activeCardCount}
              isFavorited={isCurrentCardFavorited}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </View>

        <View style={styles.actions}>
          {isEmptyState ? (
            <RaisedButton
              title="CHOOSE ANOTHER DECK →"
              variant="gold"
              onPress={() => router.push("/decks")}
            />
          ) : (
            <RaisedButton title="NEXT CARD →" onPress={advanceToNextCard} />
          )}

          <View style={styles.linkRow}>
            {!isEmptyState && (
              <>
                <Text style={styles.smallText}>or</Text>
                <InkLink
                  title="change deck"
                  onPress={() => router.push("/decks")}
                />
                <Text style={styles.dot}>·</Text>
              </>
            )}

            <InkLink title="end game" onPress={handleEndGame} />
          </View>
        </View>

        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
        />

        <Modal
          visible={timerPromptVisible}
          transparent
          animationType="fade"
          onRequestClose={handleKeepTalking}
        >
          <View style={styles.timerOverlay}>
            <Pressable
              style={styles.timerBackdrop}
              onPress={handleKeepTalking}
              accessibilityRole="button"
              accessibilityLabel="Keep talking"
            />

            <View style={styles.timerPromptWrap}>
              <View style={styles.timerPromptShadow} />

              <View style={styles.timerPromptCard}>
                <View style={styles.timerBadge}>
                  <Text style={styles.timerBadgeText}>TIME CHECK</Text>
                </View>

                <Text style={styles.timerTitle}>Still on this card?</Text>

                <Text style={styles.timerBody}>
                  Stay with it, or move to the next one.
                </Text>

                <View style={styles.timerActions}>
                  <RaisedButton
                    title="KEEP TALKING"
                    variant="secondary"
                    onPress={handleKeepTalking}
                  />

                  <RaisedButton
                    title="NEXT CARD →"
                    onPress={advanceToNextCard}
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
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  topRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topAction: {
    minWidth: 68,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.35,
  },
  topActionText: {
    color: paperColors.ink,
    fontSize: 13,
    fontWeight: "600",
  },
  settingsButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsText: {
    color: paperColors.ink,
    fontSize: 22,
    lineHeight: 24,
  },
  centerArea: {
    flex: 1,
    justifyContent: "center",
  },
  emptyCardWrap: {
    position: "relative",
    marginBottom: paperSpacing.xl,
  },
  emptyShadow: {
    position: "absolute",
    top: 7,
    left: 7,
    right: -7,
    bottom: -7,
    backgroundColor: paperColors.ink,
    borderRadius: 18,
  },
  emptyCard: {
    minHeight: 292,
    backgroundColor: paperColors.paperLight,
    borderWidth: 3,
    borderColor: paperColors.ink,
    borderRadius: 18,
    padding: paperSpacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: paperSpacing.md,
  },
  emptyKicker: {
    ...paperType.label,
    color: paperColors.terracotta,
  },
  emptyTitle: {
    ...paperType.prompt,
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    textAlign: "center",
  },
  emptyBody: {
    ...paperType.body,
    color: paperColors.ink,
    opacity: 0.68,
    textAlign: "center",
  },
  actions: {
    gap: paperSpacing.lg,
    paddingBottom: paperSpacing.xs,
  },
  linkRow: {
    minHeight: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: paperSpacing.sm,
    flexWrap: "wrap",
  },
  smallText: {
    color: paperColors.ink,
    opacity: 0.62,
    fontSize: 13,
  },
  dot: {
    color: paperColors.ink,
    opacity: 0.52,
    fontSize: 16,
    marginHorizontal: -2,
  },
  timerOverlay: {
    flex: 1,
    backgroundColor: "rgba(7, 21, 18, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  timerBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  timerPromptWrap: {
    width: "100%",
    maxWidth: 340,
    position: "relative",
  },
  timerPromptShadow: {
    position: "absolute",
    top: 7,
    left: 7,
    right: -7,
    bottom: -7,
    backgroundColor: paperColors.ink,
    borderRadius: paperRadii.lg,
  },
  timerPromptCard: {
    backgroundColor: paperColors.paperLight,
    borderWidth: 3,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.lg,
    padding: paperSpacing.lg,
    alignItems: "center",
    gap: paperSpacing.md,
  },
  timerBadge: {
    backgroundColor: paperColors.gold,
    borderWidth: 2,
    borderColor: paperColors.ink,
    borderRadius: paperRadii.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  timerBadgeText: {
    ...paperType.label,
    color: paperColors.ink,
    letterSpacing: 2,
  },
  timerTitle: {
    color: paperColors.ink,
    fontFamily: paperFonts.serif,
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "700",
    textAlign: "center",
  },
  timerBody: {
    color: paperColors.ink,
    opacity: 0.68,
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
  },
  timerActions: {
    width: "100%",
    gap: paperSpacing.md,
    marginTop: paperSpacing.sm,
  },
});