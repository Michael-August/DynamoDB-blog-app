"use client";

import BlogCard from "@/components/BlogCard";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import CardSkeletonLoader from "@/components/Skeletons/ArticleCardskeleton";
import Pagination from "@/components/Pagination";
import { usePathname, useRouter } from "next/navigation";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [previousKeys, setPreviousKeys] = useState<string[]>([]); // Stack to track previous pages
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [topTags, setTopTags] = useState<string[]>([]);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const debounceDelay = 1000;

  /** Fetch articles */
  const fetchData = async (searchValue?: string, newLastKey?: string | null, resetPagination: boolean = false) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (newLastKey) {
        queryParams.append("lastKey", newLastKey);
      }

      if (searchValue) {
        queryParams.append("search", searchValue);
      }

      if (selectedTags) {
        queryParams.append("tag", selectedTags);
      }

      const response = await axios.get(`/apis/public?${queryParams.toString()}`);
      const newPosts = response.data?.posts || [];
      const nextLastKey = response.data?.lastKey || null;

      if (resetPagination) {
        setArticles(newPosts);
        setPreviousKeys([]); // Reset history when search/tag changes
      } else {
        setArticles(newLastKey ? newPosts : [...articles, ...newPosts]);
      }

      setLastKey(nextLastKey);
    } catch (error: any) {
      console.error(error);
      toast.error(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const computedTags = useMemo(() => {
    const tagFrequency = articles
      .flatMap((article: any) => article.tags)
      .reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([tag]) => tag);
  }, [articles]);

  /** Handle pagination */
  const loadNextPage = () => {
    if (!lastKey) return;
    setPreviousKeys((prev) => [...prev, lastKey]); // Save the current key before moving forward
    fetchData(debouncedSearchTerm, lastKey);
  };

  const loadPreviousPage = () => {
    if (previousKeys.length === 0) return;
    const prevLastKey = previousKeys.pop(); // Remove the last key from history
    setPreviousKeys([...previousKeys]); // Update history
    fetchData(debouncedSearchTerm, prevLastKey || null);
  };

  /** Handle search with debounce */
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, debounceDelay]);

  useEffect(() => {
    fetchData(debouncedSearchTerm, null, true);
  }, [debouncedSearchTerm]);

  /** Handle tag changes */
  useEffect(() => {
    fetchData(undefined, null, true);
  }, [selectedTags]);

  useEffect(() => {
    // Default title for the home page
    if (pathname === '/') {
        document.title = "Home for all DevOps, AWS and Cloud-native Content";
    }
  }, [pathname]);

  useEffect(() => {
    if (topTags.length === 0 && articles.length > 0) {
      setTopTags(computedTags);
    }
  }, [computedTags, topTags, articles]);

  // Get tags from URL on initial render
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tagFromUrl = urlParams.get("tag");
    setSelectedTags(tagFromUrl as string);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTags) {
      params.set("tag", selectedTags);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [selectedTags, router]);

  // Toggle tag selection
  const selectTag = (tag: string) => {
    setSelectedTags(tag);
  };

  return (
    <div>
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 px-3 py-2 rounded-xl mb-3 w-full border border-gray-400">
        <FaSearch />
        <input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="bg-transparent focus:outline-none focus:ring-0 w-full"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap my-10 gap-4 border-b border-gray-300 pb-2"
      >
        {[...topTags, "events"].filter(tag => tag !== 'announcement').map((tag) => (
          <motion.a
            key={tag}
            // onClick={() => selectTag(tag)}
            onMouseEnter={() => setHoveredTag(tag)}
            onMouseLeave={() => setHoveredTag(null)}
            href={`/tag/${tag}`}
            className={`relative cursor-pointer text-sm font-medium transition-colors ${
              selectedTags === tag ? "text-black" : "text-gray-600 hover:text-black"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {tag}
            {(selectedTags === tag || hoveredTag === tag) && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 -bottom-2 h-[2px] w-full bg-black"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.a>
        ))}
      </motion.div>

      {/* Articles */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="articles px-4 py-5 mb-10">
        <div className="top flex items-center gap-4 text-black mb-10">
          <span className="font-semibold text-base lg:text-3xl">
            Home for all DevOps, AWS, and Cloud-native Content
          </span>
        </div>

        {loading ? (
          <CardSkeletonLoader />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {articles.map((article: any) => (
              <BlogCard blog={article} key={article.id} />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Pagination */}
      <Pagination
        onNext={loadNextPage}
        onPrevious={loadPreviousPage}
        canGoNext={!!lastKey}
        canGoPrevious={previousKeys.length > 0}
      />
    </div>
  );
}