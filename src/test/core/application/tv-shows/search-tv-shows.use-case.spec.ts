import { SearchTVShowsUseCase } from "@/core/application/tv-shows/search-tv-shows.use-case";
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

describe("SearchTVShowsUseCase", () => {
  it("should return all TV shows from the repository", async () => {
    const tvShows = [
      { "@key": "tvShows:abc", title: "Breaking Bad", recommendedAge: 18 },
      { "@key": "tvShows:def", title: "Better Call Saul", recommendedAge: 16 },
    ];
    const repository = makeRepository({
      search: jest.fn().mockResolvedValue(tvShows),
    });
    const useCase = new SearchTVShowsUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual(tvShows);
    expect(repository.search).toHaveBeenCalledTimes(1);
  });

  it("should return an empty list when the repository has no TV shows", async () => {
    const repository = makeRepository({
      search: jest.fn().mockResolvedValue([]),
    });
    const useCase = new SearchTVShowsUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      search: jest.fn().mockRejectedValue(new Error("API_ERROR")),
    });
    const useCase = new SearchTVShowsUseCase(repository);

    await expect(useCase.execute()).rejects.toThrow("API_ERROR");
  });
});
