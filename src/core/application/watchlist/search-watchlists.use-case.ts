import type { WatchlistRepository } from "@/core/domain/watchlist/watchlist.repository";

export class SearchWatchlistsUseCase {
  constructor(private repository: WatchlistRepository) {}

  async execute() {
    return this.repository.search();
  }
}
