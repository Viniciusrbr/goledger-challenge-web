import { CreateTVShowUseCase } from "@/core/application/tv-shows/create-tv-show.use-case";
import type { TVShowRepository } from "@/core/domain/tv-shows/tv-show.repository";

const makeRepository = (
  overrides: Partial<TVShowRepository> = {},
): TVShowRepository => {
  const base: TVShowRepository = {
    search: jest.fn(),
    read: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { ...base, ...overrides };
};

const validInput = {
  title: "Breaking Bad",
  description: "A chemistry teacher becomes a drug lord",
  recommendedAge: 18,
};

describe("CreateTVShowUseCase", () => {
  it("should call repository.create with the provided data and return the result", async () => {
    const created = [{ "@key": "tvShows:abc", ...validInput }];
    const repository = makeRepository({
      create: jest.fn().mockResolvedValue(created),
    });
    const useCase = new CreateTVShowUseCase(repository);

    const result = await useCase.execute(validInput);

    expect(result).toEqual(created);
    expect(repository.create).toHaveBeenCalledWith(validInput);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      create: jest.fn().mockRejectedValue(new Error("API_ERROR")),
    });
    const useCase = new CreateTVShowUseCase(repository);

    await expect(useCase.execute(validInput)).rejects.toThrow("API_ERROR");
  });
});
