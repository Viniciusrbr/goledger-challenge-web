export type AssetType = "tvShows" | "seasons" | "episodes" | "watchlist";

/** Shape returned by POST /api/query/search */
export type SearchResult<T> = {
  result: T[];
};

export type AssetRef = {
  "@assetType": AssetType;
  "@key": string;
};

export type BaseAsset = {
  "@assetType": AssetType;
  "@key": string;
  "@lastTouchBy": string;
  "@lastTx": string;
  "@lastTxID": string;
  "@lastUpdated": string;
};
