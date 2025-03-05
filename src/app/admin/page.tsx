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
import CharacterCard from "@/components/shared/CharacterCard";
import { useToggle } from "react-use";
import CharacterForm from "@/app/admin/components/CharacterForm";
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
  const [nameFilter, setNameFilter] = useState("");

  const [isOpen, toggle] = useToggle(false);

  const { data } = useQuery({
    queryKey: ["characters", pagination, nameFilter],
    queryFn: () =>
      fetchCharacters({
        pagination,
        name: nameFilter,
      }),
  });

  const [selectedCharacter, setSelectedCharacter] = useState({});

  const columns = useMemo<ColumnDef<Partial<Character>>[]>(
    () => [
      {
        accessorKey: "id",
      },
      {
        accessorKey: "Card",
        cell: (info) => (
          <>
            <CharacterCard
              containerClassName="relative h-32 w-32 md:flex-1/2 mx-auto md:mx-0"
              {...(info.row.original as Character)}
              id={info.row.original.id as string}
            />
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
          return <Pencil onClick={() => onOpenToEdit(character)} />;
        },
      },
    ],
    []
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

  return (
    <div className="max-w-6xl px-2 py-20 mx-auto">
      <div className="flex justify-end mb-10">
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
                          header.getContext()
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

      <div className="flex items-center justify-center gap-2 mt-10">
        <Button
          variant="outline" size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>

        <Button
          variant="outline" size="icon"
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

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onOpenChange={onClose}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form</DialogTitle>
          </DialogHeader>
          <div>
            <CharacterForm values={selectedCharacter} onFinish={onClose} />
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
