"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  createWatchlistAction,
  deleteWatchlistAction,
  updateWatchlistAction,
} from "@/app/actions/watchlist.actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createColumns } from "@/components/watchlist-table/columns";
import { DataTable } from "@/components/watchlist-table/data-table";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";
import type { Watchlist } from "@/core/domain/watchlist/watchlist.entity";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

const updateSchema = z.object({
  description: z.string().optional(),
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;

type Props = {
  watchlists: Watchlist[];
  tvShows: TVShow[];
};

export function WatchlistClient({ watchlists, tvShows }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [selectedShows, setSelectedShows] = useState<string[]>([]);

  const tvShowMap = useMemo(
    () => Object.fromEntries(tvShows.map((s) => [s["@key"], s.title])),
    [tvShows],
  );

  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { title: "", description: "" },
  });

  const updateForm = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: { description: "" },
  });

  const toggleShow = (key: string) => {
    setSelectedShows((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const onCreateSubmit = async (data: CreateFormData) => {
    const result = await createWatchlistAction({
      title: data.title,
      description: data.description || undefined,
      tvShows: selectedShows.map((key) => ({
        "@assetType": "tvShows" as const,
        "@key": key,
      })),
    });
    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      createForm.reset();
      setSelectedShows([]);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const onUpdateSubmit = async (data: UpdateFormData) => {
    if (!editingKey) return;
    const result = await updateWatchlistAction({
      key: editingKey,
      description: data.description || undefined,
      tvShows: selectedShows.map((key) => ({
        "@assetType": "tvShows" as const,
        "@key": key,
      })),
    });
    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      setEditingKey(null);
      updateForm.reset();
      setSelectedShows([]);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (key: string) => {
    const result = await deleteWatchlistAction(key);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const startEdit = (watchlist: Watchlist) => {
    setEditingKey(watchlist["@key"]);
    updateForm.reset({ description: watchlist.description ?? "" });
    setSelectedShows(watchlist.tvShows?.map((s) => s["@key"]) ?? []);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingKey(null);
    createForm.reset();
    updateForm.reset();
    setSelectedShows([]);
  };

  const columns = createColumns(startEdit, handleDelete);
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
          <h1 className="text-2xl font-semibold">Watchlists</h1>
          <p className="text-muted-foreground text-sm">
            Manage your TV show watchlists.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Add Watchlist</Button>
        )}
      </div>

      {showForm && !isEditing && (
        <form
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="border rounded-xl p-4 space-y-4 bg-card"
        >
          <h2 className="font-medium">New Watchlist</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                placeholder="My favorites"
                {...createForm.register("title")}
              />
              <FieldError errors={[createForm.formState.errors.title]} />
            </Field>
            <Field>
              <FieldLabel>Description (optional)</FieldLabel>
              <Input
                placeholder="Shows I want to watch this weekend"
                {...createForm.register("description")}
              />
              <FieldError errors={[createForm.formState.errors.description]} />
            </Field>
          </div>
          {tvShows.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">TV Shows (optional)</p>
              <div className="grid gap-2 sm:grid-cols-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {tvShows.map((show) => (
                  <label
                    key={show["@key"]}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedShows.includes(show["@key"])}
                      onChange={() => toggleShow(show["@key"])}
                      className="rounded"
                    />
                    {show.title}
                  </label>
                ))}
              </div>
            </div>
          )}
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
          <h2 className="font-medium">Edit Watchlist</h2>
          <Field>
            <FieldLabel>Description (optional)</FieldLabel>
            <Input
              placeholder="Shows I want to watch this weekend"
              {...updateForm.register("description")}
            />
            <FieldError errors={[updateForm.formState.errors.description]} />
          </Field>
          {tvShows.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">TV Shows</p>
              <div className="grid gap-2 sm:grid-cols-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {tvShows.map((show) => (
                  <label
                    key={show["@key"]}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedShows.includes(show["@key"])}
                      onChange={() => toggleShow(show["@key"])}
                      className="rounded"
                    />
                    {show.title}
                  </label>
                ))}
              </div>
            </div>
          )}
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

      <DataTable columns={columns} data={watchlists} tvShowMap={tvShowMap} />
    </main>
  );
}
