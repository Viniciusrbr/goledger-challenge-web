"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/watchlist-table/data-table";
import { useWatchlistModel } from "./watchlist.model";
import type { WatchlistProps } from "./watchlist.type";

export function WatchlistView({ watchlists, tvShows }: WatchlistProps) {
  const {
    showForm,
    isEditing,
    setShowForm,
    createForm,
    updateForm,
    onCreateSubmit,
    onUpdateSubmit,
    cancelForm,
    toggleShow,
    selectedShows,
    tvShowMap,
    columns,
  } = useWatchlistModel({ tvShows });

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
