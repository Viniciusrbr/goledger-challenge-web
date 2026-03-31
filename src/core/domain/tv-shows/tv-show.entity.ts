import type { BaseAsset } from "../shared.types";

export type TVShow = BaseAsset & {
  "@assetType": "tvShows";
  title: string;
  description: string;
  recommendedAge: number;
};

export type CreateTVShowInput = {
  title: string;
  description: string;
  recommendedAge: number;
};

export type UpdateTVShowInput = Partial<Omit<CreateTVShowInput, "title">>;
