import { z } from "zod";

export const createEpisodeSchema = z.object({
  episodeNumber: z.number().int().min(1, "Episode number must be at least 1"),
  seasonKey: z.string().min(1, "Season is required"),
  title: z.string().min(1, "Title is required"),
  releaseDate: z.string().min(1, "Release date is required"),
  description: z.string().min(1, "Description is required"),
  rating: z.number().min(0).max(10).optional(),
});

export const updateEpisodeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  releaseDate: z.string().min(1, "Release date is required"),
  description: z.string().min(1, "Description is required"),
  rating: z.number().min(0).max(10).optional(),
});
