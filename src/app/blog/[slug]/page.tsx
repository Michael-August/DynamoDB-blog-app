import moment from 'moment';
import authorImage from "@/public/images/author-image.jpg"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import blogImg from "@/public/images/blogBodyImg.jpg"
import { toast } from 'react-toastify';
import axios from 'axios';

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
import { BlogPostCard, SocialMediaSharing } from '@/components/Utils';
import BlogContent from '@/components/BlogContent';
import { Metadata } from 'next';
import SideBar from '@/components/SideBar';
import AdComponent from '@/components/AdsenseSlot';

export interface BlogPostCardProps {
  title: string;
  slug?: string;
  imageUrl: string;
  tags: string[];
}

interface BlogPageProps {
  params: { slug: string };
}

// Server-side data fetching
async function fetchBlog(slug: string): Promise<any | null> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/apis/articles/${slug}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-store', // Prevent caching
            },
        });
        if (!res.ok) return null;

        const { article } = await res.json();
        return article;
    } catch (err) {
        console.error('Error fetching blog:', err);
        return null;
    }
}

async function fetchSimilarArticles(blogId: string, tags: string[]): Promise<any[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    try {
        const res = await fetch(
            `${baseUrl}/apis/similar?blogId=${blogId}&tags=${tags.join(',')}`
        );
        const { posts, success } = await res.json();
        return success ? posts : [];
    } catch (err) {
        console.error('Error fetching similar articles:', err);
        return [];
    }
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Replace this with your actual base URL logic
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Fetch blog details
  const response = await fetch(`${baseUrl}/apis/articles/${params.slug}`);
  const blog = await response.json();

  if (!blog?.article) {
    return {
      title: 'Article Not Found',
      description: 'This article does not exist.',
    };
  }

  const { title, content, imageUrl, slug } = blog.article;

  return {
    title,
    description: content.slice(0, 150), // Truncate to avoid overly long descriptions
    openGraph: {
      title,
      description: content.slice(0, 150),
      url: `${baseUrl}/blog/${slug}`,
      images: [
        {
          url: imageUrl || `${baseUrl}/default-image.jpg`, // Default image fallback
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: content.slice(0, 150),
      images: [imageUrl || `${baseUrl}/default-image.jpg`],
    },
  };
}

export default async function Page({ params }: BlogPageProps) {
    
    const blog = await fetchBlog(params.slug);

    if (!blog) {
        notFound();
    }

    // const [blog, setBlog] = useState<any>(null);
    // const [loading, setLoading] = useState(true);

    // const [error, setError] = useState(false);

    // const [similarArticles, setSimilarArticles] = useState([]);

    const similarArticles = await fetchSimilarArticles(blog.id, blog.tags);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(`/apis/articles/${params.slug}`);
    //             if (!response.data?.article) {
    //                 setError(true)
    //             }
    //             setBlog(response.data?.article);
    //         } catch (error: any) {
    //             // toast.error(error.message)
    //             setError(true)
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [params.slug])

    // useEffect(() => {
    //     const fetchSimilarBlogs = async () => {
    //     const response = await fetch(
    //         `/apis/similar?blogId=${blog?.id}&tags=${blog?.tags}`
    //     );
    //     const data = await response.json();
    //     if (data.success) {
    //         setSimilarArticles(data.posts);
    //     }
    //     };

    //     if (blog) {
    //         fetchSimilarBlogs();
    //     }

    //     if (loading) {
    //         document.title = "Loading Article... - Ewere Diagboya";
    //     } else {
    //         document.title = `${blog?.title} - Ewere Diagboya`
    //     }
    // }, [blog, loading]);

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, []);

    // if (error) {
    //     return <NotFound />;
    // }
    
    return (
        <>
            {/* <AnimatePresence> */}
                <SEO description={blog?.content.slice(4, 80) + '...'} title={blog?.title} image={blog?.imageUrl} slug={blog?.slug} article={blog?.content.slice(0, 80)} />
                {/* {loading ? 
                    <BlogSkeletonLoader /> : */}
                    <div className='flex flex-col md:flex-row gap-5'>
                        
                        <div className="md:flex-[8]">
                            <div>
                                <p
                                    // initial={{ opacity: 0, x: -20 }}
                                    // animate={{ opacity: 1, x: 0 }}
                                    // exit={{ opacity: 0, x: 20 }}
                                    // transition={{ duration: 0.5 }}
                                    className="text-3xl font-semibold text-black mb-4">{blog?.title || "Test Title"}</p>
                                {
                                    (blog?.subTitle && blog.subTitle !== '') && (
                                        <p className="text-lg mb-4 italic text-black">{blog.title || "Test subtitle"}</p>
                                    )
                                }
                            </div>

                            <div className="socials">
                                <SocialMediaSharing slug={`${blog?.slug}`} title={blog?.title} />
                            </div>

                            {/* author details */}
                            <div
                                // initial={{ opacity: 0, x: 20 }}
                                // animate={{ opacity: 1, x: 0 }}
                                // exit={{ opacity: 0, x: -20 }}
                                // transition={{ duration: 0.5 }}
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
                            </div>

                            <div className='mt-6 mb-4'>
                                <ArticleTags tags={blog?.tags} />
                            </div>

                            {/* Blog Image */}
                            <div
                                // initial={{ opacity: 0 }}
                                // animate={{ opacity: 1 }}
                                // exit={{ opacity: 0 }}
                                // transition={{ duration: 0.5 }}
                                className="my-4 w-full h-[30rem] relative">
                                <Image
                                    src={blog?.imageUrl || blogImg}
                                    alt="blog img"
                                    className="rounded-3xl object-cover"
                                    fill
                                    quality={100} // Ensures better quality
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

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
                            
                            <BlogContent content={blog?.content} />
                            <div className="footer my-8">
                                <div className="profile-share flex flex-wrap items-center justify-between gap-4">
                                    <div className="profile flex flex-col gap-2">
                                        <div>
                                            <Image width={200} height={100} src={image2} className="rounded-full w-20" alt="author Image" />
                                        </div>
                                        <span className='font-semibold text-base md:text-xl'>Written by Ewere Diagboya</span>
                                        <span className='text-xs md:text-sm'>First AWS Hero in Africa, DevOps Engineer</span>
                                    </div>
                                    <div className="socials ">
                                        <SocialMediaSharing slug={`${blog?.slug}`} title={blog?.title} />
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
                        <div className='hidden md:flex-[2] md:flex md:flex-col md:gap-4'>
                            {/* <AdComponent adSlot={''} /> */}
                            <SideBar />
                        </div>
                    </div>
                {/* } */}
            {/* </AnimatePresence> */}
        </>
    )
}


// export default Page