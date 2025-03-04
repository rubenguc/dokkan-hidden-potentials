"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages, page }: {
  totalPages: number;
  page: number
}) {
  const searchParams = useSearchParams();
  const router = useRouter()
  const params = new URLSearchParams(searchParams.toString());

  const generatePageUrl = (newPage: number) => {
    params.set("page", newPage.toString());
    router.push(`/?${params.toString()}`);
  };


  const isFirstPage = page > 1;
  const isLastPage = page >= totalPages;

  if (totalPages === 0) return null

  return (
    <div className="flex justify-center mt-10 gap-2 items-center">
      <Button
        variant="outline"
        size="icon"
        disabled={isFirstPage}
        onClick={() => generatePageUrl(page - 1)}
      >
        <ChevronLeft />
      </Button>

      {/* Números de Página */}
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;

        if (
          pageNumber <= 3 ||
          pageNumber === totalPages ||
          Math.abs(pageNumber - page) <= 1
        ) {
          return (
            <Button
              size="icon"
              key={pageNumber}
              onClick={() => generatePageUrl(pageNumber)}
              className={`p-2 rounded ${Number(page) === pageNumber
                ? "bg-blue-500 text-white"
                : "bg-gray-500 hover:bg-gray-700 text-white"
                }`}
            >
              {pageNumber}
            </Button>
          );
        }

        if (pageNumber === 4 && totalPages > 6) {
          return (
            <span key="dots" className="p-2">
              ...
            </span>
          );
        }

        return null;
      })}

      <Button
        variant="outline"
        size="icon"
        disabled={isLastPage}
        onClick={() => generatePageUrl(page + -1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
