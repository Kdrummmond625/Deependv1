import { DeckId } from "./deck";

export type CardType = "question" | "stance";

export type DeepEndCard = {
  id: string;
  deckId: DeckId;
  type: CardType;
  prompt: string;
};