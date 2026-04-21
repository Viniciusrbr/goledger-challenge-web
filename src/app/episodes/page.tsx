import { searchEpisodesAction } from "@/app/actions/episode.actions";
import { searchSeasonsAction } from "@/app/actions/season.actions";
import { searchTVShowsAction } from "@/app/actions/tv-show.actions";
import { EpisodesView } from "./episodes.view";

export default async function EpisodesPage() {
  const [episodes, seasons, tvShows] = await Promise.all([
    searchEpisodesAction(),
    searchSeasonsAction(),
    searchTVShowsAction(),
  ]);
  return (
    <EpisodesView episodes={episodes} seasons={seasons} tvShows={tvShows} />
  );
}
