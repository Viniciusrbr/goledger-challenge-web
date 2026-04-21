import type { z } from "zod";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";
import type { createTVShowSchema, updateTVShowSchema } from "./tv-shows.schema";

export type CreateTVShowFormData = z.infer<typeof createTVShowSchema>;
export type UpdateTVShowFormData = z.infer<typeof updateTVShowSchema>;

export type TVShowsProps = {
  tvShows: TVShow[];
};
