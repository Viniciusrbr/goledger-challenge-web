import { CreateSeasonUseCase } from "@/core/application/seasons/create-season.use-case";
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

const validInput = {
  number: 1,
  tvShow: { "@assetType": "tvShows" as const, "@key": "tvShows:abc" },
  year: 2024,
};

describe("CreateSeasonUseCase", () => {
  it("should call repository.create with the provided data and return the result", async () => {
    const created = [{ "@key": "seasons:abc", ...validInput }];
    const repository = makeRepository({
      create: jest.fn().mockResolvedValue(created),
    });
    const useCase = new CreateSeasonUseCase(repository);

    const result = await useCase.execute(validInput);

    expect(result).toEqual(created);
    expect(repository.create).toHaveBeenCalledWith(validInput);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      create: jest.fn().mockRejectedValue(new Error("API_ERROR")),
    });
    const useCase = new CreateSeasonUseCase(repository);

    await expect(useCase.execute(validInput)).rejects.toThrow("API_ERROR");
  });
});
