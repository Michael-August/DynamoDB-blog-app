"use client"

import axios from 'axios';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const SideBar = () => {

    const [articles, setArticles] = useState([]);
    const [currentArticle, setCurrentArticle] = useState<any>(null);

    const pathname = usePathname();
    const currentSlug = pathname.split("/")[2];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/apis/public`);
                setArticles(response.data?.posts);

                const article = response.data?.posts.find((item: any) => item.slug === currentSlug);
                setCurrentArticle(article);
            } catch (error: any) {
                toast.error(`${error.message}`)
            }
        };

        fetchData();
    }, [])

    const filteredArticles = articles.filter((article: any) => {
        // Exclude the current article
        if (article.slug === currentSlug) {
        return false;
        }

        // Exclude articles with overlapping tags
        if (currentArticle && currentArticle?.tags) {
        return !article.tags?.some((tag: string) => currentArticle.tags.includes(tag));
        }

        return true;
    });

    return (
        <div>
            {filteredArticles.slice(0, 5)?.map((article: any) => (
                <Link key={article?.id} className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden" href={`/blog/${article?.slug}`}>
                    <img
                        src={article?.imageFileName ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${article?.imageFileName}` : article?.imageUrl}
                        alt={article?.title}
                        className="w-full h-48 object-cover"
                    />

                    <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900">{article?.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                        {article?.tags.map((tag: string, index: number) => (
                            <span
                            key={index}
                            className="text-xs bg-gray-200 text-gray-700 py-1 px-2 rounded"
                            >
                            #{tag}
                            </span>
                        ))}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default SideBar