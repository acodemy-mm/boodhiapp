import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

const BOOKS = path.join(process.cwd(), "data", "abidan-books");
const PAGES = path.join(process.cwd(), "data", "abidan-pages");
const downloads = new Map<string, Promise<string>>();
const documents = new Map<string, import("mupdf").Document>();

async function mupdf() {
  return import("mupdf");
}

function bookFile(bookId: string) {
  if (!/^[0-9a-z]+$/i.test(bookId)) throw new Error("Unknown dictionary volume");
  return path.join(BOOKS, `${bookId}.pdf`);
}

async function ensureBook(bookId: string) {
  const pdfPath = bookFile(bookId);
  try {
    await fs.promises.access(pdfPath);
    return pdfPath;
  } catch {
    /* download */
  }
  const pending = downloads.get(bookId);
  if (pending) return pending;
  const task = (async () => {
    await fs.promises.mkdir(BOOKS, { recursive: true });
    const url = `https://raw.githubusercontent.com/pndaza/Tipitaka_Abidan/master/install_time_asset_pack/src/main/assets/books/${bookId}.pdf`;
    const response = await fetch(url);
    if (!response.ok || !response.body) {
      throw new Error("Dictionary volume could not be opened");
    }
    const partial = `${pdfPath}.part`;
    await pipeline(
      Readable.fromWeb(response.body as import("stream/web").ReadableStream),
      fs.createWriteStream(partial),
    );
    await fs.promises.rename(partial, pdfPath);
    return pdfPath;
  })().finally(() => downloads.delete(bookId));
  downloads.set(bookId, task);
  return task;
}

export async function renderAbidanPage(bookId: string, pdfIndex: number) {
  if (!Number.isInteger(pdfIndex) || pdfIndex < 0 || pdfIndex > 2000) {
    throw new Error("Unknown dictionary page");
  }
  await fs.promises.mkdir(PAGES, { recursive: true });
  const pngPath = path.join(PAGES, `${bookId}-${pdfIndex}.png`);
  try {
    return await fs.promises.readFile(pngPath);
  } catch {
    /* render */
  }
  const pdfPath = await ensureBook(bookId);
  const mupdfLib = await mupdf();
  let document = documents.get(pdfPath);
  if (!document) {
    document = mupdfLib.Document.openDocument(pdfPath);
    documents.set(pdfPath, document);
  }
  if (pdfIndex >= document.countPages()) {
    throw new Error("Unknown dictionary page");
  }
  const page = document.loadPage(pdfIndex);
  const pixmap = page.toPixmap(
    mupdfLib.Matrix.scale(0.62, 0.62),
    mupdfLib.ColorSpace.DeviceRGB,
    false,
  );
  const png = Buffer.from(pixmap.asPNG());
  await fs.promises.writeFile(pngPath, png);
  return png;
}
