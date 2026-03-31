import type {
  CreateSeasonInput,
  Season,
  UpdateSeasonInput,
} from "./season.entity";

export interface SeasonRepository {
  search(): Promise<Season[]>;
  read(key: string): Promise<Season>;
  create(data: CreateSeasonInput): Promise<Season[]>;
  update(key: string, data: UpdateSeasonInput): Promise<Season>;
  delete(key: string): Promise<void>;
}
