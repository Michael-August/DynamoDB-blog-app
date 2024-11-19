"use client"

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { Card } from "./Card";
import Link from "next/link";

const BlogCard = ({ blog }: { blog: { id: string; title: string; imageUrl: string; content: string; slug: string; createdAt: any } }) => {
    const router = useRouter()

    const handleViewDetails = () => {
        // if (!blog) return;
        router.push(`/blog/${blog?.slug}`)
    }

    return (
        <>
            <Link href={`/blog/${blog?.slug}`}>
                <div onClick={handleViewDetails} className="">
                    <Card content={blog?.content} title={blog?.title} imageUrl={blog?.imageUrl} date={moment(blog?.createdAt).format("Do MMMM YYYY")} />
                </div>
            </Link>
        </>
    )
}

export default BlogCard;