import { z } from "zod";

export const createSeasonSchema = z.object({
  number: z.number().int().min(1, "Season number must be at least 1"),
  tvShowKey: z.string().min(1, "TV Show is required"),
  year: z.number().int().min(1900, "Year must be 1900 or later"),
});

export const updateSeasonSchema = z.object({
  year: z.number().int().min(1900, "Year must be 1900 or later"),
});
