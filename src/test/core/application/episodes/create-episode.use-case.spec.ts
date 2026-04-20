import { CreateEpisodeUseCase } from "@/core/application/episodes/create-episode.use-case";
import type { EpisodeRepository } from "@/core/domain/episodes/episode.repository";

const makeRepository = (
  overrides: Partial<EpisodeRepository> = {},
): EpisodeRepository => {
  const base: EpisodeRepository = {
    search: jest.fn(),
    read: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { ...base, ...overrides };
};

const validInput = {
  episodeNumber: 1,
  season: { "@assetType": "seasons" as const, "@key": "seasons:abc" },
  title: "Pilot",
  releaseDate: "2024-01-01",
  description: "First episode of the series",
};

describe("CreateEpisodeUseCase", () => {
  it("should call repository.create with the provided data and return the result", async () => {
    const created = [{ "@key": "episodes:abc", ...validInput }];
    const repository = makeRepository({
      create: jest.fn().mockResolvedValue(created),
    });
    const useCase = new CreateEpisodeUseCase(repository);

    const result = await useCase.execute(validInput);

    expect(result).toEqual(created);
    expect(repository.create).toHaveBeenCalledWith(validInput);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      create: jest.fn().mockRejectedValue(new Error("API_ERROR")),
    });
    const useCase = new CreateEpisodeUseCase(repository);

    await expect(useCase.execute(validInput)).rejects.toThrow("API_ERROR");
  });
});
