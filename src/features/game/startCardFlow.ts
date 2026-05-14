import { router } from "expo-router";
import { getNextCard } from "@/features/game/cardEngine";
import { useGameStore } from "@/features/game/gameStore";
import { DeckId } from "@/types/deck";

type StartCardFlowInput = {
  activeDeckIds: DeckId[];
};

export function startCardFlow({ activeDeckIds }: StartCardFlowInput) {
  const store = useGameStore.getState();

  const nextCard = getNextCard({
    activeDeckIds,
    currentCardId: null,
    usedCardIds: [],
    skippedCardIds: [],
  });

  if (!nextCard) {
    store.setDeckComplete(true);
    router.push("/play");
    return;
  }

  store.setDeckComplete(false);
  store.setCurrentCard(nextCard.id);
  router.push("/play");
}