import moment from 'moment';
import authorImage from "@/public/images/author-image.jpg"
import React from 'react'
import Image from 'next/image';

import dynamic from 'next/dynamic';

import blogImg from "@/public/images/blogBodyImg.jpg"
import ArticleTags from '@/components/ArticleTags';

import image2 from "@/public/images/image-2.jpg"
import SEO from '@/components/Seo';
import { notFound } from 'next/navigation';
import { BlogPostCard, SocialMediaSharing } from '@/components/Utils';
import { Metadata } from 'next';
import SideBar from '@/components/SideBar';
import AdComponent from '@/components/AdsenseSlot';

const BlogContent = dynamic(() => import('@/components/BlogContent'), { ssr: false });

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
        const res = await fetch(`${baseUrl}/apis/articles/${slug}?_=${Date.now()}`, {
            method: 'GET',
            cache: 'no-store',
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
            `${baseUrl}/apis/similar?blogId=${blogId}&tags=${tags.join(',')}`,
            { cache: 'no-store' }
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
    const response = await fetch(`${baseUrl}/apis/articles/${params.slug}?_=${Date.now()}`, {
        cache: 'no-store',
        headers: {cache: 'no-store'}
    });
  const blog = await response.json();

  if (!blog?.article) {
    return {
      title: 'Article Not Found',
      description: 'This article does not exist.',
    };
  }

  const { title, content, imageUrl, slug, tags, createdAt } = blog.article;

    return {
        title,
        description: content.slice(3, 150),
        keywords: tags || [],
        alternates: { canonical: `${baseUrl}/blog/${slug}` },
        robots: { index: true, follow: true },
        authors: [{ name: "Ewere Diagboya"  }],
        openGraph: {
            title,
            description: content.slice(3, 150),
            url: `${baseUrl}/blog/${slug}`,
            type: "article",
            publishedTime: moment(createdAt).format("HH:mm:ss"),
            images: [
                {
                    url: imageUrl || `${baseUrl}/default-image.jpg`, // Default image fallback
                    width: 1200,
                    height: 630,
                    alt: imageUrl,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: content.slice(3, 150),
            images: [imageUrl || `${baseUrl}/default-image.jpg`],
        },
    };
}

export default async function Page({ params }: BlogPageProps) {
    
    const blog = await fetchBlog(params.slug);

    if (!blog) {
        notFound();
    }

    const similarArticles = await fetchSimilarArticles(blog.id, blog.tags);
    
    return (
        <>
            {/* <SEO description={blog?.content.slice(4, 80) + '...'} title={blog?.title} image={blog?.imageUrl} slug={blog?.slug} article={blog?.content.slice(0, 80)} /> */}
            <div className='flex flex-col md:flex-row gap-5'>
                
                <div className="md:flex-[8]">
                    <div>
                        <p
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
                    <AdComponent adSlot={''} />
                    <SideBar />
                </div>
            </div>
        </>
    )
}
