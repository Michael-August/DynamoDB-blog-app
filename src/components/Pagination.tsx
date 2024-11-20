"use client";

import clsx from "clsx";
import Link from "next/link";
import { FC } from "react";
import Image from "next/image";

import nextBtn from "@/public/icons/next.png";
import previousBtn from "@/public/icons/previous.png";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = (props) => {
  const { page = 1, totalPages, onPageChange } = props;

  const pageRange = 3;

  const getPageNumbers = () => {
	const pageNumbers: (string | number)[] = [];
	const addPage = (page: string | number) => {
		if (!pageNumbers.includes(page)) {
		pageNumbers.push(page);
		}
	};

	for (let i = 1; i <= totalPages; i++) {
		if (
			i === 1 ||
			i === totalPages ||
			(i >= page - pageRange && i <= page + pageRange)
			) {
				addPage(i);
			} else if (
				(page - i === pageRange + 1 && i > 2) ||
				(i - page === pageRange + 1 && i < totalPages - 1)
			) {
			addPage("...");
		}
	}
	return pageNumbers;
	};

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center mt-5 lg:justify-end gap-2 text-black">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        className={clsx(
          "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50",
          page === 1 ? "pointer-events-none bg-gray-100" : ""
        )}
        disabled={page === 1}
      >
        <Image src={previousBtn} alt="Previous" />
      </button>

      {/* Page Numbers */}
      <nav
        aria-label="Pagination"
        className="relative z-0 -space-x-px rounded-md flex items-center gap-2"
      >
        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="text-gray-500 px-3 py-2 text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(Number(p))}
              className={clsx(
                Number(p) === page
                  ? "pointer-events-none text-white bg-black relative inline-flex items-center border rounded-lg px-4 py-2 text-sm font-medium"
                  : "relative inline-flex items-center transition-all border rounded-lg text-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-white"
              )}
            >
              {p}
            </button>
          )
        )}
      </nav>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        className={clsx(
          "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50",
          page === totalPages ? "pointer-events-none bg-gray-100" : ""
        )}
        disabled={page === totalPages}
      >
        <Image src={nextBtn} alt="Next" />
      </button>
    </div>
  );
};

export default Pagination;
