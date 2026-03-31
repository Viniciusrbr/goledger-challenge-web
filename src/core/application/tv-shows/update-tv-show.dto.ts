import { z } from "zod";

export const updateTVShowSchema = z.object({
  key: z.string().min(1, "Key is required"),
  description: z.string().min(1).optional(),
  recommendedAge: z.coerce.number().int().min(0).optional(),
});

export type UpdateTVShowDTO = z.infer<typeof updateTVShowSchema>;
