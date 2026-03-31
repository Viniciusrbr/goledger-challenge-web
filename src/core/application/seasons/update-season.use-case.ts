import type { SeasonRepository } from "@/core/domain/seasons/season.repository";
import type { UpdateSeasonDTO } from "./update-season.dto";

export class UpdateSeasonUseCase {
  constructor(private repository: SeasonRepository) {}

  async execute({ key, ...data }: UpdateSeasonDTO) {
    return this.repository.update(key, data);
  }
}
