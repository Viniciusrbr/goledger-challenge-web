import type { WatchlistRepository } from "@/core/domain/watchlist/watchlist.repository";

export class DeleteWatchlistUseCase {
  constructor(private repository: WatchlistRepository) {}

  async execute(key: string) {
    return this.repository.delete(key);
  }
}
