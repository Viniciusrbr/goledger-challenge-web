import { revalidatePath } from "next/cache";
import {
  createSeasonAction,
  deleteSeasonAction,
  searchSeasonsAction,
  updateSeasonAction,
} from "@/app/actions/season.actions";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/infra/repositories/api-season.repository", () => ({
  ApiSeasonRepository: jest.fn(),
}));

const mockedCreateExecute = jest.fn();
const mockedUpdateExecute = jest.fn();
const mockedDeleteExecute = jest.fn();
const mockedSearchExecute = jest.fn();

jest.mock("@/core/application/seasons/create-season.use-case", () => ({
  CreateSeasonUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedCreateExecute })),
}));

jest.mock("@/core/application/seasons/update-season.use-case", () => ({
  UpdateSeasonUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedUpdateExecute })),
}));

jest.mock("@/core/application/seasons/delete-season.use-case", () => ({
  DeleteSeasonUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedDeleteExecute })),
}));

jest.mock("@/core/application/seasons/search-seasons.use-case", () => ({
  SearchSeasonsUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedSearchExecute })),
}));

const validCreateData = {
  number: 1,
  tvShow: { "@assetType": "tvShows" as const, "@key": "tvShows:abc" },
  year: 2024,
};

describe("Server Actions: Seasons", () => {
  beforeEach(() => {
    mockedCreateExecute.mockReset();
    mockedUpdateExecute.mockReset();
    mockedDeleteExecute.mockReset();
    mockedSearchExecute.mockReset();
    (revalidatePath as jest.Mock).mockReset();
  });

  describe("createSeasonAction", () => {
    it("should create a season successfully", async () => {
      mockedCreateExecute.mockResolvedValue(undefined);

      const result = await createSeasonAction(validCreateData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Season created!");
      expect(revalidatePath).toHaveBeenCalledWith("/seasons");
    });

    it("should return invalid data error when required fields are missing", async () => {
      const data = {
        number: 0,
        tvShow: { "@assetType": "tvShows" as const, "@key": "" },
        year: 1800,
      };

      const result = await createSeasonAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid data");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error message when use case throws", async () => {
      mockedCreateExecute.mockRejectedValue(new Error("API_ERROR"));

      const result = await createSeasonAction(validCreateData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("API_ERROR");
    });
  });

  describe("updateSeasonAction", () => {
    it("should update a season successfully", async () => {
      mockedUpdateExecute.mockResolvedValue(undefined);
      const data = { key: "seasons:abc", year: 2025 };

      const result = await updateSeasonAction(data);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Season updated!");
      expect(revalidatePath).toHaveBeenCalledWith("/seasons");
    });

    it("should return invalid data error when key is missing", async () => {
      const data = { key: "" };

      const result = await updateSeasonAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid data");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error message when use case throws", async () => {
      mockedUpdateExecute.mockRejectedValue(new Error("SEASON_NOT_FOUND"));
      const data = { key: "seasons:abc" };

      const result = await updateSeasonAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("SEASON_NOT_FOUND");
    });
  });

  describe("deleteSeasonAction", () => {
    it("should delete a season successfully", async () => {
      mockedDeleteExecute.mockResolvedValue(undefined);

      const result = await deleteSeasonAction("seasons:abc");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Season deleted!");
      expect(revalidatePath).toHaveBeenCalledWith("/seasons");
    });

    it("should return error when key is empty", async () => {
      const result = await deleteSeasonAction("");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Key is required");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error message when use case throws", async () => {
      mockedDeleteExecute.mockRejectedValue(new Error("SEASON_NOT_FOUND"));

      const result = await deleteSeasonAction("seasons:abc");

      expect(result.success).toBe(false);
      expect(result.message).toBe("SEASON_NOT_FOUND");
    });
  });

  describe("searchSeasonsAction", () => {
    it("should return seasons on success", async () => {
      const seasons = [{ "@key": "seasons:abc", number: 1, year: 2024 }];
      mockedSearchExecute.mockResolvedValue(seasons);

      const result = await searchSeasonsAction();

      expect(result).toEqual(seasons);
    });

    it("should return empty array when use case throws", async () => {
      mockedSearchExecute.mockRejectedValue(new Error("API_ERROR"));

      const result = await searchSeasonsAction();

      expect(result).toEqual([]);
    });
  });
});
