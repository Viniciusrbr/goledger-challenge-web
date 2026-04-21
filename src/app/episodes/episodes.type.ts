import type { z } from "zod";
import type { Episode } from "@/core/domain/episodes/episode.entity";
import type { Season } from "@/core/domain/seasons/season.entity";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";
import type { createEpisodeSchema, updateEpisodeSchema } from "./episodes.schema";

export type CreateEpisodeFormData = z.infer<typeof createEpisodeSchema>;
export type UpdateEpisodeFormData = z.infer<typeof updateEpisodeSchema>;

export type EpisodesProps = {
  episodes: Episode[];
  seasons: Season[];
  tvShows: TVShow[];
};
