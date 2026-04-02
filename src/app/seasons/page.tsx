import { searchSeasonsAction } from "@/app/actions/season.actions";
import { searchTVShowsAction } from "@/app/actions/tv-show.actions";
import { SeasonsClient } from "./seasons-client";

export default async function SeasonsPage() {
  const [seasons, tvShows] = await Promise.all([
    searchSeasonsAction(),
    searchTVShowsAction(),
  ]);
  return <SeasonsClient seasons={seasons} tvShows={tvShows} />;
}
