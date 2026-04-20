import { UpdateSeasonUseCase } from "@/core/application/seasons/update-season.use-case";
import type { SeasonRepository } from "@/core/domain/seasons/season.repository";

const makeRepository = (
  overrides: Partial<SeasonRepository> = {},
): SeasonRepository => {
  const base: SeasonRepository = {
    search: jest.fn(),
    read: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { ...base, ...overrides };
};

describe("UpdateSeasonUseCase", () => {
  it("should call repository.update with key and remaining data", async () => {
    const updated = { "@key": "seasons:abc", year: 2025 };
    const repository = makeRepository({
      update: jest.fn().mockResolvedValue(updated),
    });
    const useCase = new UpdateSeasonUseCase(repository);
    const input = { key: "seasons:abc", year: 2025 };

    const result = await useCase.execute(input);

    expect(result).toEqual(updated);
    expect(repository.update).toHaveBeenCalledWith("seasons:abc", {
      year: 2025,
    });
    expect(repository.update).toHaveBeenCalledTimes(1);
  });

  it("should not pass key as part of the data payload", async () => {
    const repository = makeRepository({
      update: jest.fn().mockResolvedValue({}),
    });
    const useCase = new UpdateSeasonUseCase(repository);
    const input = { key: "seasons:abc", year: 2026 };

    await useCase.execute(input);

    const [, dataArg] = (repository.update as jest.Mock).mock.calls[0];
    expect(dataArg).not.toHaveProperty("key");
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      update: jest.fn().mockRejectedValue(new Error("SEASON_NOT_FOUND")),
    });
    const useCase = new UpdateSeasonUseCase(repository);

    await expect(useCase.execute({ key: "seasons:abc" })).rejects.toThrow(
      "SEASON_NOT_FOUND",
    );
  });
});
