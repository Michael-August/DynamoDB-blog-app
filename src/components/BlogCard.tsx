"use client"

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { Card } from "./Card";
import Link from "next/link";

const BlogCard = ({ blog }: { blog: { id: string; title: string; imageUrl: string; content: string; slug: string; tags: string[], createdAt: any, imageFileName?: string } }) => {
    const router = useRouter()

    const handleViewDetails = () => {
        // if (!blog) return;
        router.push(`/blog/${blog?.slug}`)
    }

    const createdAt = moment(blog?.createdAt);
    const now = moment();
    const hoursDiff = now.diff(createdAt, 'hours');
    const displayDate = hoursDiff < 24 ? `${hoursDiff} hours ago` : createdAt.format("Do MMMM YYYY");

    return (
        <>
            <a key={blog?.id} className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden" href={`/blog/${blog?.slug}`}>
                <img
                    src={blog?.imageFileName ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${blog?.imageFileName}` : blog?.imageUrl}
                    alt={blog?.title}
                    className="w-full h-48 object-cover"
                />

                <div className="p-4">
                    <div className="date mb-4">
                        <span className="text-sm text-gray-500">{ displayDate }</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{blog?.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                    {blog?.tags.map((tag: string, index: number) => (
                        <span
                        key={index}
                        className="text-xs bg-gray-200 text-gray-700 py-1 px-2 rounded-full"
                        >
                        {tag}
                        </span>
                    ))}
                    </div>
                </div>
            </a>
        </>
    )
}

export default BlogCard;