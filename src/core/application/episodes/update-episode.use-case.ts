import type { EpisodeRepository } from "@/core/domain/episodes/episode.repository";
import type { UpdateEpisodeDTO } from "./update-episode.dto";

export class UpdateEpisodeUseCase {
  constructor(private repository: EpisodeRepository) {}

  async execute({ key, ...data }: UpdateEpisodeDTO) {
    return this.repository.update(key, data);
  }
}
