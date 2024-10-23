"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CreateNew from "./components/CreateNew";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { Character } from "@/interfaces";
import CharacterCard from "@/components/CharacterCard";
import { BsFillTrashFill } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useToggle } from "react-use";
import CharacterForm from "@/components/CharacterForm";

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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["characters", pagination, nameFilter],
    queryFn: () =>
      fetchCharacters({
        pagination,
        name: nameFilter,
      }),
  });

  const [selectedCharacter, setSelectedCharacter] = useState({})

  const columns = useMemo<ColumnDef<Partial<Character>>[]>(
    () => [
      {
        accessorKey: "id",
      },
      {
        accessorKey: "Icon",
        cell: (info) => (
          <>
            <CharacterCard
              containerClassName="relative h-20 w-20 mx-auto md:mx-0"
              {...(info.row.original as Character)}
            />
          </>
        ),
      },
      {
        accessorKey: "name",
      },
      {
        accessorKey: "title",
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
  }

  const onOpenToCreate = () => {
    toggle();
  }

  const onOpenToEdit = (character: Character) => {
    setSelectedCharacter(character);
    toggle()
  }

  return (
    <div className="max-w-6xl px-2 py-20 mx-auto">
      <Button
        onClick={toggle}
        className="rounded-md bg-black/20 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-black/30 data-[focus]:outline-1 data-[focus]:outline-white"
      >
        Open dialog
      </Button>
      <div className="overflow-hidden border rounded border-neutral-500">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className="px-6 py-3 text-start text-xs font-medium text-gray-200 uppercase d"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-200 uppercase d">
                  <div>Actions</div>
                </th>
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                  <td>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => onOpenToEdit(row.original)}>

                        <BsPencil />
                      </Button>
                      <BsFillTrashFill />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex items-center gap-2">
          <Button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            className="border rounded p-1"
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
      </div>


      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={onClose}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-white"
              >
                Create
              </DialogTitle>

              <CharacterForm values={selectedCharacter} />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
