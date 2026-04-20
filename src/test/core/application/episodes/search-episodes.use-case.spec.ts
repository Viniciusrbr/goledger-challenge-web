import { SearchEpisodesUseCase } from "@/core/application/episodes/search-episodes.use-case";
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

describe("SearchEpisodesUseCase", () => {
  it("should return all episodes from the repository", async () => {
    const episodes = [
      { "@key": "episodes:abc", title: "Pilot", episodeNumber: 1 },
      { "@key": "episodes:def", title: "Episode 2", episodeNumber: 2 },
    ];
    const repository = makeRepository({
      search: jest.fn().mockResolvedValue(episodes),
    });
    const useCase = new SearchEpisodesUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual(episodes);
    expect(repository.search).toHaveBeenCalledTimes(1);
  });

  it("should return an empty list when the repository has no episodes", async () => {
    const repository = makeRepository({
      search: jest.fn().mockResolvedValue([]),
    });
    const useCase = new SearchEpisodesUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      search: jest.fn().mockRejectedValue(new Error("API_ERROR")),
    });
    const useCase = new SearchEpisodesUseCase(repository);

    await expect(useCase.execute()).rejects.toThrow("API_ERROR");
  });
});
