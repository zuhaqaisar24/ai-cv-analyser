import { z } from "zod";

/**
 * Contract for lesson 1. Every field is required.
 * Use an empty string or an empty array when the advert does not say.
 */
export const jobAdvertSchema = z.object({
  title: z.string(),
  organisation: z.string(),
  location: z.string(),
  seniority: z.string().describe("Empty string if the advert does not say."),
  mustHaveSkills: z.array(z.string()),
  niceToHaveSkills: z.array(z.string()),
  responsibilities: z.array(z.string()),
});

export type JobAdvertProfile = z.infer<typeof jobAdvertSchema>;
