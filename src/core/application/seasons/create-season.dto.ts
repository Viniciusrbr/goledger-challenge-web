import { z } from "zod";

const assetRefSchema = z.object({
  "@assetType": z.enum(["tvShows", "seasons", "episodes", "watchlist"]),
  "@key": z.string(),
});

export const createSeasonSchema = z.object({
  number: z.coerce.number().int().min(1, "Season number must be at least 1"),
  tvShow: assetRefSchema,
  year: z.coerce.number().int().min(1900, "Year must be 1900 or later"),
});

export type CreateSeasonDTO = z.infer<typeof createSeasonSchema>;
