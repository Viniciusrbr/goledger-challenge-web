import type { z } from "zod";
import type { Season } from "@/core/domain/seasons/season.entity";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";
import type { createSeasonSchema, updateSeasonSchema } from "./seasons.schema";

export type CreateSeasonFormData = z.infer<typeof createSeasonSchema>;
export type UpdateSeasonFormData = z.infer<typeof updateSeasonSchema>;

export type SeasonsProps = {
  seasons: Season[];
  tvShows: TVShow[];
};
