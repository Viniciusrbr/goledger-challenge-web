import type { AssetRef, BaseAsset } from "../shared.types";

export type Watchlist = BaseAsset & {
  "@assetType": "watchlist";
  title: string;
  description?: string;
  tvShows?: AssetRef[];
};

export type CreateWatchlistInput = {
  title: string;
  description?: string;
  tvShows?: AssetRef[];
};

export type UpdateWatchlistInput = Partial<Omit<CreateWatchlistInput, "title">>;
