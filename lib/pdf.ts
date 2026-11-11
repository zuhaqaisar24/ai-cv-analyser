import "server-only";

import { extractText, getDocumentProxy } from "unpdf";

import { AnalyseError } from "@/lib/errors";

export async function extractPdfText(bytes: Uint8Array): Promise<string> {
  try {
    const pdf = await getDocumentProxy(bytes);
    const extracted = await extractText(pdf, { mergePages: true });
    return extracted.text;
  } catch {
    throw new AnalyseError(
      "Could not read that PDF. If it is a scan, paste the text instead.",
      400,
    );
  }
}
