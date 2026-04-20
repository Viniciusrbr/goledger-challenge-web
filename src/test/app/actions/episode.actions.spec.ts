import { revalidatePath } from "next/cache";
import {
  createEpisodeAction,
  deleteEpisodeAction,
  searchEpisodesAction,
  updateEpisodeAction,
} from "@/app/actions/episode.actions";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/infra/repositories/api-episode.repository", () => ({
  ApiEpisodeRepository: jest.fn(),
}));

const mockedCreateExecute = jest.fn();
const mockedUpdateExecute = jest.fn();
const mockedDeleteExecute = jest.fn();
const mockedSearchExecute = jest.fn();

jest.mock("@/core/application/episodes/create-episode.use-case", () => ({
  CreateEpisodeUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedCreateExecute })),
}));

jest.mock("@/core/application/episodes/update-episode.use-case", () => ({
  UpdateEpisodeUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedUpdateExecute })),
}));

jest.mock("@/core/application/episodes/delete-episode.use-case", () => ({
  DeleteEpisodeUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedDeleteExecute })),
}));

jest.mock("@/core/application/episodes/search-episodes.use-case", () => ({
  SearchEpisodesUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedSearchExecute })),
}));

const validCreateData = {
  episodeNumber: 1,
  season: { "@assetType": "seasons" as const, "@key": "seasons:abc" },
  title: "Pilot",
  releaseDate: "2024-01-01",
  description: "First episode",
};

describe("Server Actions: Episodes", () => {
  beforeEach(() => {
    mockedCreateExecute.mockReset();
    mockedUpdateExecute.mockReset();
    mockedDeleteExecute.mockReset();
    mockedSearchExecute.mockReset();
    (revalidatePath as jest.Mock).mockReset();
  });

  describe("createEpisodeAction", () => {
    it("should create an episode successfully", async () => {
      mockedCreateExecute.mockResolvedValue(undefined);

      const result = await createEpisodeAction(validCreateData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Episode created!");
      expect(revalidatePath).toHaveBeenCalledWith("/episodes");
    });

    it("should return invalid data error when required fields are missing", async () => {
      const data = {
        episodeNumber: 0,
        season: { "@assetType": "seasons" as const, "@key": "" },
        title: "",
        releaseDate: "",
        description: "",
      };

      const result = await createEpisodeAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid data");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error message when use case throws", async () => {
      mockedCreateExecute.mockRejectedValue(new Error("API_ERROR"));

      const result = await createEpisodeAction(validCreateData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("API_ERROR");
    });
  });

  describe("updateEpisodeAction", () => {
    it("should update an episode successfully", async () => {
      mockedUpdateExecute.mockResolvedValue(undefined);
      const data = { key: "episodes:abc", title: "Updated Title" };

      const result = await updateEpisodeAction(data);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Episode updated!");
      expect(revalidatePath).toHaveBeenCalledWith("/episodes");
    });

    it("should return invalid data error when key is missing", async () => {
      const data = { key: "" };

      const result = await updateEpisodeAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid data");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error message when use case throws", async () => {
      mockedUpdateExecute.mockRejectedValue(new Error("EPISODE_NOT_FOUND"));
      const data = { key: "episodes:abc" };

      const result = await updateEpisodeAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("EPISODE_NOT_FOUND");
    });
  });

  describe("deleteEpisodeAction", () => {
    it("should delete an episode successfully", async () => {
      mockedDeleteExecute.mockResolvedValue(undefined);

      const result = await deleteEpisodeAction("episodes:abc");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Episode deleted!");
      expect(revalidatePath).toHaveBeenCalledWith("/episodes");
    });

    it("should return error when key is empty", async () => {
      const result = await deleteEpisodeAction("");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Key is required");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error message when use case throws", async () => {
      mockedDeleteExecute.mockRejectedValue(new Error("EPISODE_NOT_FOUND"));

      const result = await deleteEpisodeAction("episodes:abc");

      expect(result.success).toBe(false);
      expect(result.message).toBe("EPISODE_NOT_FOUND");
    });
  });

  describe("searchEpisodesAction", () => {
    it("should return episodes on success", async () => {
      const episodes = [
        { "@key": "episodes:abc", title: "Pilot", episodeNumber: 1 },
      ];
      mockedSearchExecute.mockResolvedValue(episodes);

      const result = await searchEpisodesAction();

      expect(result).toEqual(episodes);
    });

    it("should return empty array when use case throws", async () => {
      mockedSearchExecute.mockRejectedValue(new Error("API_ERROR"));

      const result = await searchEpisodesAction();

      expect(result).toEqual([]);
    });
  });
});
