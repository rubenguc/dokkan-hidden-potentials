"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  totalPages,
  page,
}: {
  totalPages: number;
  page: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  const generatePageUrl = (newPage: number) => {
    params.set("page", newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  const isFirstPage = page === 1;
  const isLastPage = page >= totalPages;

  if (totalPages === 0) return null;

  return (
    <div className="flex justify-center mt-10 gap-2 items-center">
      <Button
        variant="outline"
        size="icon"
        disabled={isFirstPage}
        onClick={() => generatePageUrl(page - 1)}
        className="bg-[#818879] hover:bg-[#98a092]"
      >
        <ChevronLeft className="text-white" />
      </Button>

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
              className={`p-2 rounded bg-green-900 hover:bg-green-800`}
            >
              {pageNumber}
            </Button>
          );
        }

        if (pageNumber === 4 && totalPages > 6) {
          return (
            <span key="dots" className="p-2 text-white">
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
        onClick={() => generatePageUrl(page + 1)}
        className="bg-[#818879] hover:bg-[#98a092]"
      >
        <ChevronRight className="text-white" />
      </Button>
    </div>
  );
}
