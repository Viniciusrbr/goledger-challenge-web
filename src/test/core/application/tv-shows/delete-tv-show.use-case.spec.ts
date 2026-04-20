import { DeleteTVShowUseCase } from "@/core/application/tv-shows/delete-tv-show.use-case";
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

describe("DeleteTVShowUseCase", () => {
  it("should call repository.delete with the provided key", async () => {
    const repository = makeRepository({
      delete: jest.fn().mockResolvedValue(undefined),
    });
    const useCase = new DeleteTVShowUseCase(repository);

    const result = await useCase.execute("tvShows:abc");

    expect(result).toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith("tvShows:abc");
    expect(repository.delete).toHaveBeenCalledTimes(1);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      delete: jest.fn().mockRejectedValue(new Error("TV_SHOW_NOT_FOUND")),
    });
    const useCase = new DeleteTVShowUseCase(repository);

    await expect(useCase.execute("tvShows:abc")).rejects.toThrow(
      "TV_SHOW_NOT_FOUND",
    );
  });
});
