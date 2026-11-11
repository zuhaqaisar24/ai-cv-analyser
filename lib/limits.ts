export const MAX_PDF_BYTES = 5 * 1024 * 1024;
export const MIN_CV_CHARS = 80;
export const MIN_JOB_CHARS = 40;
export const MAX_CV_CHARS = 24_000;
export const MAX_JOB_CHARS = 16_000;

export function clipText(
  text: string,
  limit: number,
): { text: string; truncated: boolean } {
  if (text.length <= limit) {
    return { text, truncated: false };
  }
  return { text: text.slice(0, limit), truncated: true };
}
