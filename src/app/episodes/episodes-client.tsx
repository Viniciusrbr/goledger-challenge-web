"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  createEpisodeAction,
  deleteEpisodeAction,
  updateEpisodeAction,
} from "@/app/actions/episode.actions";
import { createColumns } from "@/components/episodes-table/columns";
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
import type { Episode } from "@/core/domain/episodes/episode.entity";
import type { Season } from "@/core/domain/seasons/season.entity";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";
import { fromRFC3339, toRFC3339 } from "@/lib/date";

const createSchema = z.object({
  episodeNumber: z.number().int().min(1, "Episode number must be at least 1"),
  seasonKey: z.string().min(1, "Season is required"),
  title: z.string().min(1, "Title is required"),
  releaseDate: z.string().min(1, "Release date is required"),
  description: z.string().min(1, "Description is required"),
  rating: z.number().min(0).max(10).optional(),
});

const updateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  releaseDate: z.string().min(1, "Release date is required"),
  description: z.string().min(1, "Description is required"),
  rating: z.number().min(0).max(10).optional(),
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;

type Props = {
  episodes: Episode[];
  seasons: Season[];
  tvShows: TVShow[];
};

export function EpisodesClient({ episodes, seasons, tvShows }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formTVShow, setFormTVShow] = useState("");

  const editingEpisode = useMemo(
    () => episodes.find((e) => e["@key"] === editingKey) ?? null,
    [episodes, editingKey],
  );

  const seasonMap = useMemo(
    () =>
      Object.fromEntries(
        seasons.map((s) => [s["@key"], `Season ${s.number} (${s.year})`]),
      ),
    [seasons],
  );

  const tvShowMap = useMemo(
    () => Object.fromEntries(tvShows.map((s) => [s["@key"], s.title])),
    [tvShows],
  );

  const seasonsForForm = useMemo(() => {
    if (!formTVShow) return seasons;
    return seasons.filter((s) => s.tvShow["@key"] === formTVShow);
  }, [seasons, formTVShow]);

  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      episodeNumber: 1,
      seasonKey: "",
      title: "",
      releaseDate: "",
      description: "",
      rating: undefined,
    },
  });

  const updateForm = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      title: "",
      releaseDate: "",
      description: "",
      rating: undefined,
    },
  });

  const onCreateSubmit = async (data: CreateFormData) => {
    const result = await createEpisodeAction({
      episodeNumber: data.episodeNumber,
      season: { "@assetType": "seasons", "@key": data.seasonKey },
      title: data.title,
      releaseDate: toRFC3339(data.releaseDate),
      description: data.description,
      rating: data.rating,
    });
    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      setFormTVShow("");
      createForm.reset();
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const onUpdateSubmit = async (data: UpdateFormData) => {
    if (!editingKey) return;
    const result = await updateEpisodeAction({
      key: editingKey,
      title: data.title,
      releaseDate: toRFC3339(data.releaseDate),
      description: data.description,
      rating: data.rating,
    });
    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      setEditingKey(null);
      updateForm.reset();
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (key: string) => {
    const result = await deleteEpisodeAction(key);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const startEdit = (episode: Episode) => {
    setEditingKey(episode["@key"]);
    updateForm.reset({
      title: episode.title,
      releaseDate: fromRFC3339(episode.releaseDate),
      description: episode.description,
      rating: episode.rating ?? undefined,
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingKey(null);
    setFormTVShow("");
    createForm.reset();
    updateForm.reset();
  };

  const columns = createColumns(seasonMap, startEdit, handleDelete);
  const isEditing = !!editingKey;

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
