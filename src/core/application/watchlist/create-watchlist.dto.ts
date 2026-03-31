import { z } from "zod";

const assetRefSchema = z.object({
  "@assetType": z.enum(["tvShows", "seasons", "episodes", "watchlist"]),
  "@key": z.string(),
});

export const createWatchlistSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tvShows: z.array(assetRefSchema).optional(),
});

export type CreateWatchlistDTO = z.infer<typeof createWatchlistSchema>;
