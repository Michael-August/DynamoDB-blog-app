"use client"

import BlogCard from "@/components/BlogCard";
import { AiFillRead } from "react-icons/ai";
import Image from "next/image";

import banner from "@/public/images/main-image.jpg"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import Pagination from "@/components/Pagination";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [lastKey, setLastKey] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (lastKey) {
      queryParams.append('lastKey', lastKey);
    }
    const fetchData = async () => {
        try {
          const response = await axios.get(`/apis/public?${queryParams.toString()}`);
          setArticles(response.data?.posts);
          setLastKey(response.data?.lastKey);
          setTotalPages(Math.ceil(response.data?.total / response.data?.limit))
        } catch (error: any) {
          toast.error(`${error.message}`)
        } finally {
          setLoading(false);
        }
    };

    fetchData();
  }, [currentPage])
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
      <div className="articles px-4 py-5 mb-10">
        <div className="top flex items-center gap-4 text-black mb-10">
          {/* <AiFillRead className="font-semibold text-3xl text-slate-800" /> */}
          <span className="font-semibold text-3xl">Home for all DevOps, AWS and Cloud-native Content</span>
        </div>

        {loading ?
          <div className="mx-auto flex h-64 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
          </div> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
              {articles.map((article: any) => (
                  <BlogCard blog={article} key={article.id} />
              ))}
          </div>
        }
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

