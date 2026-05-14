import { Deck } from "@/types/deck";

export const decks: Deck[] = [
  {
    id: "ask_assume",
    name: "Ask or Assume",
    shortDescription: "When the meaning is missing.",
    isFree: true,
    isLocked: false,
  },
  {
    id: "push_pull",
    name: "Push or Pull",
    shortDescription: "When connection changes pace.",
    isFree: false,
    isLocked: false,
  },
  {
    id: "guard_give",
    name: "Guard or Give",
    shortDescription: "When access costs something.",
    isFree: false,
    isLocked: false,
  },
  {
    id: "press_accept",
    name: "Press or Accept",
    shortDescription: "When something feels off.",
    isFree: false,
    isLocked: false,
  },
  {
    id: "past_present",
    name: "Past or Present",
    shortDescription: "When history and now compete.",
    isFree: false,
    isLocked: false,
  },
  {
    id: "keep_release",
    name: "Keep or Release",
    shortDescription: "When the current version may need to change.",
    isFree: false,
    isLocked: false,
  },
];