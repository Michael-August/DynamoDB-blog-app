"use client"

import moment from 'moment';
import authorImage from "@/public/images/author-image.jpg"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import blogImg from "@/public/images/blogBodyImg.jpg"
import { toast } from 'react-toastify';

const Page = ({params}: any) => {

    const [blog, setBlog] = useState<any>(null);
    const { title } = params;
    // const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/apis/articles/${title}`);
                if (!res.ok) {
                throw new Error(await res.text());
                }
                const data = await res.json();
                setBlog(data);
            } catch (err: any) {
                toast.error(`${err.message}`)
            }
        };

        fetchBlog();
    }, [title]);
    
    return (
        <div className="">
            {/* <div className="my-4">
                <span className="text-[#f2f4fb] bg-[#4b6bfb] rounded-[7px] px-2 py-1 text-center capitalize">{ blog?.category.toLowerCase() || 'General'}</span>
            </div> */}

            {/* title */}
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
                <p className="text-black">
                    { blog?.content }
                </p>
            </div>
        </div>
    )
}

export default Page