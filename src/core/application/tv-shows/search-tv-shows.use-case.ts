import type { TVShowRepository } from "@/core/domain/tv-shows/tv-show.repository";

export class SearchTVShowsUseCase {
  constructor(private repository: TVShowRepository) {}

  async execute() {
    return this.repository.search();
  }
}
