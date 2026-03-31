import type { TVShowRepository } from "@/core/domain/tv-shows/tv-show.repository";
import type { CreateTVShowDTO } from "./create-tv-show.dto";

export class CreateTVShowUseCase {
  constructor(private repository: TVShowRepository) {}

  async execute(data: CreateTVShowDTO) {
    return this.repository.create(data);
  }
}
