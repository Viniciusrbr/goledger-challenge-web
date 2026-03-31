import type { EpisodeRepository } from "@/core/domain/episodes/episode.repository";

export class SearchEpisodesUseCase {
  constructor(private repository: EpisodeRepository) {}

  async execute() {
    return this.repository.search();
  }
}
