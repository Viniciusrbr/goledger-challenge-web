"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import type { Season } from "@/core/domain/seasons/season.entity";

export function createColumns(
  tvShowMap: Record<string, string>,
  onEdit: (season: Season) => void,
  onDelete: (key: string) => void,
): ColumnDef<Season>[] {
  return [
    {
      accessorKey: "number",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Season
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">Season {row.getValue("number")}</span>
      ),
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Year
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
    },
    {
      id: "tvShow",
      accessorFn: (row) => row.tvShow["@key"],
      header: "TV Show",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {tvShowMap[row.original.tvShow["@key"]] ??
            row.original.tvShow["@key"]}
        </span>
      ),
      filterFn: "equals",
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const season = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => onEdit(season)}>
              Edit
            </Button>
            <DeleteDialog
              title={`Delete Season ${season.number}?`}
              onConfirm={() => onDelete(season["@key"])}
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
