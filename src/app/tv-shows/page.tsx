import { searchTVShowsAction } from "@/app/actions/tv-show.actions";
import { TVShowsView } from "./tv-shows.view";

export default async function TVShowsPage() {
  const tvShows = await searchTVShowsAction();
  return <TVShowsView tvShows={tvShows} />;
}
