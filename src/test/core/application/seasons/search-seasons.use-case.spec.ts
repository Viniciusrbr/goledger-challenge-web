import { SearchSeasonsUseCase } from "@/core/application/seasons/search-seasons.use-case";
import type { SeasonRepository } from "@/core/domain/seasons/season.repository";

const makeRepository = (
  overrides: Partial<SeasonRepository> = {},
): SeasonRepository => {
  const base: SeasonRepository = {
    search: jest.fn(),
    read: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { ...base, ...overrides };
};

describe("SearchSeasonsUseCase", () => {
  it("should return all seasons from the repository", async () => {
    const seasons = [
      { "@key": "seasons:abc", number: 1, year: 2024 },
      { "@key": "seasons:def", number: 2, year: 2025 },
    ];
    const repository = makeRepository({
      search: jest.fn().mockResolvedValue(seasons),
    });
    const useCase = new SearchSeasonsUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual(seasons);
    expect(repository.search).toHaveBeenCalledTimes(1);
  });

  it("should return an empty list when the repository has no seasons", async () => {
    const repository = makeRepository({
      search: jest.fn().mockResolvedValue([]),
    });
    const useCase = new SearchSeasonsUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      search: jest.fn().mockRejectedValue(new Error("API_ERROR")),
    });
    const useCase = new SearchSeasonsUseCase(repository);

    await expect(useCase.execute()).rejects.toThrow("API_ERROR");
  });
});
