"use client"

import blogImage from "@/public/images/blogBodyImg.jpg"
import authorImage from "@/public/images/author-image.jpg"
import Image from 'next/image';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { Card } from "./Card";

const BlogCard = ({ blog }: { blog: { id: string; title: string; imageUrl: string; content: string; slug: string; createdAt: any } }) => {
    const router = useRouter()

    const handleViewDetails = () => {
        // if (!blog) return;
        router.push(`/blog/${blog?.slug}`)
    }

    return (
        <>
            <div onClick={handleViewDetails} className="">
                <Card title={blog?.title} imageUrl={blog?.imageUrl} date={moment(blog?.createdAt).format("Do MMMM YYYY")} />
            </div>
        </>
    )
}

export default BlogCard;