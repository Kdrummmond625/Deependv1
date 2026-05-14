import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { AppButton } from "@/components/AppButton";
import { AppScreen } from "@/components/AppScreen";
import { HeaderGear } from "@/components/HeaderGear";
import { SettingsModal } from "@/components/SettingsModal";
import { SwipeableCard } from "@/components/SwipeableCard";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import {
  getCardById,
  getNextCard,
  shouldPassPhone,
} from "@/features/game/cardEngine";
import { useGameStore } from "@/features/game/gameStore";
import { useHapticTimer } from "@/hooks/useHapticTimer";
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

  const [settingsVisible, setSettingsVisible] = useState(false);

  const currentCard = getCardById(session.currentCardId);
  const hasPreviousCard = session.historyIndex > 0;

  useHapticTimer({
    cardId: currentCard?.id ?? null,
    minutes: settings.hapticTimerMinutes,
    enabled: settings.hapticsEnabled,
  });

  const fireSwipeHaptic = async () => {
    if (!settings.hapticsEnabled) return;
    await Haptics.selectionAsync();
  };

  const loadNextCard = () => {
    const updatedSession = useGameStore.getState().session;

    const nextCard = getNextCard({
      activeDeckIds: updatedSession.activeDeckIds,
      currentCardId: updatedSession.currentCardId,
      usedCardIds: updatedSession.usedCardIds,
      skippedCardIds: updatedSession.skippedCardIds,
    });

    if (!nextCard) {
      setDeckComplete(true);
      return;
    }

    setDeckComplete(false);
    setCurrentCard(nextCard.id);
  };

  const handleNext = async () => {
    if (!currentCard || session.isDeckComplete) return;

    await fireSwipeHaptic();

    markCardDiscussed(currentCard.id, currentCard.deckId);

    const updatedSession = useGameStore.getState().session;

    const shouldRouteToPassScreen =
      !updatedSession.isPlayerlessMode &&
      shouldPassPhone(
        updatedSession.cardsSinceLastPass,
        settings.passFrequency
      );

    if (shouldRouteToPassScreen) {
      goToNextPlayer();
      router.push("/pass");
      return;
    }

    loadNextCard();
  };

  const handlePrevious = async () => {
    if (!hasPreviousCard) return;

    await fireSwipeHaptic();
    goBackInHistory();
  };

  const handleSkip = () => {
    if (!currentCard || session.isDeckComplete) return;

    skipCard(currentCard.id);
    loadNextCard();
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

  const isEmptyState = session.isDeckComplete || !currentCard;

  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Pressable
            onPress={handlePrevious}
            hitSlop={12}
            disabled={!hasPreviousCard}
            accessibilityRole="button"
            accessibilityLabel="Previous card"
            style={[styles.topAction, !hasPreviousCard && styles.disabled]}
          >
            <Text style={styles.topActionText}>Back</Text>
          </Pressable>

          <HeaderGear onPress={() => setSettingsVisible(true)} />

          <Pressable
            onPress={handleSkip}
            hitSlop={12}
            disabled={isEmptyState}
            accessibilityRole="button"
            accessibilityLabel="Skip card"
            style={[styles.topAction, isEmptyState && styles.disabled]}
          >
            <Text style={styles.topActionText}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.centerArea}>
          <Text style={styles.deckLabel}>
            {currentCard
              ? formatDeckName(currentCard.deckId).toUpperCase()
              : "DECK COMPLETE"}
          </Text>

          {isEmptyState ? (
            <View style={styles.cardPanel}>
              <Text style={styles.prompt}>You reached the end of this pull.</Text>
              <Text style={styles.emptyBody}>
                Choose another deck or end the session here.
              </Text>
            </View>
          ) : (
            <SwipeableCard
              onSwipeRight={handleNext}
              onSwipeLeft={handlePrevious}
            >
              <View style={styles.cardPanel}>
                <Text style={styles.prompt}>{currentCard.prompt}</Text>
              </View>
            </SwipeableCard>
          )}
        </View>

        <View style={styles.bottomActions}>
          {isEmptyState ? (
            <AppButton
              title="CHOOSE ANOTHER DECK"
              onPress={() => router.push("/decks")}
            />
          ) : (
            <AppButton title="NEXT CARD" onPress={handleNext} />
          )}

          <View style={styles.secondaryRow}>
            {!isEmptyState && (
              <AppButton
                title="CHANGE DECK"
                variant="secondary"
                onPress={() => router.push("/decks")}
                style={styles.secondaryButton}
              />
            )}

            <AppButton
              title="END GAME"
              variant="secondary"
              onPress={handleEndGame}
              style={styles.secondaryButton}
            />
          </View>
        </View>

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
    alignItems: "center",
    justifyContent: "space-between",
  },
  topAction: {
    minWidth: 48,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.35,
  },
  topActionText: {
    color: colors.mutedCream,
    fontSize: 14,
    fontWeight: "600",
  },
  centerArea: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg,
  },
  deckLabel: {
    color: colors.gold,
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: "700",
    textAlign: "center",
  },
  cardPanel: {
    minHeight: 320,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  prompt: {
    ...typography.heading,
    color: colors.cream,
    textAlign: "center",
  },
  emptyBody: {
    ...typography.body,
    color: colors.mutedCream,
    textAlign: "center",
  },
  bottomActions: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  secondaryRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
  },
});