import { decks } from "@/data/decks";
import { DeckId } from "@/types/deck";
import { ProductId } from "./accessTypes";

type DeckAccessProduct = ProductId | "free";

export const BASE_GAME_PRODUCT_ID: ProductId = "base_game";

export const DECK_PRODUCT_MAP: Record<DeckId, DeckAccessProduct> = {
  ask_assume: "free",
  push_pull: "base_game",
  guard_give: "base_game",
  press_accept: "base_game",
  past_present: "base_game",
  keep_release: "base_game",
};

export function isDeckFree(deckId: DeckId): boolean {
  return DECK_PRODUCT_MAP[deckId] === "free";
}

export function getDeckProductId(deckId: DeckId): DeckAccessProduct {
  return DECK_PRODUCT_MAP[deckId];
}

export function canAccessDeck(
  deckId: DeckId,
  unlockedProductIds: ProductId[]
): boolean {
  const productId = DECK_PRODUCT_MAP[deckId];

  if (productId === "free") return true;

  return unlockedProductIds.includes(productId);
}

export function getAccessibleDeckIds(
  unlockedProductIds: ProductId[]
): DeckId[] {
  return decks
    .filter((deck) => canAccessDeck(deck.id, unlockedProductIds))
    .map((deck) => deck.id);
}

export function getLockedDeckIds(unlockedProductIds: ProductId[]): DeckId[] {
  return decks
    .filter((deck) => !canAccessDeck(deck.id, unlockedProductIds))
    .map((deck) => deck.id);
}