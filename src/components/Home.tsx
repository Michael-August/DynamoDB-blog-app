"use client"

import BlogCard from "@/components/BlogCard";
import { AiFillRead } from "react-icons/ai";
import Image from "next/image";

import { motion } from "framer-motion";

import banner from "@/public/images/main-image.jpg"
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import Pagination from "@/components/Pagination";
import { usePathname, useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import CardSkeletonLoader from "@/components/Skeletons/ArticleCardskeleton";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [lastKey, setLastKey] = useState(null);

  const [searchTerm, setSearchTerm] = useState("")

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [topTags, setTopTags] = useState<string[]>([]);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debounceDelay = 1000;

  const pathname = usePathname();

  const fetchData = async (searchValue?: string, queryParams?: any) => {
    setLoading(true);
    try {
      const response = await axios.get(`/apis/public?${queryParams?.toString()}&&search=${searchValue ? searchValue : ''}`);
      setArticles(response.data?.posts);
      setLastKey(response.data?.lastKey);
      setTotalPages(Math.ceil(response.data?.total / response.data?.limit))
    } catch (error: any) {
      toast.error(`${error.message}`)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (lastKey) {
      queryParams.append('lastKey', lastKey);
    }

    if (selectedTags.length > 0) {
      queryParams.append("tags", selectedTags.join(","));
    }

    fetchData(undefined, queryParams);
  }, [currentPage, selectedTags])

  const computedTags = useMemo(() => {
    const tagFrequency = articles
      .flatMap((article: any) => article.tags)
      .reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [articles]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, debounceDelay]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const search = async () => {
          fetchData(debouncedSearchTerm)
      };
      search();
    } else {
      fetchData()
    }
  }, [debouncedSearchTerm]);

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
    const tagsFromUrl = urlParams.get("tags")?.split(",") || [];
    setSelectedTags(tagsFromUrl);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [selectedTags, router]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div>
      {/* <div className="intro flex flex-col md:flex-row justify-between gap-5 mb-4 pt-5">
        <div> 
          <Image src={ banner } className="w-[inherit] h-[inherit]" alt={""} />
        </div>
        <div className="details text-center md:text-left leading-6 text-sm lg:text-base lg:leading-10">
          <span className="font-semibold text-gray-800 text-2xl lg:text-3xl">Ewere Diagboya </span>
          <span>
            started his career in tech in 2003. He started as a Software Developer in PHP, Visual Basic, HTML, and CSS. He later switched to DevOps and Cloud in 2015. He is the first AWS Community Hero in Africa and the author of two books: Infrastructure Monitoring with Amazon CloudWatch and Techtionary which are available on Amazon.com. He is an AWS Community leader in Nigeria. He loves to talk about Cloud Computing, DevOps, and innovations around efficient software delivery technologies and processes. He has also been a two-time judge for the Cybersafe Foundation Cybergirls Fellowship and PipeOps Hackathon.
          </span>
        </div>
      </div> */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className='flex items-center gap-4 px-3 py-2 rounded-xl mb-3 w-full border border-gray-400'>
        <FaSearch />
        <input placeholder='search articles...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" className='bg-transparent focus:outline-none focus:ring-0 w-full' />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap gap-2 my-10"
      >
        {topTags.map((tag) => (
          <div
            key={tag}
            className="relative"
            onMouseEnter={() => setHoveredTag(tag)}
            onMouseLeave={() => setHoveredTag(null)}
          >
            <motion.div
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 cursor-pointer text-sm rounded-md transition ${
                selectedTags.includes(tag)
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {tag}
            </motion.div>

            {hoveredTag === tag && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 w-52 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs bg-black text-white rounded-md"
              >
                Click to filter for articles with tag: {tag}
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="articles px-4 py-5 mb-10"
      >
        <div className="top flex items-center gap-4 text-black mb-10">
          {/* <AiFillRead className="font-semibold text-3xl text-slate-800" /> */}
          <span className="font-semibold text-base lg:text-3xl">Home for all DevOps, AWS and Cloud-native Content</span>
        </div>

        {loading ?
          <CardSkeletonLoader /> :
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
              {articles.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((article: any) => (
                  <BlogCard blog={article} key={article.id} />
              ))}
          </motion.div>
        }
      </motion.div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

