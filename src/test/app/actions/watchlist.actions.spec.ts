import { revalidatePath } from "next/cache";
import {
  createWatchlistAction,
  deleteWatchlistAction,
  searchWatchlistsAction,
  updateWatchlistAction,
} from "@/app/actions/watchlist.actions";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/infra/repositories/api-watchlist.repository", () => ({
  ApiWatchlistRepository: jest.fn(),
}));

const mockedCreateExecute = jest.fn();
const mockedUpdateExecute = jest.fn();
const mockedDeleteExecute = jest.fn();
const mockedSearchExecute = jest.fn();

jest.mock("@/core/application/watchlist/create-watchlist.use-case", () => ({
  CreateWatchlistUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedCreateExecute })),
}));

jest.mock("@/core/application/watchlist/update-watchlist.use-case", () => ({
  UpdateWatchlistUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedUpdateExecute })),
}));

jest.mock("@/core/application/watchlist/delete-watchlist.use-case", () => ({
  DeleteWatchlistUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedDeleteExecute })),
}));

jest.mock("@/core/application/watchlist/search-watchlists.use-case", () => ({
  SearchWatchlistsUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedSearchExecute })),
}));

describe("Server Actions: Watchlist", () => {
  beforeEach(() => {
    mockedCreateExecute.mockReset();
    mockedUpdateExecute.mockReset();
    mockedDeleteExecute.mockReset();
    mockedSearchExecute.mockReset();
    (revalidatePath as jest.Mock).mockReset();
  });

  describe("createWatchlistAction", () => {
    it("should create a watchlist successfully", async () => {
      mockedCreateExecute.mockResolvedValue(undefined);
      const data = { title: "My Watchlist" };

      const result = await createWatchlistAction(data);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Watchlist created!");
      expect(revalidatePath).toHaveBeenCalledWith("/watchlist");
    });

    it("should return invalid data error when title is missing", async () => {
      const data = { title: "" };

      const result = await createWatchlistAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid data");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should create a watchlist with optional tvShows", async () => {
      mockedCreateExecute.mockResolvedValue(undefined);
      const data = {
        title: "My Watchlist",
        description: "Weekend picks",
        tvShows: [{ "@assetType": "tvShows" as const, "@key": "tvShows:abc" }],
      };

      const result = await createWatchlistAction(data);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Watchlist created!");
    });

    it("should return error message when use case throws", async () => {
      mockedCreateExecute.mockRejectedValue(new Error("API_ERROR"));
      const data = { title: "My Watchlist" };

      const result = await createWatchlistAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("API_ERROR");
    });
  });

  describe("updateWatchlistAction", () => {
    it("should update a watchlist successfully", async () => {
      mockedUpdateExecute.mockResolvedValue(undefined);
      const data = { key: "watchlist:abc", description: "Updated description" };

      const result = await updateWatchlistAction(data);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Watchlist updated!");
      expect(revalidatePath).toHaveBeenCalledWith("/watchlist");
    });

    it("should return invalid data error when key is missing", async () => {
      const data = { key: "" };

      const result = await updateWatchlistAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid data");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error message when use case throws", async () => {
      mockedUpdateExecute.mockRejectedValue(new Error("WATCHLIST_NOT_FOUND"));
      const data = { key: "watchlist:abc" };

      const result = await updateWatchlistAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("WATCHLIST_NOT_FOUND");
    });
  });

  describe("deleteWatchlistAction", () => {
    it("should delete a watchlist successfully", async () => {
      mockedDeleteExecute.mockResolvedValue(undefined);

      const result = await deleteWatchlistAction("watchlist:abc");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Watchlist deleted!");
      expect(revalidatePath).toHaveBeenCalledWith("/watchlist");
    });

    it("should return error when key is empty", async () => {
      const result = await deleteWatchlistAction("");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Key is required");
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error message when use case throws", async () => {
      mockedDeleteExecute.mockRejectedValue(new Error("WATCHLIST_NOT_FOUND"));

      const result = await deleteWatchlistAction("watchlist:abc");

      expect(result.success).toBe(false);
      expect(result.message).toBe("WATCHLIST_NOT_FOUND");
    });
  });

  describe("searchWatchlistsAction", () => {
    it("should return watchlists on success", async () => {
      const watchlists = [{ "@key": "watchlist:abc", title: "My Watchlist" }];
      mockedSearchExecute.mockResolvedValue(watchlists);

      const result = await searchWatchlistsAction();

      expect(result).toEqual(watchlists);
    });

    it("should return empty array when use case throws", async () => {
      mockedSearchExecute.mockRejectedValue(new Error("API_ERROR"));

      const result = await searchWatchlistsAction();

      expect(result).toEqual([]);
    });
  });
});
