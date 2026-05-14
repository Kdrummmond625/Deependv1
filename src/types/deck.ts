export type DeckId =
  | "ask_assume"
  | "push_pull"
  | "guard_give"
  | "press_accept"
  | "past_present"
  | "keep_release";

export type Deck = {
  id: DeckId;
  name: string;
  shortDescription: string;
  isFree: boolean;
  isLocked: boolean;
};