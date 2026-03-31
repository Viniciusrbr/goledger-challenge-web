import type { TVShowRepository } from "@/core/domain/tv-shows/tv-show.repository";
import type { UpdateTVShowDTO } from "./update-tv-show.dto";

export class UpdateTVShowUseCase {
  constructor(private repository: TVShowRepository) {}

  async execute({ key, ...data }: UpdateTVShowDTO) {
    return this.repository.update(key, data);
  }
}
