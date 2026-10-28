import { NextRequest, NextResponse } from "next/server";
import { renderAbidanPage } from "@/lib/dictionary/abidan-page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const book = request.nextUrl.searchParams.get("book") ?? "";
  const index = Number(request.nextUrl.searchParams.get("index"));
  try {
    const png = await renderAbidanPage(book, index);
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Dictionary page unavailable", { status: 404 });
  }
}
