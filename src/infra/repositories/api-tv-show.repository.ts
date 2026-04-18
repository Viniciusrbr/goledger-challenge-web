import type { SearchResult } from "@/core/domain/shared.types";
import type {
  CreateTVShowInput,
  TVShow,
  UpdateTVShowInput,
} from "@/core/domain/tv-shows/tv-show.entity";
import type { TVShowRepository } from "@/core/domain/tv-shows/tv-show.repository";
import { apiDelete, apiPost } from "@/lib/api-client";

const ASSET_TYPE = "tvShows";

export class ApiTVShowRepository implements TVShowRepository {
  async search(): Promise<TVShow[]> {
    const res = await apiPost<SearchResult<TVShow>>("/api/query/search", {
      query: { selector: { "@assetType": ASSET_TYPE } },
    });
    return res.result ?? [];
  }

  async read(key: string): Promise<TVShow> {
    return apiPost<TVShow>("/api/query/readAsset", {
      key: { "@assetType": ASSET_TYPE, "@key": key },
    });
  }

  async create(data: CreateTVShowInput): Promise<TVShow[]> {
    return apiPost<TVShow[]>("/api/invoke/createAsset", {
      asset: [{ "@assetType": ASSET_TYPE, ...data }],
    });
  }

  async update(key: string, data: UpdateTVShowInput): Promise<TVShow> {
    return apiPost<TVShow>("/api/invoke/updateAsset", {
      update: { "@assetType": ASSET_TYPE, "@key": key, ...data },
    });
  }

  async delete(key: string): Promise<void> {
    await apiDelete("/api/invoke/deleteAsset", {
      key: { "@assetType": ASSET_TYPE, "@key": key },
    });
  }
}
