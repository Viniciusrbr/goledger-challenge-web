import type { TVShowRepository } from "@/core/domain/tv-shows/tv-show.repository";

export class DeleteTVShowUseCase {
  constructor(private repository: TVShowRepository) {}

  async execute(key: string) {
    return this.repository.delete(key);
  }
}
