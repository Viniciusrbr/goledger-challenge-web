import type { WatchlistRepository } from "@/core/domain/watchlist/watchlist.repository";
import type { CreateWatchlistDTO } from "./create-watchlist.dto";

export class CreateWatchlistUseCase {
  constructor(private repository: WatchlistRepository) {}

  async execute(data: CreateWatchlistDTO) {
    return this.repository.create(data);
  }
}
