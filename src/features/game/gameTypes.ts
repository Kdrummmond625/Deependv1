import { DeckId } from "@/types/deck";

export type PlayMode = "singleDeck" | "randomize";

export type GameSettings = {
  passFrequency: number;
  hapticTimerMinutes: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
};

export type GameSession = {
  players: string[];
  isPlayerlessMode: boolean;
  currentPlayerIndex: number;

  playMode: PlayMode;
  selectedDeckId: DeckId | null;
  activeDeckIds: DeckId[];

  currentCardId: string | null;
  cardHistory: string[];
  historyIndex: number;

  usedCardIds: string[];
  skippedCardIds: string[];

  cardsDiscussed: number;
  cardsSinceLastPass: number;

  sessionStartedAt: number | null;
  categoriesExplored: DeckId[];

  isDeckComplete: boolean;
};

export type GameState = {
  settings: GameSettings;
  session: GameSession;

  updateSettings: (settings: Partial<GameSettings>) => void;
  hydrateSettings: (settings: Partial<GameSettings>) => void;

  startSession: (players: string[]) => void;
  endSession: () => void;
  resetSession: () => void;

  selectSingleDeck: (deckId: DeckId) => void;
  selectRandomize: (deckIds: DeckId[]) => void;

  setCurrentCard: (cardId: string | null) => void;
  setDeckComplete: (isComplete: boolean) => void;
  goToNextPlayer: () => void;

  markCardDiscussed: (cardId: string, deckId: DeckId) => void;
  skipCard: (cardId: string) => void;
  goBackInHistory: () => string | null;
};