import { z } from "zod";

export const createWatchlistSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const updateWatchlistSchema = z.object({
  description: z.string().optional(),
});
