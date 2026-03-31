import type {
  CreateWatchlistInput,
  UpdateWatchlistInput,
  Watchlist,
} from "./watchlist.entity";

export interface WatchlistRepository {
  search(): Promise<Watchlist[]>;
  read(key: string): Promise<Watchlist>;
  create(data: CreateWatchlistInput): Promise<Watchlist[]>;
  update(key: string, data: UpdateWatchlistInput): Promise<Watchlist>;
  delete(key: string): Promise<void>;
}
