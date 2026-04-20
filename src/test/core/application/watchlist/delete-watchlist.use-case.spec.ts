import { DeleteWatchlistUseCase } from "@/core/application/watchlist/delete-watchlist.use-case";
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

describe("DeleteWatchlistUseCase", () => {
  it("should call repository.delete with the provided key", async () => {
    const repository = makeRepository({
      delete: jest.fn().mockResolvedValue(undefined),
    });
    const useCase = new DeleteWatchlistUseCase(repository);

    const result = await useCase.execute("watchlist:abc");

    expect(result).toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith("watchlist:abc");
    expect(repository.delete).toHaveBeenCalledTimes(1);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      delete: jest.fn().mockRejectedValue(new Error("WATCHLIST_NOT_FOUND")),
    });
    const useCase = new DeleteWatchlistUseCase(repository);

    await expect(useCase.execute("watchlist:abc")).rejects.toThrow(
      "WATCHLIST_NOT_FOUND",
    );
  });
});
