import { DeckId } from "@/types/deck";

export type EntitlementId = "full_access";

export type PurchaseState = {
  hasFullAccess: boolean;
  unlockedDeckIds: DeckId[];
};

export const freeDeckIds: DeckId[] = ["ask_assume"];

export function getUnlockedDeckIds(hasFullAccess: boolean): DeckId[] {
  if (hasFullAccess) {
    return [
      "ask_assume",
      "push_pull",
      "guard_give",
      "press_accept",
      "past_present",
      "keep_release",
    ];
  }

  return freeDeckIds;
}