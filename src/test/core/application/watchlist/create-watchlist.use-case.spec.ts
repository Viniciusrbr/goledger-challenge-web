import { CreateWatchlistUseCase } from "@/core/application/watchlist/create-watchlist.use-case";
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

describe("CreateWatchlistUseCase", () => {
  it("should call repository.create with the provided data and return the result", async () => {
    const input = { title: "My Watchlist" };
    const created = [{ "@key": "watchlist:abc", ...input }];
    const repository = makeRepository({
      create: jest.fn().mockResolvedValue(created),
    });
    const useCase = new CreateWatchlistUseCase(repository);

    const result = await useCase.execute(input);

    expect(result).toEqual(created);
    expect(repository.create).toHaveBeenCalledWith(input);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("should call repository.create with optional fields when provided", async () => {
    const input = {
      title: "Weekend Picks",
      description: "Shows to watch this weekend",
      tvShows: [{ "@assetType": "tvShows" as const, "@key": "tvShows:abc" }],
    };
    const repository = makeRepository({
      create: jest.fn().mockResolvedValue([]),
    });
    const useCase = new CreateWatchlistUseCase(repository);

    await useCase.execute(input);

    expect(repository.create).toHaveBeenCalledWith(input);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      create: jest.fn().mockRejectedValue(new Error("API_ERROR")),
    });
    const useCase = new CreateWatchlistUseCase(repository);

    await expect(useCase.execute({ title: "My Watchlist" })).rejects.toThrow(
      "API_ERROR",
    );
  });
});
