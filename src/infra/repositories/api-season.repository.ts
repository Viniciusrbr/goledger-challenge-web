import type {
  CreateSeasonInput,
  Season,
  UpdateSeasonInput,
} from "@/core/domain/seasons/season.entity";
import type { SeasonRepository } from "@/core/domain/seasons/season.repository";
import type { SearchResult } from "@/core/domain/shared.types";
import { apiDelete, apiPost, apiPut } from "@/lib/api-client";

const ASSET_TYPE = "seasons";

export class ApiSeasonRepository implements SeasonRepository {
  async search(): Promise<Season[]> {
    const res = await apiPost<SearchResult<Season>>("/api/query/search", {
      query: { selector: { "@assetType": ASSET_TYPE } },
    });
    return res.result ?? [];
  }

  async read(key: string): Promise<Season> {
    return apiPost<Season>("/api/query/readAsset", {
      key: { "@assetType": ASSET_TYPE, "@key": key },
    });
  }

  async create(data: CreateSeasonInput): Promise<Season[]> {
    return apiPost<Season[]>("/api/invoke/createAsset", {
      asset: [{ "@assetType": ASSET_TYPE, ...data }],
    });
  }

  async update(key: string, data: UpdateSeasonInput): Promise<Season> {
    return apiPut<Season>("/api/invoke/updateAsset", {
      update: { "@assetType": ASSET_TYPE, "@key": key, ...data },
    });
  }

  async delete(key: string): Promise<void> {
    await apiDelete("/api/invoke/deleteAsset", {
      key: { "@assetType": ASSET_TYPE, "@key": key },
    });
  }
}
