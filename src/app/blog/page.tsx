"use client"

import BlogCard from '@/components/BlogCard'
import React, { useEffect, useState } from 'react'
import { AiFillRead } from 'react-icons/ai'

import Pagination from '@/components/Pagination'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'
import { FaSearch } from 'react-icons/fa'
import fetchData from '../../../utils/fetchData'

const Page = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("")

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const debounceDelay = 1000;

    const fetchData = async (searchValue?: string) => {
        try {
            const response = await axios.get(`/apis/public?search=${searchValue ? searchValue : ''}`);
            setArticles(response.data?.posts);
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
        }, debounceDelay);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, debounceDelay]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const search = async () => {
                console.log("search")
                fetchData(debouncedSearchTerm)
            };
            search();
        } else {
            fetchData()
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {

        fetchData();
    }, [])
    return (
        <div>
            <div className='flex items-center gap-4 px-3 py-2 rounded-xl mb-3 border border-gray-400'>
                <FaSearch />
                <input placeholder='search articles...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" className='bg-transparent focus:outline-none focus:ring-0 w-full' />
            </div>
            {/* <div className='w-full'>
                <Image className='w-[inherit]' width={500} height={300} src={banner} alt={'Banner image'} />
            </div> */}
            <div className="articles px-4 py-10 md:py-20 mb-10">
                <div className="top flex items-center gap-4 text-black mb-10">
                    <AiFillRead className="font-semibold text-3xl text-slate-800" />
                    <span className="font-semibold text-3xl">All Posts</span>
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

                <Pagination page={`1`} totalPages={10} />
            </div>
        </div>
    )
}

export default Page