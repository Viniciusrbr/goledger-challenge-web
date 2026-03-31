import { z } from "zod";

export const updateEpisodeSchema = z.object({
  key: z.string().min(1, "Key is required"),
  title: z.string().min(1).optional(),
  releaseDate: z.string().optional(),
  description: z.string().min(1).optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
});

export type UpdateEpisodeDTO = z.infer<typeof updateEpisodeSchema>;
