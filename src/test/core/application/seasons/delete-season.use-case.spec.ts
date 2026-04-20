import { DeleteSeasonUseCase } from "@/core/application/seasons/delete-season.use-case";
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

describe("DeleteSeasonUseCase", () => {
  it("should call repository.delete with the provided key", async () => {
    const repository = makeRepository({
      delete: jest.fn().mockResolvedValue(undefined),
    });
    const useCase = new DeleteSeasonUseCase(repository);

    const result = await useCase.execute("seasons:abc");

    expect(result).toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith("seasons:abc");
    expect(repository.delete).toHaveBeenCalledTimes(1);
  });

  it("should propagate errors thrown by the repository", async () => {
    const repository = makeRepository({
      delete: jest.fn().mockRejectedValue(new Error("SEASON_NOT_FOUND")),
    });
    const useCase = new DeleteSeasonUseCase(repository);

    await expect(useCase.execute("seasons:abc")).rejects.toThrow(
      "SEASON_NOT_FOUND",
    );
  });
});
