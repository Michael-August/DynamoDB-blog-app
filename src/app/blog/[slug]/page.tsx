"use client"

import moment from 'moment';
import authorImage from "@/public/images/author-image.jpg"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import blogImg from "@/public/images/blogBodyImg.jpg"
import { toast } from 'react-toastify';
import axios from 'axios';

import rehypeRaw from "rehype-raw"
import DOMPurify from "dompurify";

import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import ArticleTags from '@/components/ArticleTags';

import {AnimatePresence, motion} from "framer-motion"

import image2 from "@/public/images/image-2.jpg"
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import SEO from '@/components/Seo';
import { notFound } from 'next/navigation';
import BlogSkeletonLoader from '@/components/Skeletons/BlogContentSkeleton';
import NotFound from '@/app/not-found';

interface BlogPostCardProps {
  title: string;
  slug?: string;
  imageUrl: string;
  tags: string[];
}

const Page = ({params}: { params: { slug: string } }) => {

    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);

    const [similarArticles, setSimilarArticles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/apis/articles/${params.slug}`);
                if (!response.data?.article) {
                    setError(true)
                }
                setBlog(response.data?.article);
            } catch (error: any) {
                // toast.error(error.message)
                setError(true)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.slug])

    useEffect(() => {
        const fetchSimilarBlogs = async () => {
        const response = await fetch(
            `/apis/similar?blogId=${blog?.id}&tags=${blog?.tags}`
        );
        const data = await response.json();
        if (data.success) {
            setSimilarArticles(data.posts);
        }
        };

        if (blog) {
            fetchSimilarBlogs();
        }

        if (loading) {
            document.title = "Loading Article... - Ewere Diagboya";
        } else {
            document.title = `${blog?.title} - Ewere Diagboya`
        }
    }, [blog, loading]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (error) {
        return <NotFound />;
    }
    
    return (
        <AnimatePresence>
            <SEO description={blog?.content.slice(0, 80) + '...'} title={blog?.title} image={blog?.imageUrl} slug={blog?.slug} article={blog?.content.slice(0, 80)} />
            {loading ? 
                <BlogSkeletonLoader /> :
                <div className="">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl font-semibold text-black mb-4">{blog?.title || "Test Title"}</motion.p>
                        {
                            (blog?.subTitle && blog.subTitle !== '') && (
                                <p className="text-lg mb-4 italic text-black">{blog.title || "Test subtitle"}</p>
                            )
                        }
                    </div>

                    <div className="socials">
                        <SocialMediaSharing url={`${window.location.origin}/blog/${blog?.slug}`} title={blog?.title} />
                    </div>

                    {/* author details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-wrap justify-start gap-4 md:gap-8 lg:gap-8 mt-6 mb-4">
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
                    </motion.div>

                    <div className='mt-6 mb-4'>
                        <ArticleTags tags={blog?.tags} />
                    </div>

                    {/* Blog Image */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="my-4 w-full h-[30rem] relative">
                        <Image
                            src={blog?.imageUrl || blogImg}
                            alt="blog img"
                            className="rounded-3xl object-cover"
                            fill
                            quality={100} // Ensures better quality
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </motion.div>

                    {/* Content section */}
                    {/* <div className="my-8">
                        <ReactMarkdown
                            components={{
                                a: ({ href, children }) => (
                                    <a href={href} style={{ color: '#1e90ff', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
                                    {children}
                                    </a>
                                ),
                            }}
                            skipHtml={false}
                            rehypePlugins={[rehypeRaw]}>{DOMPurify.sanitize(blog?.content)}</ReactMarkdown>
                    </div> */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="ql-editor"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog?.content) }}
                    ></motion.div>

                    <div className="footer my-8">
                        <div className="profile-share flex flex-wrap items-center justify-between gap-4">
                            <div className="profile flex flex-col gap-2">
                                <div>
                                    <Image width={200} height={100} src={image2} className="rounded-full w-20" alt="author Image" />
                                </div>
                                <span className='font-semibold text-base md:text-xl'>Written by Ewere Diagboya</span>
                                <span className='text-xs md:text-sm'>First AWS Hero in Africa, DevOps Enginner</span>
                            </div>
                            <div className="socials ">
                                <SocialMediaSharing url={`${window.location.origin}/blog/${blog?.slug}`} title={blog?.title} />
                            </div>
                        </div>
                        <hr className='my-8' />
                        {
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                                {similarArticles?.map((article: any) => (
                                    <BlogPostCard key={article.id} title={article.title} imageUrl={article.imageUrl} tags={article.tags} slug={article.slug} />
                                ))}
                            </div>
                        }
                    </div>
                </div>
            }
        </AnimatePresence>
    )
}

const SocialMediaSharing = ({ url, title }: { url: string; title: string }) => {
  return (
        <div className="social-sharing flex flex-col gap-1">
            <h4>Share this post:</h4>
            <div className="social-buttons flex gap-1">
                <FacebookShareButton url={url} hashtag={'#ewereblog'}>
                    <FacebookIcon size={30} round />
                </FacebookShareButton>
                <TwitterShareButton url={url} title={title}>
                    <TwitterIcon size={30} round />
                </TwitterShareButton>
                <LinkedinShareButton url={url}>
                        <LinkedinIcon size={30} round />
                </LinkedinShareButton>
            </div>
        </div>
    );
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  title,
  slug,
  imageUrl,
  tags,
}) => {
  return (
    <Link className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden" href={`/blog/${slug}`}>
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
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
  );
};


export default Page
