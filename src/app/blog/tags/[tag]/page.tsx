"use client"

import BlogCard from "@/components/BlogCard";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiFillRead } from "react-icons/ai";
import { toast } from "react-toastify";

const TagPage = ({params}: { params: { tag: string } }) => {
    const [articles, setArticles] = useState([]);
    
    const [loading, setLoading] = useState(true);

    const decodedTag = params.tag ? decodeURIComponent(params.tag as string) : "";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/apis/tags?tag=${decodedTag}`);
                setArticles(response.data?.posts);
            } catch (error: any) {
                toast.error(`${error.message}`)
            } finally {
                setLoading(false);
            }
        };
      
        if (decodedTag) {
            fetchData()
        }
    }, [decodedTag]);

    return (
        <div className="mb-10">
            <div className="top flex items-center gap-4 text-black mb-10">
                <AiFillRead className="font-semibold text-3xl text-slate-800" />
                <span className="font-semibold text-3xl">Articles with tag { decodedTag }</span>
            </div>
            {loading ?
                <div className="mx-auto flex h-64 w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div> :
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                    {articles.map((article: any) => (
                        <BlogCard blog={article} key={article?.id} />
                    ))}
                </div>
            }
        </div>
    );
};

export default TagPage;
