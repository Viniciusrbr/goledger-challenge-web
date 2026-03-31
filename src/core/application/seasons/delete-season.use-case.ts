import type { SeasonRepository } from "@/core/domain/seasons/season.repository";

export class DeleteSeasonUseCase {
  constructor(private repository: SeasonRepository) {}

  async execute(key: string) {
    return this.repository.delete(key);
  }
}
