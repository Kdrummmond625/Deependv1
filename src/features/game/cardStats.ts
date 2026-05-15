import cardsData from "@/data/cards.json";
import { DeepEndCard } from "@/types/card";
import { DeckId } from "@/types/deck";

const allCards = cardsData as DeepEndCard[];

export function getCardCountForDeck(deckId: DeckId): number {
  return allCards.filter((card) => card.deckId === deckId).length;
}

export function getDeckIdsWithCards(deckIds: DeckId[]): DeckId[] {
  return deckIds.filter((deckId) => getCardCountForDeck(deckId) > 0);
}

export function deckHasCards(deckId: DeckId): boolean {
  return getCardCountForDeck(deckId) > 0;
}