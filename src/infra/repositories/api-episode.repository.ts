import type {
  CreateEpisodeInput,
  Episode,
  UpdateEpisodeInput,
} from "@/core/domain/episodes/episode.entity";
import type { EpisodeRepository } from "@/core/domain/episodes/episode.repository";
import type { SearchResult } from "@/core/domain/shared.types";
import { apiDelete, apiPost } from "@/lib/api-client";

const ASSET_TYPE = "episodes";

export class ApiEpisodeRepository implements EpisodeRepository {
  async search(): Promise<Episode[]> {
    const res = await apiPost<SearchResult<Episode>>("/api/query/search", {
      query: { selector: { "@assetType": ASSET_TYPE } },
    });
    return res.result ?? [];
  }

  async read(key: string): Promise<Episode> {
    return apiPost<Episode>("/api/query/readAsset", {
      key: { "@assetType": ASSET_TYPE, "@key": key },
    });
  }

  async create(data: CreateEpisodeInput): Promise<Episode[]> {
    return apiPost<Episode[]>("/api/invoke/createAsset", {
      asset: [{ "@assetType": ASSET_TYPE, ...data }],
    });
  }

  async update(key: string, data: UpdateEpisodeInput): Promise<Episode> {
    return apiPost<Episode>("/api/invoke/updateAsset", {
      update: { "@assetType": ASSET_TYPE, "@key": key, ...data },
    });
  }

  async delete(key: string): Promise<void> {
    await apiDelete("/api/invoke/deleteAsset", {
      key: { "@assetType": ASSET_TYPE, "@key": key },
    });
  }
}
