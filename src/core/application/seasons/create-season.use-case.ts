import type { SeasonRepository } from "@/core/domain/seasons/season.repository";
import type { CreateSeasonDTO } from "./create-season.dto";

export class CreateSeasonUseCase {
  constructor(private repository: SeasonRepository) {}

  async execute(data: CreateSeasonDTO) {
    return this.repository.create(data);
  }
}
