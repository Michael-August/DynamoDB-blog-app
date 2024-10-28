"use client"

import moment from 'moment';
import authorImage from "@/public/images/author-image.jpg"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import blogImg from "@/public/images/blogBodyImg.jpg"
import { toast } from 'react-toastify';
import axios from 'axios';

import ReactMarkdown from 'react-markdown';

const Page = ({params}: { params: { articleId: string } }) => {

    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/apis/articles/${params.articleId}`);
                setBlog(response.data?.article);
            } catch (error: any) {
                toast.error(error.message)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.articleId])
    
    return (
        <>
            {loading ? 
                <p>Loading...</p> :

                <div className="">
                    <div>
                        <p className="text-3xl font-semibold text-black mb-4">{blog?.title || "Test Title"}</p>
                        {
                            (blog?.subTitle && blog.subTitle !== '') && (
                                <p className="text-lg mb-4 italic text-black">{blog.title || "Test subtitle"}</p>
                            )
                        }
                    </div>

                    {/* author details */}
                    <div className="flex justify-start gap-4 md:gap-8 lg:gap-8 mt-6 mb-4">
                        <div className="flex justify-start gap-2">
                            {/* author img */}
                            <div>
                                <Image width={200} height={100} src={authorImage} className="rounded-full w-[30px] h-[30px]" alt="author Image" />
                            </div>
                            <div>
                                <p className="text-black">{"Ewere Diagboya"}</p>
                            </div>
                        </div>

                        <div>
                            {/* Date */}
                            <p className="text-black">
                                { moment(blog?.createdAt).format("Do MMMM YYYY")}
                            </p>
                        </div>
                    </div>

                    {/* Blog Image */}
                    <div className='my-4 w-full h-[30rem]'>
                        <Image className='w-[inherit] h-[inherit] object-cover rounded-3xl' src={blog?.imageUrl || blogImg} width={100} height={100} alt="blog img" />
                    </div>

                    {/* Content section */}
                    <div className="my-8">
                        <ReactMarkdown>{blog?.content}</ReactMarkdown>
                    </div>
                </div>
            }
        </>
    )
}

export default Page