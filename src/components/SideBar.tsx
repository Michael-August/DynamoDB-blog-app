"use client"

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const SideBar = () => {

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/apis/public`);
                setArticles(response.data?.posts);
            } catch (error: any) {
                toast.error(`${error.message}`)
            }
        };

        fetchData();
    }, [])

    return (
        <div>
            {articles?.map((article: any) => (
                <Link key={article?.id} className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden" href={`/blog/${article?.slug}`}>
                    <img
                        src={article?.imageUrl}
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