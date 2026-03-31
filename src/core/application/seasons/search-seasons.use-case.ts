import type { SeasonRepository } from "@/core/domain/seasons/season.repository";

export class SearchSeasonsUseCase {
  constructor(private repository: SeasonRepository) {}

  async execute() {
    return this.repository.search();
  }
}
