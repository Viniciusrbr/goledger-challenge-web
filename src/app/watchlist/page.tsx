import { searchTVShowsAction } from "@/app/actions/tv-show.actions";
import { searchWatchlistsAction } from "@/app/actions/watchlist.actions";
import { WatchlistView } from "./watchlist.view";

export default async function WatchlistPage() {
  const [watchlists, tvShows] = await Promise.all([
    searchWatchlistsAction(),
    searchTVShowsAction(),
  ]);
  return <WatchlistView watchlists={watchlists} tvShows={tvShows} />;
}
