import { SearchWatchlistsUseCase } from "@/core/application/watchlist/search-watchlists.use-case";
import type { WatchlistRepository } from "@/core/domain/watchlist/watchlist.repository";

const makeRepository = (
  overrides: Partial<WatchlistRepository> = {},
): WatchlistRepository => {
  const base: WatchlistRepository = {
    search: jest.fn(),
    read: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { ...base, ...overrides };
};

describe("SearchWatchlistsUseCase", () => {
  it("should return all watchlists from the repository", async () => {
    const watchlists = [
      { "@key": "watchlist:abc", title: "My Watchlist" },
      { "@key": "watchlist:def", title: "Weekend Picks" },
    ];
    const repository = makeRepository({
      search: jest.fn().mockResolvedValue(watchlists),
    });
    const useCase = new SearchWatchlistsUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual(watchlists);
    expect(repository.search).toHaveBeenCalledTimes(1);
  });

  it("should return an empty list when the repository has no watchlists", async () => {
    const repository = makeRepository({
      search: jest.fn().mockResolvedValue([]),
    });
    const useCase = new SearchWatchlistsUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      search: jest.fn().mockRejectedValue(new Error("API_ERROR")),
    });
    const useCase = new SearchWatchlistsUseCase(repository);

    await expect(useCase.execute()).rejects.toThrow("API_ERROR");
  });
});
