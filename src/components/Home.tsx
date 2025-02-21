"use client"

import BlogCard from "@/components/BlogCard";
import { motion } from "framer-motion";

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
  const [selectedTags, setSelectedTags] = useState<string>("");

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
      console.log(error)
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

    if (selectedTags) {
      queryParams.append("tag", selectedTags);
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
      .slice(0, 15)
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

