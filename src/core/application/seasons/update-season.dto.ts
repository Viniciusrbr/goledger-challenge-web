import { z } from "zod";

export const updateSeasonSchema = z.object({
  key: z.string().min(1, "Key is required"),
  year: z.coerce.number().int().min(1900).optional(),
});

export type UpdateSeasonDTO = z.infer<typeof updateSeasonSchema>;
