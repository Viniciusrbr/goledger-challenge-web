"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import { DataTable } from "@/components/episodes-table/data-table";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEpisodesModel } from "./episodes.model";
import type { EpisodesProps } from "./episodes.type";

export function EpisodesView({ episodes, seasons, tvShows }: EpisodesProps) {
  const {
    showForm,
    isEditing,
    setShowForm,
    createForm,
    updateForm,
    onCreateSubmit,
    onUpdateSubmit,
    cancelForm,
    formTVShow,
    setFormTVShow,
    editingEpisode,
    seasonMap,
    tvShowMap,
    seasonsForForm,
    columns,
  } = useEpisodesModel({ episodes, seasons, tvShows });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 space-y-6">
      <div className="text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          ← Home
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Episodes</h1>
          <p className="text-muted-foreground text-sm">
            Manage episodes per season.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Add Episode</Button>
        )}
      </div>

      {showForm && !isEditing && (
        <form
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="border rounded-xl p-4 space-y-4 bg-card"
        >
          <h2 className="font-medium">New Episode</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel>Episode Number</FieldLabel>
              <Input
                type="number"
                min={1}
                placeholder="1"
                {...createForm.register("episodeNumber", {
                  valueAsNumber: true,
                })}
              />
              <FieldError
                errors={[createForm.formState.errors.episodeNumber]}
              />
            </Field>
            <Field>
              <FieldLabel>TV Show</FieldLabel>
              <Select
                value={formTVShow}
                onValueChange={(val) => {
                  setFormTVShow(val);
                  createForm.setValue("seasonKey", "");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a TV Show first" />
                </SelectTrigger>
                <SelectContent>
                  {tvShows.map((show) => (
                    <SelectItem key={show["@key"]} value={show["@key"]}>
                      {show.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Season</FieldLabel>
              <Controller
                control={createForm.control}
                name="seasonKey"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!formTVShow}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          formTVShow
                            ? "Select a Season"
                            : "Select a TV Show first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {seasonsForForm.map((season) => (
                        <SelectItem key={season["@key"]} value={season["@key"]}>
                          {seasonMap[season["@key"]]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[createForm.formState.errors.seasonKey]} />
            </Field>
            <div className="sm:col-span-2">
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input placeholder="Pilot" {...createForm.register("title")} />
                <FieldError errors={[createForm.formState.errors.title]} />
              </Field>
            </div>
            <Field>
              <FieldLabel>Release Date</FieldLabel>
              <Input type="date" {...createForm.register("releaseDate")} />
              <FieldError errors={[createForm.formState.errors.releaseDate]} />
            </Field>
            <Field>
              <FieldLabel>Rating (0–10, optional)</FieldLabel>
              <Input
                type="number"
                min={0}
                max={10}
                step={0.1}
                placeholder="9.5"
                {...createForm.register("rating", {
                  setValueAs: (v) =>
                    v === "" || v === undefined ? undefined : Number(v),
                })}
              />
              <FieldError errors={[createForm.formState.errors.rating]} />
            </Field>
            <div className="sm:col-span-2">
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Input
                  placeholder="A high school chemistry teacher..."
                  {...createForm.register("description")}
                />
                <FieldError
                  errors={[createForm.formState.errors.description]}
                />
              </Field>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={createForm.formState.isSubmitting}>
              {createForm.formState.isSubmitting ? "Saving..." : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={cancelForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {showForm && isEditing && (
        <form
          onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
          className="border rounded-xl p-4 space-y-4 bg-card"
        >
          <div className="space-y-0.5">
            <h2 className="font-medium">Edit Episode</h2>
            {editingEpisode &&
              (() => {
                const season = seasons.find(
                  (s) => s["@key"] === editingEpisode.season["@key"],
                );
                const showTitle = season
                  ? (tvShowMap[season.tvShow["@key"]] ?? season.tvShow["@key"])
                  : null;
                return (
                  <p className="text-sm text-muted-foreground">
                    {editingEpisode.episodeNumber}º episódio
                    {season
                      ? `, da Temporada ${season.number} (${season.year})`
                      : ""}
                    {showTitle ? ` de ${showTitle}` : ""}
                  </p>
                );
              })()}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input placeholder="Pilot" {...updateForm.register("title")} />
                <FieldError errors={[updateForm.formState.errors.title]} />
              </Field>
            </div>
            <Field>
              <FieldLabel>Release Date</FieldLabel>
              <Input type="date" {...updateForm.register("releaseDate")} />
              <FieldError errors={[updateForm.formState.errors.releaseDate]} />
            </Field>
            <Field>
              <FieldLabel>Rating (0–10, optional)</FieldLabel>
              <Input
                type="number"
                min={0}
                max={10}
                step={0.1}
                placeholder="9.5"
                {...updateForm.register("rating", {
                  setValueAs: (v) =>
                    v === "" || v === undefined ? undefined : Number(v),
                })}
              />
              <FieldError errors={[updateForm.formState.errors.rating]} />
            </Field>
            <div className="sm:col-span-2">
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Input
                  placeholder="A high school chemistry teacher..."
                  {...updateForm.register("description")}
                />
                <FieldError
                  errors={[updateForm.formState.errors.description]}
                />
              </Field>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={updateForm.formState.isSubmitting}>
              {updateForm.formState.isSubmitting ? "Saving..." : "Update"}
            </Button>
            <Button type="button" variant="outline" onClick={cancelForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <DataTable
        columns={columns}
        data={episodes}
        seasons={seasons}
        tvShows={tvShows}
        seasonMap={seasonMap}
      />
    </main>
  );
}
