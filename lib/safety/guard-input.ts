export type GuardResult = {
  ok: boolean;
  text: string;
  notes: string[];
  /**
   * Stay false until lesson 6 actually checks the text.
   * The results page hides the lesson card once this is true.
   */
  active: boolean;
};

/**
 * TODO(lesson-6): Treat CV and job-advert text as untrusted data.
 *
 * The route in lib/analyse.ts already calls this on both texts,
 * before any model call. Today it returns the text unchanged.
 *
 * When you implement it:
 * - Stop `<cv>` and `</cv>` in the input from closing the markers
 *   used in lib/cv/extract-cv-profile.ts. Add a note when you change text.
 * - A line that tells the model to ignore previous instructions should
 *   raise a note. Do not silently delete CV content.
 * - Set active to true once the checks run, even if notes is empty.
 * - Return ok: false only when the request should stop.
 *
 * See LESSON_PLAN.md, lesson 6. Fixture: public/samples/injection-cv.txt.
 */
export function guardUntrustedText(text: string): GuardResult {
  return {
    ok: true,
    text,
    notes: [],
    active: false,
  };
}
