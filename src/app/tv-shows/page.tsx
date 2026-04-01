import { searchTVShowsAction } from "@/app/actions/tv-show.actions";
import { TVShowsClient } from "./tv-shows-client";

export default async function TVShowsPage() {
  const tvShows = await searchTVShowsAction();
  return <TVShowsClient tvShows={tvShows} />;
}
