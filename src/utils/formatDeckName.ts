import { DeckId } from "@/types/deck";

export function formatDeckName(deckId: DeckId): string {
  switch (deckId) {
    case "ask_assume":
      return "Ask or Assume";
    case "push_pull":
      return "Push or Pull";
    case "guard_give":
      return "Guard or Give";
    case "press_accept":
      return "Press or Accept";
    case "past_present":
      return "Past or Present";
    case "keep_release":
      return "Keep or Release";
    default:
      return deckId;
  }
}