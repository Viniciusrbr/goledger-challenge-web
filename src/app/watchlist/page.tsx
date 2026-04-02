import { searchTVShowsAction } from "@/app/actions/tv-show.actions";
import { searchWatchlistsAction } from "@/app/actions/watchlist.actions";
import { WatchlistClient } from "./watchlist-client";

export default async function WatchlistPage() {
  const [watchlists, tvShows] = await Promise.all([
    searchWatchlistsAction(),
    searchTVShowsAction(),
  ]);
  return <WatchlistClient watchlists={watchlists} tvShows={tvShows} />;
}
