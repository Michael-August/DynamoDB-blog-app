"use client"

import clsx from "clsx";
import Link from "next/link";
import { FC, useState } from "react";
import Image from "next/image";

import nextBtn from '@/public/icons/next.png'
import previousBtn from '@/public/icons/previous.png'

interface PaginationProps {
    page: string;
    totalPages: number
}
 
const Pagination: FC<PaginationProps> = (props) => {
    const { page = 1, totalPages } = props
    const [currentPage, setCurrentPage] = useState(Math.min(Math.max(Number(page), 1), totalPages));

    const pageRange = 3;

    const getPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - pageRange && i <= currentPage + pageRange)
            ) {
                pageNumbers.push(i);
            } else if (
                (currentPage - i === pageRange + 1 && i > 2) ||
                (i - currentPage === pageRange + 1 && i < totalPages - 1)
            ) {
                pageNumbers.push('...'); // Ellipses for gaps in pagination
            }
        }
        return pageNumbers;
    };

    const pages = getPageNumbers()
    
    return (
		<div className="flex items-center justify-end gap-2 text-black">
            <Link
                onClick={() => setCurrentPage(currentPage - 1)}
				className={clsx(
					'rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50',
					currentPage === 1 ? 'pointer-events-none bg-gray-100' : '',
				)}
				href={`?page=${currentPage - 1}`}
			>
				<Image src={previousBtn} alt="" />
			</Link>

			<nav
				aria-label="Pagination"
				className="relative z-0 -space-x-px rounded-md flex items-center gap-2"
			>
				{pages.map((p) => (
					<Link
                        key={p}
                        onClick={() => setCurrentPage(Number(p))}
						className={clsx(
							p === currentPage
								? 'pointer-events-none text-white bg-black relative inline-flex items-center border rounded-lg px-4 py-2 text-sm font-medium hover:bg-black hover:text-white'
								: 'relative inline-flex items-center transition-all border rounded-lg text-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-white'
						)}
						href={`?page=${p}`}
					>
						{p}
					</Link>
				))}
			</nav>

            <Link
                onClick={() => setCurrentPage(currentPage + 1)}
				className={clsx(
					'rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50',
					// !hasNextPage ? 'pointer-events-none bg-gray-100' : '',
				)}
				href={`?page=${currentPage + 1}`}
			>
				<Image src={nextBtn} alt="" />
			</Link>
		</div>
	);
}
 
export default Pagination;