"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from "react-share";
import ArticleTags from "@/components/ArticleTags";
import BlogCard from "@/components/BlogCard";
import SEO from "@/components/Seo";
import SideBar from "@/components/SideBar";
import BlogSkeletonLoader from "@/components/Skeletons/BlogContentSkeleton";
import NotFound from "@/app/not-found";
import { BlogPostCard, SocialMediaSharing } from "@/components/Utils";
import BlogContent from "@/components/BlogContent";
import authorImage from "@/public/images/author-image.jpg";
import blogImg from "@/public/images/blogBodyImg.jpg";
import image2 from "@/public/images/image-2.jpg";
import { useParams } from "next/navigation";

export interface BlogPostCardProps {
  title: string;
  slug?: string;
  imageUrl: string;
  tags: string[];
}

interface BlogPageProps {
  params: { slug: string };
}

const Page: React.FC<BlogPageProps> = ({ params }) => {
    const [blog, setBlog] = useState<any>(null);
    const [similarArticles, setSimilarArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const {slug} = useParams();

    const fetchBlog = async (slug: string) => {
        try {
        const response = await axios.get(`/apis/articles/${slug}`);
        setBlog(response.data.article);
        } catch (err) {
        setError(true);
        } finally {
        setLoading(false);
        }
    };

    const fetchSimilarArticles = async (blogId: string, tags: string[]) => {
        try {
        const response = await axios.get(`/apis/similar?blogId=${blogId}&tags=${tags.join(",")}`);
        if (response.data.success) {
            setSimilarArticles(response.data.posts);
        }
        } catch (err) {
        console.error("Error fetching similar articles:", err);
        }
    };

    useEffect(() => {
        fetchBlog(slug as string);
    }, [slug]);

    useEffect(() => {
        if (blog) {
        fetchSimilarArticles(blog.id, blog.tags);
        }
    }, [blog]);

    if (loading) {
        return <BlogSkeletonLoader />;
    }

    if (error || !blog) {
        return <NotFound />;
    }

    return (
        <>
        <SEO
            description={blog?.content.slice(0, 80) + "..."}
            title={blog?.title}
            image={blog?.imageUrl}
            slug={blog?.slug}
            article={blog?.content.slice(0, 80)}
        />
        <div className="flex flex-col md:flex-row gap-5">
            <div className="md:flex-[8]">
            <div>
                <p className="text-3xl font-semibold text-black mb-4">{blog?.title || "Test Title"}</p>
                {blog?.subTitle && blog.subTitle !== "" && (
                <p className="text-lg mb-4 italic text-black">{blog.subTitle}</p>
                )}
            </div>

            <div className="socials">
                <SocialMediaSharing slug={blog?.slug} title={blog?.title} />
            </div>

            {/* Author details */}
            <div className="flex flex-wrap justify-start gap-4 md:gap-8 lg:gap-8 mt-6 mb-4">
                <div className="flex justify-start gap-2">
                <div>
                    <Image
                    width={200}
                    height={100}
                    src={authorImage}
                    className="rounded-full w-[30px] h-[30px]"
                    alt="author Image"
                    />
                </div>
                <div>
                    <p className="text-black">{"Ewere Diagboya"}</p>
                </div>
                </div>

                <div>
                <p className="text-black">{moment(blog?.createdAt).format("Do MMMM YYYY")}</p>
                </div>
            </div>

            <div className="mt-6 mb-4">
                <ArticleTags tags={blog?.tags} />
            </div>

            {/* Blog Image */}
            <div className="my-4 w-full h-[30rem] relative">
                <Image
                src={blog?.imageUrl || blogImg}
                alt="blog img"
                className="rounded-3xl object-cover"
                fill
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <BlogContent content={blog?.content} />
            <div className="footer my-8">
                <div className="profile-share flex flex-wrap items-center justify-between gap-4">
                <div className="profile flex flex-col gap-2">
                    <div>
                    <Image width={200} height={100} src={image2} className="rounded-full w-20" alt="author Image" />
                    </div>
                    <span className="font-semibold text-base md:text-xl">Written by Ewere Diagboya</span>
                    <span className="text-xs md:text-sm">First AWS Hero in Africa, DevOps Enginner</span>
                </div>
                <div className="socials">
                    <SocialMediaSharing slug={blog?.slug} title={blog?.title} />
                </div>
                </div>
                <hr className="my-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                {similarArticles?.map((article: any) => (
                    <BlogPostCard
                    key={article.id}
                    title={article.title}
                    imageUrl={article.imageUrl}
                    tags={article.tags}
                    slug={article.slug}
                    />
                ))}
                </div>
            </div>
            </div>
            <div className="hidden md:flex-[2] md:flex md:flex-col md:gap-4">
            <SideBar />
            </div>
        </div>
        </>
    );
};

export default Page;
