import { searchEpisodesAction } from "@/app/actions/episode.actions";
import { searchSeasonsAction } from "@/app/actions/season.actions";
import { searchTVShowsAction } from "@/app/actions/tv-show.actions";
import { EpisodesClient } from "./episodes-client";

export default async function EpisodesPage() {
  const [episodes, seasons, tvShows] = await Promise.all([
    searchEpisodesAction(),
    searchSeasonsAction(),
    searchTVShowsAction(),
  ]);
  return (
    <EpisodesClient episodes={episodes} seasons={seasons} tvShows={tvShows} />
  );
}
