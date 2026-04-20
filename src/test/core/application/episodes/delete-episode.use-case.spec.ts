import { DeleteEpisodeUseCase } from "@/core/application/episodes/delete-episode.use-case";
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

describe("DeleteEpisodeUseCase", () => {
  it("should call repository.delete with the provided key", async () => {
    const repository = makeRepository({
      delete: jest.fn().mockResolvedValue(undefined),
    });
    const useCase = new DeleteEpisodeUseCase(repository);

    const result = await useCase.execute("episodes:abc");

    expect(result).toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith("episodes:abc");
    expect(repository.delete).toHaveBeenCalledTimes(1);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      delete: jest.fn().mockRejectedValue(new Error("EPISODE_NOT_FOUND")),
    });
    const useCase = new DeleteEpisodeUseCase(repository);

    await expect(useCase.execute("episodes:abc")).rejects.toThrow(
      "EPISODE_NOT_FOUND",
    );
  });
});
