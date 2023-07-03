"use client";
import * as React from "react";
import {
  SortingState,
  VisibilityState,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import InvoiceForm from "./InvoiceForm";
import { Separator } from "./ui/separator";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    table.setPageSize(Number(6));
  }, []);

  return (
    <div>
      <div className="flex items-center flex-row justify-between py-4">
        <div className="flex flex-col ">
          <h1 className="text-xl">Invoices </h1>

          <p className="text-sm text-muted-foreground">
            There are {table.getFilteredRowModel().rows.length} invoices
          </p>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex space-x-2">
                Filter by status <ChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center">
              {["paid", "pending", "draft"].map((value) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={table.getColumn("status")?.id}
                    className="capitalize"
                    checked={
                      table.getColumn("status")?.getFilterValue() === value
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        table.getColumn("status")?.setFilterValue(value);
                      }

                      if (!checked) {
                        table.getColumn("status")?.setFilterValue(undefined);
                      }
                    }}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger>
              <Button>New Invoice</Button>
            </SheetTrigger>
            <SheetContent side={"left"} className=" overflow-scroll">
              <SheetHeader>
                <SheetTitle>New Invoice</SheetTitle>
                <Separator className="my-4" />
              </SheetHeader>
              <InvoiceForm />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          {/* <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader> */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <p>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
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
  );
}
