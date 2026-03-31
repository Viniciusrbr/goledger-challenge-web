import type { SearchResult } from "@/core/domain/shared.types";
import type {
  CreateWatchlistInput,
  UpdateWatchlistInput,
  Watchlist,
} from "@/core/domain/watchlist/watchlist.entity";
import type { WatchlistRepository } from "@/core/domain/watchlist/watchlist.repository";
import { apiDelete, apiPost, apiPut } from "@/lib/api-client";

const ASSET_TYPE = "watchlist";

export class ApiWatchlistRepository implements WatchlistRepository {
  async search(): Promise<Watchlist[]> {
    const res = await apiPost<SearchResult<Watchlist>>("/api/query/search", {
      query: { selector: { "@assetType": ASSET_TYPE } },
    });
    return res.result ?? [];
  }

  async read(key: string): Promise<Watchlist> {
    return apiPost<Watchlist>("/api/query/readAsset", {
      key: { "@assetType": ASSET_TYPE, "@key": key },
    });
  }

  async create(data: CreateWatchlistInput): Promise<Watchlist[]> {
    return apiPost<Watchlist[]>("/api/invoke/createAsset", {
      asset: [{ "@assetType": ASSET_TYPE, ...data }],
    });
  }

  async update(key: string, data: UpdateWatchlistInput): Promise<Watchlist> {
    return apiPut<Watchlist>("/api/invoke/updateAsset", {
      update: { "@assetType": ASSET_TYPE, "@key": key, ...data },
    });
  }

  async delete(key: string): Promise<void> {
    await apiDelete("/api/invoke/deleteAsset", {
      key: { "@assetType": ASSET_TYPE, "@key": key },
    });
  }
}
