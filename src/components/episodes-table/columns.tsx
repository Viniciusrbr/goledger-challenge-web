"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import type { Episode } from "@/core/domain/episodes/episode.entity";

export function createColumns(
  seasonMap: Record<string, string>,
  onEdit: (episode: Episode) => void,
  onDelete: (key: string) => void,
): ColumnDef<Episode>[] {
  return [
    {
      accessorKey: "episodeNumber",
      header: "#",
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {row.getValue("episodeNumber")}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      id: "seasonKey",
      accessorFn: (row) => row.season["@key"],
      header: "Season",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {seasonMap[row.original.season["@key"]] ??
            row.original.season["@key"]}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "releaseDate",
      header: "Release Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.getValue("releaseDate")}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue<number | undefined>("rating");
        return <span>{rating != null ? rating : "—"}</span>;
      },
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const episode = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => onEdit(episode)}>
              Edit
            </Button>
            <DeleteDialog
              title={`Delete "${episode.title}"?`}
              onConfirm={() => onDelete(episode["@key"])}
            >
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </DeleteDialog>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
