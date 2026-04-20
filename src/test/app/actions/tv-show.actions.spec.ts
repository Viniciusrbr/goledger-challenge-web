import { revalidatePath } from "next/cache";
import {
  createTVShowAction,
  deleteTVShowAction,
  searchTVShowsAction,
  updateTVShowAction,
} from "@/app/actions/tv-show.actions";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/infra/repositories/api-tv-show.repository", () => ({
  ApiTVShowRepository: jest.fn(),
}));

const mockedCreateExecute = jest.fn();
const mockedUpdateExecute = jest.fn();
const mockedDeleteExecute = jest.fn();
const mockedSearchExecute = jest.fn();

jest.mock("@/core/application/tv-shows/create-tv-show.use-case", () => ({
  CreateTVShowUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedCreateExecute })),
}));

jest.mock("@/core/application/tv-shows/update-tv-show.use-case", () => ({
  UpdateTVShowUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedUpdateExecute })),
}));

jest.mock("@/core/application/tv-shows/delete-tv-show.use-case", () => ({
  DeleteTVShowUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedDeleteExecute })),
}));

jest.mock("@/core/application/tv-shows/search-tv-shows.use-case", () => ({
  SearchTVShowsUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedSearchExecute })),
}));

const validCreateData = {
  title: "Breaking Bad",
  description: "A chemistry teacher becomes a drug lord",
  recommendedAge: 18,
};

describe("Server Actions: TV Shows", () => {
  beforeEach(() => {
    mockedCreateExecute.mockReset();
    mockedUpdateExecute.mockReset();
    mockedDeleteExecute.mockReset();
    mockedSearchExecute.mockReset();
    (revalidatePath as jest.Mock).mockReset();
  });

  describe("createTVShowAction", () => {
    it("should create a TV show successfully", async () => {
      mockedCreateExecute.mockResolvedValue(undefined);

      const result = await createTVShowAction(validCreateData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("TV Show created!");
      expect(revalidatePath).toHaveBeenCalledWith("/tv-shows");
    });

    it("should return invalid data error when required fields are missing", async () => {
      const data = { title: "", description: "", recommendedAge: -1 };

      const result = await createTVShowAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid data");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error message when use case throws", async () => {
      mockedCreateExecute.mockRejectedValue(new Error("API_ERROR"));

      const result = await createTVShowAction(validCreateData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("API_ERROR");
    });
  });

  describe("updateTVShowAction", () => {
    it("should update a TV show successfully", async () => {
      mockedUpdateExecute.mockResolvedValue(undefined);
      const data = { key: "tvShows:abc", description: "Updated description" };

      const result = await updateTVShowAction(data);

      expect(result.success).toBe(true);
      expect(result.message).toBe("TV Show updated!");
      expect(revalidatePath).toHaveBeenCalledWith("/tv-shows");
    });

    it("should return invalid data error when key is missing", async () => {
      const data = { key: "" };

      const result = await updateTVShowAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid data");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error message when use case throws", async () => {
      mockedUpdateExecute.mockRejectedValue(new Error("TV_SHOW_NOT_FOUND"));
      const data = { key: "tvShows:abc" };

      const result = await updateTVShowAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("TV_SHOW_NOT_FOUND");
    });
  });

  describe("deleteTVShowAction", () => {
    it("should delete a TV show successfully", async () => {
      mockedDeleteExecute.mockResolvedValue(undefined);

      const result = await deleteTVShowAction("tvShows:abc");

      expect(result.success).toBe(true);
      expect(result.message).toBe("TV Show deleted!");
      expect(revalidatePath).toHaveBeenCalledWith("/tv-shows");
    });

    it("should return error when key is empty", async () => {
      const result = await deleteTVShowAction("");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Key is required");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error message when use case throws", async () => {
      mockedDeleteExecute.mockRejectedValue(new Error("TV_SHOW_NOT_FOUND"));

      const result = await deleteTVShowAction("tvShows:abc");

      expect(result.success).toBe(false);
      expect(result.message).toBe("TV_SHOW_NOT_FOUND");
    });
  });

  describe("searchTVShowsAction", () => {
    it("should return TV shows on success", async () => {
      const tvShows = [
        { "@key": "tvShows:abc", title: "Breaking Bad", recommendedAge: 18 },
      ];
      mockedSearchExecute.mockResolvedValue(tvShows);

      const result = await searchTVShowsAction();

      expect(result).toEqual(tvShows);
    });

    it("should return empty array when use case throws", async () => {
      mockedSearchExecute.mockRejectedValue(new Error("API_ERROR"));

      const result = await searchTVShowsAction();

      expect(result).toEqual([]);
    });
  });
});
