"use client"

import BlogCard from "@/components/BlogCard";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import CardSkeletonLoader from "@/components/Skeletons/ArticleCardskeleton";
import { useParams } from "next/navigation";
import { capitalizeWords } from "../../utils/capitalizeWords";

export default function ArticlesByTag() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [topTags, setTopTags] = useState<string[]>([
        "aws",
        "whatis",
        "cloudcomputing",
        "kubernetes",
        "containers",
        "ai",
        "announcements",
        "serverless",
        "docker",
        "security",
        "devops",
        "observability",
        "storage",
        "monitoring",
        "events",
    ]);
    const [hoveredTag, setHoveredTag] = useState<string | null>(null);
    const router = useRouter();
    const { tag: currentTag } = useParams();
    const debounceDelay = 1000;

    const [lastKey, setLastKey] = useState<string | null>(null);
    const [previousKeys, setPreviousKeys] = useState<string[]>([]); // Stack to track previous pages

    const fetchData = async (tag: string, searchValue?: string, newLastKey?: string | null, resetPagination: boolean = false,) => {
        setLoading(true);
        try {

            const queryParams = new URLSearchParams();

            if (newLastKey) {
                queryParams.append("lastKey", newLastKey);
            }

            if (searchValue) {
                queryParams.append("search", searchValue);
            }

            if (tag) {
                queryParams.append("tag", tag as string);
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
            console.log(error);
            toast.error(`${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    /** Handle pagination */
    const loadNextPage = () => {
        if (!lastKey) return;
        setPreviousKeys((prev) => [...prev, lastKey]); // Save the current key before moving forward
        fetchData(currentTag as string, debouncedSearchTerm, lastKey);
    };

    const loadPreviousPage = () => {
        if (previousKeys.length === 0) return;
        const prevLastKey = previousKeys.pop(); // Remove the last key from history
        setPreviousKeys([...previousKeys]); // Update history
        fetchData(currentTag as string, debouncedSearchTerm, prevLastKey || null);
    };

    useEffect(() => {
        fetchData(currentTag as string, undefined, null, true);
    }, [currentTag]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, debounceDelay);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, debounceDelay]);

    useEffect(() => {
        fetchData(currentTag as string, debouncedSearchTerm, null, true);
    }, [debouncedSearchTerm]);

    return (
        <div>
        <motion.div className='flex items-center gap-4 px-3 py-2 rounded-xl mb-3 w-full border border-gray-400'>
            <FaSearch />
            <input placeholder='search articles...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" className='bg-transparent focus:outline-none focus:ring-0 w-full' />
        </motion.div>
        <motion.div className="flex flex-wrap my-10 gap-4 border-b border-gray-300 pb-2">
            {topTags.map((tag) => (
            <motion.a
                key={tag}
                href={`/tag/${tag}`}
                onMouseEnter={() => setHoveredTag(tag)}
                onMouseLeave={() => setHoveredTag(null)}
                className="relative cursor-pointer text-sm font-medium transition-colors text-gray-600 hover:text-black"
                whileTap={{ scale: 0.95 }}
            >
                {tag}
                {(currentTag === tag || hoveredTag === tag) && (
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
        <motion.div className="articles px-4 py-5 mb-10">
            <div className="top flex items-center gap-4 text-black mb-10">
            <span className="font-semibold text-base lg:text-3xl">{capitalizeWords(currentTag as string)}</span>
            </div>
            {loading ?
            <CardSkeletonLoader /> :
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                {articles.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((article: any) => (
                  <BlogCard blog={article} key={article.id} />
              ))}
            </motion.div>
            }
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
