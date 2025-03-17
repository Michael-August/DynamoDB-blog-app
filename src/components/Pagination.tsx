// "use client";

// import clsx from "clsx";
// import Link from "next/link";
// import { FC } from "react";
// import Image from "next/image";

// import nextBtn from "@/public/icons/next.png";
// import previousBtn from "@/public/icons/previous.png";

// import {motion} from "framer-motion"

// interface PaginationProps {
//   page: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// const Pagination: FC<PaginationProps> = (props) => {
//   const { page = 1, totalPages, onPageChange } = props;

//   const pageRange = 3;

//   const getPageNumbers = () => {
//     const pageNumbers: (string | number)[] = [];
//     const addPage = (page: string | number) => {
//       if (!pageNumbers.includes(page)) {
//         pageNumbers.push(page);
//       }
//     };

//     const showPagesBefore = page - pageRange > 2; // Should we add an ellipsis before?
//     const showPagesAfter = page + pageRange < totalPages - 1; // Should we add an ellipsis after?

//     addPage(1); // Always show the first page

//     if (showPagesBefore) addPage("..."); // Add ellipsis if needed

//     for (let i = Math.max(2, page - pageRange); i <= Math.min(totalPages - 1, page + pageRange); i++) {
//       addPage(i);
//     }

//     if (showPagesAfter) addPage("..."); // Add ellipsis if needed

//     if (totalPages > 1) addPage(totalPages); // Always show the last page

//     return pageNumbers;
//   };


//   const pages = getPageNumbers();

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 20 }}
//       transition={{ duration: 0.5 }}
//       className="flex items-center justify-center mt-5 lg:justify-end gap-2 text-black">
//       {/* Previous Button */}
//       <button
//         onClick={() => onPageChange(Math.max(page - 1, 1))}
//         className={clsx(
//           "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50",
//           page === 1 ? "pointer-events-none bg-gray-100" : ""
//         )}
//         disabled={page === 1}
//       >
//         <Image src={previousBtn} alt="Previous" />
//       </button>

//       {/* Page Numbers */}
//       <nav
//         aria-label="Pagination"
//         className="relative z-0 -space-x-px rounded-md flex items-center gap-2"
//       >
//         {pages.map((p, idx) =>
//           p === "..." ? (
//             <span
//               key={`ellipsis-${idx}`}
//               className="text-gray-500 px-3 py-2 text-sm"
//             >
//               ...
//             </span>
//           ) : (
//             <button
//               key={p}
//               onClick={() => onPageChange(Number(p))}
//               className={clsx(
//                 Number(p) === page
//                   ? "pointer-events-none text-white bg-black relative inline-flex items-center border rounded-lg px-4 py-2 text-sm font-medium"
//                   : "relative inline-flex items-center transition-all border rounded-lg text-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-white"
//               )}
//             >
//               {p}
//             </button>
//           )
//         )}
//       </nav>

//       {/* Next Button */}
//       <button
//         onClick={() => onPageChange(Math.min(page + 1, totalPages))}
//         className={clsx(
//           "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50",
//           page === totalPages ? "pointer-events-none bg-gray-100" : ""
//         )}
//         disabled={page === totalPages}
//       >
//         <Image src={nextBtn} alt="Next" />
//       </button>
//     </motion.div>
//   );
// };

// export default Pagination;

"use client";

import clsx from "clsx";
import Image from "next/image";
import { FC } from "react";
import nextBtn from "@/public/icons/next.png";
import previousBtn from "@/public/icons/previous.png";
import { motion } from "framer-motion";

interface PaginationProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const Pagination: FC<PaginationProps> = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
  return (
    <motion.div className="flex items-center justify-center mt-5 lg:justify-end gap-2 text-black">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        className={clsx(
          "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50",
          !canGoPrevious && "pointer-events-none bg-gray-100"
        )}
        disabled={!canGoPrevious}
      >
        <Image src={previousBtn} alt="Previous" />
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className={clsx(
          "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50",
          !canGoNext && "pointer-events-none bg-gray-100"
        )}
        disabled={!canGoNext}
      >
        <Image src={nextBtn} alt="Next" />
      </button>
    </motion.div>
  );
};

export default Pagination;
