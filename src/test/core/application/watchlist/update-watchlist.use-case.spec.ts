import { UpdateWatchlistUseCase } from "@/core/application/watchlist/update-watchlist.use-case";
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

describe("UpdateWatchlistUseCase", () => {
  it("should call repository.update with key and remaining data", async () => {
    const updated = { "@key": "watchlist:abc", description: "New description" };
    const repository = makeRepository({
      update: jest.fn().mockResolvedValue(updated),
    });
    const useCase = new UpdateWatchlistUseCase(repository);
    const input = { key: "watchlist:abc", description: "New description" };

    const result = await useCase.execute(input);

    expect(result).toEqual(updated);
    expect(repository.update).toHaveBeenCalledWith("watchlist:abc", {
      description: "New description",
    });
    expect(repository.update).toHaveBeenCalledTimes(1);
  });

  it("should not pass key as part of the data payload", async () => {
    const repository = makeRepository({
      update: jest.fn().mockResolvedValue({}),
    });
    const useCase = new UpdateWatchlistUseCase(repository);
    const input = {
      key: "watchlist:abc",
      tvShows: [{ "@assetType": "tvShows" as const, "@key": "tvShows:abc" }],
    };

    await useCase.execute(input);

    const [, dataArg] = (repository.update as jest.Mock).mock.calls[0];
    expect(dataArg).not.toHaveProperty("key");
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      update: jest.fn().mockRejectedValue(new Error("WATCHLIST_NOT_FOUND")),
    });
    const useCase = new UpdateWatchlistUseCase(repository);

    await expect(useCase.execute({ key: "watchlist:abc" })).rejects.toThrow(
      "WATCHLIST_NOT_FOUND",
    );
  });
});
