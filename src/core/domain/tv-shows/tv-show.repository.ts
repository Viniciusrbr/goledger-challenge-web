import type {
  CreateTVShowInput,
  TVShow,
  UpdateTVShowInput,
} from "./tv-show.entity";

export interface TVShowRepository {
  search(): Promise<TVShow[]>;
  read(key: string): Promise<TVShow>;
  create(data: CreateTVShowInput): Promise<TVShow[]>;
  update(key: string, data: UpdateTVShowInput): Promise<TVShow>;
  delete(key: string): Promise<void>;
}
