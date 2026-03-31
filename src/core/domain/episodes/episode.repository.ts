import type {
  CreateEpisodeInput,
  Episode,
  UpdateEpisodeInput,
} from "./episode.entity";

export interface EpisodeRepository {
  search(): Promise<Episode[]>;
  read(key: string): Promise<Episode>;
  create(data: CreateEpisodeInput): Promise<Episode[]>;
  update(key: string, data: UpdateEpisodeInput): Promise<Episode>;
  delete(key: string): Promise<void>;
}
