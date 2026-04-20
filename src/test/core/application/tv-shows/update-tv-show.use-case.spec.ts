import { UpdateTVShowUseCase } from "@/core/application/tv-shows/update-tv-show.use-case";
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

describe("UpdateTVShowUseCase", () => {
  it("should call repository.update with key and remaining data", async () => {
    const updated = { "@key": "tvShows:abc", description: "New description" };
    const repository = makeRepository({
      update: jest.fn().mockResolvedValue(updated),
    });
    const useCase = new UpdateTVShowUseCase(repository);
    const input = { key: "tvShows:abc", description: "New description" };

    const result = await useCase.execute(input);

    expect(result).toEqual(updated);
    expect(repository.update).toHaveBeenCalledWith("tvShows:abc", {
      description: "New description",
    });
    expect(repository.update).toHaveBeenCalledTimes(1);
  });

  it("should not pass key as part of the data payload", async () => {
    const repository = makeRepository({
      update: jest.fn().mockResolvedValue({}),
    });
    const useCase = new UpdateTVShowUseCase(repository);
    const input = { key: "tvShows:abc", recommendedAge: 16 };

    await useCase.execute(input);

    const [, dataArg] = (repository.update as jest.Mock).mock.calls[0];
    expect(dataArg).not.toHaveProperty("key");
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      update: jest.fn().mockRejectedValue(new Error("TV_SHOW_NOT_FOUND")),
    });
    const useCase = new UpdateTVShowUseCase(repository);

    await expect(useCase.execute({ key: "tvShows:abc" })).rejects.toThrow(
      "TV_SHOW_NOT_FOUND",
    );
  });
});
