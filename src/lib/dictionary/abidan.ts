import { createRequire } from "module";
import path from "path";

export type AbidanLetter = {
  letter: string;
  count: number;
};

export type AbidanWord = {
  id: number;
  word: string;
};

export type AbidanPage = {
  bookId: string;
  bookName: string;
  page: number;
  pdfIndex: number;
};

export type AbidanEntry = {
  id: number;
  word: string;
  pages: AbidanPage[];
};

type SqlRow = Record<string, unknown>;

type SqlStatement = {
  all: (...params: Array<string | number>) => SqlRow[];
  get: (...params: Array<string | number>) => SqlRow | undefined;
};

type SqlDatabase = {
  prepare: (sql: string) => SqlStatement;
};

const require = createRequire(import.meta.url);
const { DatabaseSync } = require("node:sqlite") as {
  DatabaseSync: new (
    filename: string,
    options?: { readOnly?: boolean },
  ) => SqlDatabase;
};

const ALPHABET = [
  "အ",
  "ဣ",
  "ဤ",
  "ဥ",
  "ဦ",
  "ဧ",
  "ဩ",
  "ဪ",
  "က",
  "ခ",
  "ဂ",
  "ဃ",
  "င",
  "စ",
  "ဆ",
  "ဇ",
  "ဈ",
  "ဉ",
  "ည",
  "ဋ",
  "ဌ",
  "ဍ",
  "ဎ",
  "ဏ",
  "တ",
  "ထ",
  "ဒ",
  "ဓ",
  "န",
  "ပ",
  "ဖ",
  "ဗ",
  "ဘ",
  "မ",
  "ယ",
  "ရ",
  "လ",
  "ဝ",
  "သ",
  "ဟ",
  "ဠ",
];

let database: SqlDatabase | null = null;
let letterCache: AbidanLetter[] | null = null;

function db() {
  if (!database) {
    database = new DatabaseSync(
      path.join(process.cwd(), "data", "tipitaka-abidan.db"),
      { readOnly: true },
    );
  }
  return database;
}

function mapWord(row: SqlRow): AbidanWord {
  return {
    id: Number(row.id),
    word: String(row.word),
  };
}

export function listAbidanLetters(): AbidanLetter[] {
  if (letterCache) return letterCache;
  const rows = db()
    .prepare(
      `SELECT substr(word, 1, 1) AS letter, COUNT(DISTINCT word) AS count
       FROM words
       GROUP BY letter`,
    )
    .all();
  const counts = new Map(
    rows.map((row) => [String(row.letter), Number(row.count)]),
  );
  const ordered = ALPHABET.filter((letter) => (counts.get(letter) ?? 0) > 0).map(
    (letter) => ({ letter, count: counts.get(letter) ?? 0 }),
  );
  const extras = [...counts.keys()]
    .filter((letter) => letter.trim() && !ALPHABET.includes(letter) && /\p{L}/u.test(letter))
    .sort((a, b) => a.localeCompare(b, "my"))
    .map((letter) => ({ letter, count: counts.get(letter) ?? 0 }));
  letterCache = [...ordered, ...extras];
  return letterCache;
}

export function searchAbidan(input: {
  query?: string;
  letter?: string;
  offset?: number;
  limit?: number;
}): { words: AbidanWord[]; total: number; letter: string | null } {
  const limit = Math.min(80, Math.max(1, input.limit ?? 60));
  const offset = Math.max(0, input.offset ?? 0);
  const query = (input.query ?? "").trim().replace(/[%_]/g, "").slice(0, 40);
  const letters = listAbidanLetters();
  const requested = input.letter?.slice(0, 1) ?? "";
  const letter = letters.some((item) => item.letter === requested)
    ? requested
    : (letters[0]?.letter ?? "အ");

  const pattern = query ? `%${query}%` : `${letter}%`;
  const grouped = `
    SELECT MIN(id) AS id, word
    FROM words
    WHERE word LIKE ?
    GROUP BY word
  `;
  const totalRow = db()
    .prepare(`SELECT COUNT(*) AS total FROM (${grouped})`)
    .get(pattern);
  const words = db()
    .prepare(`${grouped} ORDER BY word, id LIMIT ? OFFSET ?`)
    .all(pattern, limit, offset)
    .map(mapWord);

  return {
    words,
    total: Number(totalRow?.total ?? 0),
    letter: query ? null : letter,
  };
}

export function getAbidanEntry(id: number): AbidanEntry | null {
  if (!Number.isInteger(id) || id <= 0) return null;
  const row = db().prepare("SELECT id, word FROM words WHERE id = ?").get(id);
  if (!row) return null;
  const word = String(row.word);
  const pages = db()
    .prepare(
      `SELECT w.book_id AS book_id,
              COALESCE(b.name, '') AS book_name,
              w.page_number + COALESCE(b.start_page, 0) AS page
       FROM words w
       LEFT JOIN books b ON b.id = w.book_id
       WHERE w.word = ?
       GROUP BY w.book_id, w.page_number
       ORDER BY page`,
    )
    .all(word)
    .map((item) => {
      const page = Number(item.page);
      return {
        bookId: String(item.book_id),
        bookName: String(item.book_name ?? "").replace(/\s+/g, " ").trim(),
        page,
        pdfIndex: Math.max(0, page - 1),
      };
    });
  return { id: Number(row.id), word, pages };
}
