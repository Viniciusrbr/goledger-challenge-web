import type { z } from "zod";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";
import type { Watchlist } from "@/core/domain/watchlist/watchlist.entity";
import type { createWatchlistSchema, updateWatchlistSchema } from "./watchlist.schema";

export type CreateWatchlistFormData = z.infer<typeof createWatchlistSchema>;
export type UpdateWatchlistFormData = z.infer<typeof updateWatchlistSchema>;

export type WatchlistProps = {
  watchlists: Watchlist[];
  tvShows: TVShow[];
};
