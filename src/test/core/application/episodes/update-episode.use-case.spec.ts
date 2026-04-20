import { UpdateEpisodeUseCase } from "@/core/application/episodes/update-episode.use-case";
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

describe("UpdateEpisodeUseCase", () => {
  it("should call repository.update with key and remaining data", async () => {
    const updated = { "@key": "episodes:abc", title: "New Title" };
    const repository = makeRepository({
      update: jest.fn().mockResolvedValue(updated),
    });
    const useCase = new UpdateEpisodeUseCase(repository);
    const input = { key: "episodes:abc", title: "New Title" };

    const result = await useCase.execute(input);

    expect(result).toEqual(updated);
    expect(repository.update).toHaveBeenCalledWith("episodes:abc", {
      title: "New Title",
    });
    expect(repository.update).toHaveBeenCalledTimes(1);
  });

  it("should not pass key as part of the data payload", async () => {
    const repository = makeRepository({
      update: jest.fn().mockResolvedValue({}),
    });
    const useCase = new UpdateEpisodeUseCase(repository);
    const input = { key: "episodes:abc", description: "Updated description" };

    await useCase.execute(input);

    const [, dataArg] = (repository.update as jest.Mock).mock.calls[0];
    expect(dataArg).not.toHaveProperty("key");
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      update: jest.fn().mockRejectedValue(new Error("EPISODE_NOT_FOUND")),
    });
    const useCase = new UpdateEpisodeUseCase(repository);

    await expect(useCase.execute({ key: "episodes:abc" })).rejects.toThrow(
      "EPISODE_NOT_FOUND",
    );
  });
});
