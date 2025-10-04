"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { Character } from "@/interfaces";
import { useDebounce, useToggle } from "react-use";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CharacterCard } from "@/features/characters/components/character-card";
import { CharacterFormDialog } from "@/features/admin/character-form-dialog";

const fetchCharacters = async ({
  pagination,
  name = "",
}: {
  pagination: PaginationState;
  name?: string;
}) => {
  const { data } = await axios.get(`/api/characters`, {
    params: { page: pagination.pageIndex, name, limit: pagination.pageSize }, // Limitamos a 10 resultados por página
  });
  return data;
};

export default function Admin() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");

  const [val, setVal] = useState("");

  const [isOpen, toggle] = useToggle(false);

  const { data } = useQuery({
    queryKey: ["characters", pagination, search],
    queryFn: () =>
      fetchCharacters({
        pagination,
        name: search,
      }),
  });

  const [selectedCharacter, setSelectedCharacter] = useState<
    Partial<Character>
  >({});

  const columns = useMemo<ColumnDef<Partial<Character>>[]>(
    () => [
      {
        accessorKey: "id",
      },
      {
        accessorKey: "Card",
        cell: (info) => (
          <>
            <CharacterCard character={info.row.original as Character} />
          </>
        ),
      },
      {
        accessorKey: "name",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="text-gray-400">{info.row.original.title}</span>
            <span>{info.row.original.name}</span>
          </div>
        ),
      },
      {
        id: "actions",
        accessorKey: "Actions",
        cell: ({ row }) => {
          const character = row.original;
          return (
            <Pencil onClick={() => onOpenToEdit(character as Character)} />
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: data?.characters || [],
    pageCount: data?.totalPages || (0 as number),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    manualPagination: true,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  const onClose = () => {
    toggle();
    setSelectedCharacter({});
  };

  const onOpenToEdit = (character: Character) => {
    setSelectedCharacter(character);
    toggle();
  };

  const [, cancel] = useDebounce(
    () => {
      setSearch(val);
    },
    1000,
    [val],
  );

  return (
    <div className="max-w-6xl px-2 py-20 mx-auto h-screen bg-background">
      <div className="flex justify-between items-center mb-10">
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-72"
        />
        <Button onClick={toggle}>New</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center gap-2 mt-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>

        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
      </div>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form</DialogTitle>
          </DialogHeader>
          <div>
            <CharacterFormDialog
              values={selectedCharacter as Character}
              onFinish={onClose}
            />
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
