import cardsData from "@/data/cards.json";
import { DeepEndCard } from "@/types/card";
import { DeckId } from "@/types/deck";
import { shuffle } from "@/utils/shuffle";

const allCards = cardsData as DeepEndCard[];

type GetNextCardInput = {
  activeDeckIds: DeckId[];
  currentCardId: string | null;
  usedCardIds: string[];
  skippedCardIds: string[];
};

export function getCardsForDecks(deckIds: DeckId[]): DeepEndCard[] {
  return allCards.filter((card) => deckIds.includes(card.deckId));
}

export function getCardById(cardId: string | null): DeepEndCard | null {
  if (!cardId) return null;

  return allCards.find((card) => card.id === cardId) ?? null;
}

export function getNextCard({
  activeDeckIds,
  currentCardId,
  usedCardIds,
  skippedCardIds,
}: GetNextCardInput): DeepEndCard | null {
  const activeCards = getCardsForDecks(activeDeckIds);

  const freshCards = activeCards.filter((card) => {
    const isCurrent = card.id === currentCardId;
    const isUsed = usedCardIds.includes(card.id);
    const isSkipped = skippedCardIds.includes(card.id);

    return !isCurrent && !isUsed && !isSkipped;
  });

  if (freshCards.length > 0) {
    return shuffle(freshCards)[0];
  }

  const recycledSkippedCards = activeCards.filter((card) => {
    const isCurrent = card.id === currentCardId;
    const isUsed = usedCardIds.includes(card.id);
    const wasSkipped = skippedCardIds.includes(card.id);

    return !isCurrent && !isUsed && wasSkipped;
  });

  if (recycledSkippedCards.length > 0) {
    return shuffle(recycledSkippedCards)[0];
  }

  return null;
}

export function hasRemainingCards({
  activeDeckIds,
  currentCardId,
  usedCardIds,
  skippedCardIds,
}: GetNextCardInput): boolean {
  return (
    getNextCard({
      activeDeckIds,
      currentCardId,
      usedCardIds,
      skippedCardIds,
    }) !== null
  );
}

export function shouldPassPhone(
  cardsSinceLastPass: number,
  passFrequency: number
): boolean {
  return cardsSinceLastPass >= passFrequency;
}