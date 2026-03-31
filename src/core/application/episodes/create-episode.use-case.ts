import type { EpisodeRepository } from "@/core/domain/episodes/episode.repository";
import type { CreateEpisodeDTO } from "./create-episode.dto";

export class CreateEpisodeUseCase {
  constructor(private repository: EpisodeRepository) {}

  async execute(data: CreateEpisodeDTO) {
    return this.repository.create(data);
  }
}
