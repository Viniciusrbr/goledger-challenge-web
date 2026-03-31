import { z } from "zod";

const assetRefSchema = z.object({
  "@assetType": z.enum(["tvShows", "seasons", "episodes", "watchlist"]),
  "@key": z.string(),
});

export const createEpisodeSchema = z.object({
  episodeNumber: z.coerce
    .number()
    .int()
    .min(1, "Episode number must be at least 1"),
  season: assetRefSchema,
  title: z.string().min(1, "Title is required"),
  releaseDate: z.string().min(1, "Release date is required"),
  description: z.string().min(1, "Description is required"),
  rating: z.coerce.number().min(0).max(10).optional(),
});

export type CreateEpisodeDTO = z.infer<typeof createEpisodeSchema>;
