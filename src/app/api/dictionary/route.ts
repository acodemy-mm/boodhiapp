import { NextRequest, NextResponse } from "next/server";
import { listAbidanLetters, searchAbidan } from "@/lib/dictionary/abidan";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("q") ?? "";
  const letter = params.get("letter") ?? "";
  const offset = Number(params.get("offset") ?? "0");
  const limit = Number(params.get("limit") ?? "60");
  const result = searchAbidan({
    query,
    letter,
    offset: Number.isFinite(offset) ? offset : 0,
    limit: Number.isFinite(limit) ? limit : 60,
  });

  return NextResponse.json({
    letters: listAbidanLetters(),
    words: result.words,
    total: result.total,
    letter: result.letter,
    offset: Number.isFinite(offset) ? Math.max(0, offset) : 0,
  });
}
