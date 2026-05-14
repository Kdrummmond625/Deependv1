import { create } from "zustand";
import { DeckId } from "@/types/deck";
import { GameSettings, GameSession, GameState } from "./gameTypes";
import { saveSettings } from "./settingsStorage";

const defaultSettings: GameSettings = {
  passFrequency: 1,
  hapticTimerMinutes: 5,
  soundEnabled: true,
  hapticsEnabled: true,
};

const defaultSession: GameSession = {
  players: [],
  isPlayerlessMode: false,
  currentPlayerIndex: 0,

  playMode: "singleDeck",
  selectedDeckId: null,
  activeDeckIds: [],

  currentCardId: null,
  cardHistory: [],
  historyIndex: -1,

  usedCardIds: [],
  skippedCardIds: [],

  cardsDiscussed: 0,
  cardsSinceLastPass: 0,

  sessionStartedAt: null,
  categoriesExplored: [],

  isDeckComplete: false,
};

export const useGameStore = create<GameState>((set, get) => ({
  settings: defaultSettings,
  session: defaultSession,

  updateSettings: (incomingSettings) => {
    const nextSettings = {
      ...get().settings,
      ...incomingSettings,
    };

    set({
      settings: nextSettings,
    });

    void saveSettings(nextSettings);
  },

  hydrateSettings: (incomingSettings) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...incomingSettings,
      },
    }));
  },

  startSession: (players) => {
    const cleanPlayers = players
      .map((player) => player.trim())
      .filter(Boolean);

    set({
      session: {
        ...defaultSession,
        players: cleanPlayers,
        isPlayerlessMode: cleanPlayers.length === 0,
        currentPlayerIndex: 0,
        sessionStartedAt: Date.now(),
      },
    });
  },

  endSession: () => {
    set((state) => ({
      session: {
        ...state.session,
        currentCardId: null,
      },
    }));
  },

  resetSession: () => {
    set({
      session: defaultSession,
    });
  },

  selectSingleDeck: (deckId) => {
    set((state) => ({
      session: {
        ...state.session,
        playMode: "singleDeck",
        selectedDeckId: deckId,
        activeDeckIds: [deckId],
        currentCardId: null,
        cardHistory: [],
        historyIndex: -1,
        usedCardIds: [],
        skippedCardIds: [],
        isDeckComplete: false,
      },
    }));
  },

  selectRandomize: (deckIds) => {
    set((state) => ({
      session: {
        ...state.session,
        playMode: "randomize",
        selectedDeckId: null,
        activeDeckIds: deckIds,
        currentCardId: null,
        cardHistory: [],
        historyIndex: -1,
        usedCardIds: [],
        skippedCardIds: [],
        isDeckComplete: false,
      },
    }));
  },

  setCurrentCard: (cardId) => {
    set((state) => {
      if (!cardId) {
        return {
          session: {
            ...state.session,
            currentCardId: null,
          },
        };
      }

      const existingIndex = state.session.cardHistory.indexOf(cardId);

      if (existingIndex >= 0) {
        return {
          session: {
            ...state.session,
            currentCardId: cardId,
            historyIndex: existingIndex,
            isDeckComplete: false,
          },
        };
      }

      const trimmedHistory =
        state.session.historyIndex >= 0
          ? state.session.cardHistory.slice(0, state.session.historyIndex + 1)
          : state.session.cardHistory;

      return {
        session: {
          ...state.session,
          currentCardId: cardId,
          cardHistory: [...trimmedHistory, cardId],
          historyIndex: trimmedHistory.length,
          isDeckComplete: false,
        },
      };
    });
  },

  setDeckComplete: (isComplete) => {
    set((state) => ({
      session: {
        ...state.session,
        currentCardId: isComplete ? null : state.session.currentCardId,
        isDeckComplete: isComplete,
      },
    }));
  },

  goToNextPlayer: () => {
    const { session } = get();

    if (session.players.length === 0) return;

    set((state) => ({
      session: {
        ...state.session,
        currentPlayerIndex:
          (state.session.currentPlayerIndex + 1) % state.session.players.length,
        cardsSinceLastPass: 0,
      },
    }));
  },

  markCardDiscussed: (cardId: string, deckId: DeckId) => {
    set((state) => {
      const alreadyUsed = state.session.usedCardIds.includes(cardId);
      const alreadyExplored = state.session.categoriesExplored.includes(deckId);

      if (alreadyUsed) return state;

      return {
        session: {
          ...state.session,
          usedCardIds: [...state.session.usedCardIds, cardId],
          skippedCardIds: state.session.skippedCardIds.filter(
            (id) => id !== cardId
          ),
          cardsDiscussed: state.session.cardsDiscussed + 1,
          cardsSinceLastPass: state.session.cardsSinceLastPass + 1,
          categoriesExplored: alreadyExplored
            ? state.session.categoriesExplored
            : [...state.session.categoriesExplored, deckId],
        },
      };
    });
  },

  skipCard: (cardId) => {
    set((state) => {
      if (state.session.skippedCardIds.includes(cardId)) {
        return {
          session: {
            ...state.session,
            currentCardId: null,
          },
        };
      }

      return {
        session: {
          ...state.session,
          skippedCardIds: [...state.session.skippedCardIds, cardId],
          currentCardId: null,
        },
      };
    });
  },

  goBackInHistory: () => {
    const { session } = get();

    if (session.historyIndex <= 0) return null;

    const previousIndex = session.historyIndex - 1;
    const previousCardId = session.cardHistory[previousIndex];

    set((state) => ({
      session: {
        ...state.session,
        currentCardId: previousCardId,
        historyIndex: previousIndex,
        isDeckComplete: false,
      },
    }));

    return previousCardId;
  },
}));