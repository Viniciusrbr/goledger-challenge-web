import type { EpisodeRepository } from "@/core/domain/episodes/episode.repository";

export class DeleteEpisodeUseCase {
  constructor(private repository: EpisodeRepository) {}

  async execute(key: string) {
    return this.repository.delete(key);
  }
}
