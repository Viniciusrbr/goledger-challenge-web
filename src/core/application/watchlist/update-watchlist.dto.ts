import { z } from "zod";

const assetRefSchema = z.object({
  "@assetType": z.enum(["tvShows", "seasons", "episodes", "watchlist"]),
  "@key": z.string(),
});

export const updateWatchlistSchema = z.object({
  key: z.string().min(1, "Key is required"),
  description: z.string().optional(),
  tvShows: z.array(assetRefSchema).optional(),
});

export type UpdateWatchlistDTO = z.infer<typeof updateWatchlistSchema>;
