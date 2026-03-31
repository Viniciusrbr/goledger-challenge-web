import type { WatchlistRepository } from "@/core/domain/watchlist/watchlist.repository";
import type { UpdateWatchlistDTO } from "./update-watchlist.dto";

export class UpdateWatchlistUseCase {
  constructor(private repository: WatchlistRepository) {}

  async execute({ key, ...data }: UpdateWatchlistDTO) {
    return this.repository.update(key, data);
  }
}
