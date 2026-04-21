import { z } from "zod";

export const createTVShowSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  recommendedAge: z.number().int().min(0, "Age must be 0 or greater"),
});

export const updateTVShowSchema = z.object({
  description: z.string().min(1, "Description is required"),
  recommendedAge: z.number().int().min(0, "Age must be 0 or greater"),
});
