"use client";

import BlogCard from "@/components/BlogCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import CardSkeletonLoader from "@/components/Skeletons/ArticleCardskeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);
  // const [previousKeys, setPreviousKeys] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string>("");
  const [pages, setPages] = useState<Record<number, any[]>>({}); // Store pages by page number
  const [lastKeys, setLastKeys] = useState<Record<number, string | null>>({}); // Store lastKeys per page
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const debounceDelay = 1000;

  /** Fetch articles */
  const fetchData = async (searchValue?: string, newLastKey?: string | null, newPage: number = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (newLastKey) queryParams.append("lastKey", newLastKey);
      if (searchValue) queryParams.append("search", searchValue);
      if (selectedTags) queryParams.append("tag", selectedTags);

      const response = await axios.get(`/apis/public?${queryParams.toString()}`);
      const newPosts = response.data?.posts || [];
      const nextLastKey = response.data?.lastKey || null;

      // Store lastKey for this page
      setLastKeys((prev) => ({ ...prev, [newPage]: nextLastKey }));

      // Store fetched articles in cache
      setPages((prev) => ({ ...prev, [newPage]: newPosts }));

      setArticles(newPosts);
      setLastKey(nextLastKey); // Update current lastKey
    } catch (error: any) {
      console.error(error);
      toast.error(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("page", currentPage.toString());
    if (selectedTags) params.set("tag", selectedTags);
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    router.refresh()
  }, [currentPage, selectedTags, debouncedSearchTerm]);

  // Load Next Page
  const loadNextPage = () => {
    if (!lastKey) return; // Stop if lastKey is not available
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    if (pages[nextPage]) {
      // If cached, use stored articles
      setArticles(pages[nextPage]);
    } else {
      // If not cached, fetch from API
      fetchData(debouncedSearchTerm, lastKey, nextPage);
    }

    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top smoothly
  };

  // Load Previous Page
  const loadPreviousPage = () => {
    if (currentPage === 1) return; // No previous page at first page
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);

    if (pages[prevPage]) {
      setArticles(pages[prevPage]); // Use cached data
    }

    if (!lastKey) {
      setLastKey(lastKeys[currentPage - 1])
    }

    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top smoothly
  };

  /** Handle search with debounce */
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, debounceDelay]);

  useEffect(() => {
    fetchData(debouncedSearchTerm, null, 1);
  }, [debouncedSearchTerm, selectedTags]);

  /** Get page number and tag from URL on initial load */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tagFromUrl = urlParams.get("tag");
    const pageFromUrl = urlParams.get("page");

    const params = new URLSearchParams(searchParams.toString());

    // Force page to be 1 on refresh
    if (pageFromUrl !== "1") {
      params.set("page", "1");
      setCurrentPage(1);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    setSelectedTags(tagFromUrl as string);
  }, []);

  return (
    <div>
      {/* Search Bar */}
      <motion.div className="flex items-center gap-4 px-3 py-2 rounded-xl mb-3 w-full border border-gray-400">
        <FaSearch />
        <input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="bg-transparent focus:outline-none focus:ring-0 w-full"
        />
      </motion.div>

      {/* Articles */}
      <motion.div className="articles px-4 py-5 mb-10">
        {loading ? <CardSkeletonLoader /> : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {articles.map((article: any) => <BlogCard blog={article} key={article.id} />)}
          </motion.div>
        )}
      </motion.div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4">
        <button 
          onClick={loadPreviousPage} 
          disabled={currentPage === 1} 
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Previous
        </button>
        <button 
          onClick={loadNextPage} 
          disabled={!lastKey} 
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
}
