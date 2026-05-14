import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type SupabaseCardRow = {
  id: string;
  source_id: number | string;
  category: string;
  prompt: string;
  created_at?: string;
};

type DeckId =
  | "ask_assume"
  | "push_pull"
  | "guard_give"
  | "press_accept"
  | "past_present"
  | "keep_release";

type CardType = "question" | "stance";

type AppCard = {
  id: string;
  deckId: DeckId;
  type: CardType;
  prompt: string;
};

const allowedDeckIds: DeckId[] = [
  "ask_assume",
  "push_pull",
  "guard_give",
  "press_accept",
  "past_present",
  "keep_release",
];

function isDeckId(value: string): value is DeckId {
  return allowedDeckIds.includes(value as DeckId);
}

function normalizePrompt(prompt: string): string {
  return prompt.trim();
}

function convertRow(row: SupabaseCardRow): AppCard {
  if (!isDeckId(row.category)) {
    throw new Error(`Unknown category: ${row.category}`);
  }

  if (!row.prompt || !row.prompt.trim()) {
    throw new Error(`Missing prompt for source_id: ${row.source_id}`);
  }

  return {
    id: String(row.source_id),
    deckId: row.category,
    type: "question",
    prompt: normalizePrompt(row.prompt),
  };
}

function convertCards() {
  const inputPath = resolve(process.cwd(), "source-data/cards_rows.json");
  const outputPath = resolve(process.cwd(), "src/data/cards.json");

  const rawFile = readFileSync(inputPath, "utf8");
  const rows = JSON.parse(rawFile) as SupabaseCardRow[];

  const convertedCards = rows
    .sort((a, b) => Number(a.source_id) - Number(b.source_id))
    .map(convertRow);

  writeFileSync(
    outputPath,
    `${JSON.stringify(convertedCards, null, 2)}\n`,
    "utf8"
  );

  const deckCounts = convertedCards.reduce<Record<string, number>>(
    (counts, card) => {
      counts[card.deckId] = (counts[card.deckId] ?? 0) + 1;
      return counts;
    },
    {}
  );

  console.log(`Converted ${convertedCards.length} cards.`);
  console.log(deckCounts);
  console.log(`Wrote ${outputPath}`);
}

convertCards();