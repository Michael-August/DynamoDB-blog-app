"use client"

import BlogCard from '@/components/BlogCard'
import React, { useEffect, useState } from 'react'
import { AiFillRead } from 'react-icons/ai'

import Pagination from '@/components/Pagination'
import axios from 'axios'
import { toast } from 'react-toastify'

const page = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/apis/articles');
                setArticles(response.data?.posts);
            } catch (error: any) {
                toast.error(error.message)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [])
    return (
        <div>
            {/* <div className='w-full'>
                <Image className='w-[inherit]' width={500} height={300} src={banner} alt={'Banner image'} />
            </div> */}
            <div className="articles bg-white px-4 py-10 md:py-20 mb-10">
                <div className="top flex items-center gap-4 text-black mb-10">
                    <AiFillRead className="font-semibold text-3xl text-slate-800" />
                    <span className="font-semibold text-3xl">All Posts</span>
                </div>

                {loading ?
                    <p>Loading...</p> :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                        {articles.map((article: any) => (
                            <BlogCard blog={article} key={article.id} />
                        ))}
                    </div>
                }

                <Pagination page={`1`} totalPages={10} />
            </div>
        </div>
    )
}

export default page