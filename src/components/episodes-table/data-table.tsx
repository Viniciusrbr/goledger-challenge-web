"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Episode } from "@/core/domain/episodes/episode.entity";
import type { Season } from "@/core/domain/seasons/season.entity";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";

const ALL = "all";

// Custom filter: value can be a single key (string) or a set of keys (Set<string>)
const seasonKeyFilter: FilterFn<Episode> = (row, columnId, filterValue) => {
  const seasonKey = row.getValue<string>(columnId);
  if (filterValue instanceof Set) return filterValue.has(seasonKey);
  return seasonKey === filterValue;
};

interface DataTableProps {
  columns: ColumnDef<Episode>[];
  data: Episode[];
  seasons: Season[];
  tvShows: TVShow[];
}

export function DataTable({ columns, data, seasons, tvShows }: DataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filterTVShow, setFilterTVShow] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    filterFns: { seasonKey: seasonKeyFilter },
    state: { columnFilters },
    initialState: { pagination: { pageSize: 10 } },
    columnResizeMode: undefined,
  });

  const seasonMap = Object.fromEntries(
    seasons.map((s) => [s["@key"], `Season ${s.number} (${s.year})`]),
  );

  const seasonsForSelected = filterTVShow
    ? seasons.filter((s) => s.tvShow["@key"] === filterTVShow)
    : seasons;

  const currentSeasonFilter =
    (table.getColumn("seasonKey")?.getFilterValue() as
      | string
      | Set<string>
      | undefined) ?? "";
  const currentSeasonKey =
    currentSeasonFilter instanceof Set ? "" : (currentSeasonFilter as string);

  const handleTVShowChange = (value: string) => {
    const show = value === ALL ? "" : value;
    setFilterTVShow(show);
    if (show) {
      const keys = new Set(
        seasons.filter((s) => s.tvShow["@key"] === show).map((s) => s["@key"]),
      );
      table
        .getColumn("seasonKey")
        ?.setFilterValue(keys.size > 0 ? keys : undefined);
    } else {
      table.getColumn("seasonKey")?.setFilterValue(undefined);
    }
  };

  const handleSeasonChange = (value: string) => {
    if (value === ALL) {
      if (filterTVShow) {
        const keys = new Set(
          seasons
            .filter((s) => s.tvShow["@key"] === filterTVShow)
            .map((s) => s["@key"]),
        );
        table
          .getColumn("seasonKey")
          ?.setFilterValue(keys.size > 0 ? keys : undefined);
      } else {
        table.getColumn("seasonKey")?.setFilterValue(undefined);
      }
    } else {
      table.getColumn("seasonKey")?.setFilterValue(value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hierarchical filter: TV Show → Season */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            TV Show:
          </span>
          <Select
            value={filterTVShow || ALL}
            onValueChange={handleTVShowChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All TV Shows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All TV Shows</SelectItem>
              {tvShows.map((show) => (
                <SelectItem key={show["@key"]} value={show["@key"]}>
                  {show.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Season:
          </span>
          <Select
            value={currentSeasonKey || ALL}
            onValueChange={handleSeasonChange}
            disabled={seasonsForSelected.length === 0}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Seasons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Seasons</SelectItem>
              {seasonsForSelected.map((season) => (
                <SelectItem key={season["@key"]} value={season["@key"]}>
                  {seasonMap[season["@key"]]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No episodes yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} result
          {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
