"use client"

import { BlogPost } from '@/models/blog';
import { FC } from 'react';

import blogImage from "@/public/images/blogBodyImg.jpg"
import authorImage from "@/public/images/profileimg.jpg"
import Image from 'next/image';
import moment from 'moment';
import { useRouter } from 'next/navigation';

type Props = {
    blog?: BlogPost;
}

const BlogCard: FC<Props> = ({ blog }) => {
    const router = useRouter()

    const handleViewDetails = () => {
        // if (!blog) return;
        router.push(`/blog/${blog?.id}`)
    }

    return (
        <>
            <div onClick={handleViewDetails} className="p-3 border cursor-pointer border-[#e3e3e3] rounded-lg hover:scale-105 ease-in hover:shadow-md transition-all hover:border-[#c6d0fb] hover:shadow-[#c6d0fb]">
                <div className='w-fit -mx-3 -mt-3'>
                    <Image className='w-[inherit] rounded-lg' src={blogImage} width={300} height={200} alt="blog img" />
                </div>

                {/* category */}
                <div className="my-4">
                    <span className="text-[#4b6bfb] bg-[#f2f4fb] rounded-full px-2 py-1 text-center text-sm capitalize">{ blog?.category.toLowerCase() || 'General'}</span>
                </div>

                {/* title */}
                <div>
                    <p className="text-xl font-semibold">{blog?.title || "Test title here"}</p>
                </div>

                {/* author details */}
                <div className="flex justify-between gap-4 mt-6 mb-4">
                    <div className="flex justify-start gap-2">
                        {/* author img */}
                        <div>
                            <Image src={authorImage} width={32} height={32} className="rounded-full w-[30px] h-[30px]" alt="author Image" />
                        </div>
                        <div>
                            <p>{blog?.author}</p>
                        </div>
                    </div>

                    <div>
                        {/* Date */}
                        <p>
                            { moment(blog?.createdAt).format("Do MMMM YYYY")}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogCard;