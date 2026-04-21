"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import { DataTable } from "@/components/seasons-table/data-table";
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
import { useSeasonsModel } from "./seasons.model";
import type { SeasonsProps } from "./seasons.type";

export function SeasonsView({ seasons, tvShows }: SeasonsProps) {
  const {
    showForm,
    isEditing,
    setShowForm,
    createForm,
    updateForm,
    onCreateSubmit,
    onUpdateSubmit,
    cancelForm,
    columns,
  } = useSeasonsModel({ tvShows });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 space-y-6">
      <div className="text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          ← Home
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Seasons</h1>
          <p className="text-muted-foreground text-sm">
            Manage seasons linked to each TV show.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Add Season</Button>
        )}
      </div>

      {showForm && !isEditing && (
        <form
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="border rounded-xl p-4 space-y-4 bg-card"
        >
          <h2 className="font-medium">New Season</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field>
              <FieldLabel>Season Number</FieldLabel>
              <Input
                type="number"
                min={1}
                placeholder="1"
                {...createForm.register("number", { valueAsNumber: true })}
              />
              <FieldError errors={[createForm.formState.errors.number]} />
            </Field>
            <Field>
              <FieldLabel>Year</FieldLabel>
              <Input
                type="number"
                min={1900}
                placeholder="2008"
                {...createForm.register("year", { valueAsNumber: true })}
              />
              <FieldError errors={[createForm.formState.errors.year]} />
            </Field>
            <Field>
              <FieldLabel>TV Show</FieldLabel>
              <Controller
                control={createForm.control}
                name="tvShowKey"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a TV Show" />
                    </SelectTrigger>
                    <SelectContent>
                      {tvShows.map((show) => (
                        <SelectItem key={show["@key"]} value={show["@key"]}>
                          {show.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[createForm.formState.errors.tvShowKey]} />
            </Field>
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
          <h2 className="font-medium">Edit Season</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field>
              <FieldLabel>Year</FieldLabel>
              <Input
                type="number"
                min={1900}
                placeholder="2008"
                {...updateForm.register("year", { valueAsNumber: true })}
              />
              <FieldError errors={[updateForm.formState.errors.year]} />
            </Field>
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

      <DataTable columns={columns} data={seasons} tvShows={tvShows} />
    </main>
  );
}
