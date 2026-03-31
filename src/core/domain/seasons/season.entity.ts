import type { AssetRef, BaseAsset } from "../shared.types";

export type Season = BaseAsset & {
  "@assetType": "seasons";
  number: number;
  tvShow: AssetRef;
  year: number;
};

export type CreateSeasonInput = {
  number: number;
  tvShow: AssetRef;
  year: number;
};

export type UpdateSeasonInput = Partial<Pick<CreateSeasonInput, "year">>;
