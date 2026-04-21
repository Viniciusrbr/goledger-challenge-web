import { searchSeasonsAction } from "@/app/actions/season.actions";
import { searchTVShowsAction } from "@/app/actions/tv-show.actions";
import { SeasonsView } from "./seasons.view";

export default async function SeasonsPage() {
  const [seasons, tvShows] = await Promise.all([
    searchSeasonsAction(),
    searchTVShowsAction(),
  ]);
  return <SeasonsView seasons={seasons} tvShows={tvShows} />;
}
