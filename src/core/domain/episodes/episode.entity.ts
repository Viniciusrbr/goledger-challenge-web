import type { AssetRef, BaseAsset } from "../shared.types";

export type Episode = BaseAsset & {
  "@assetType": "episodes";
  episodeNumber: number;
  season: AssetRef;
  title: string;
  releaseDate: string;
  description: string;
  rating?: number;
};

export type CreateEpisodeInput = {
  episodeNumber: number;
  season: AssetRef;
  title: string;
  releaseDate: string;
  description: string;
  rating?: number;
};

export type UpdateEpisodeInput = Partial<
  Omit<CreateEpisodeInput, "episodeNumber" | "season">
>;
