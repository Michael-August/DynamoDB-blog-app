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

import image2 from "@/public/images/image-2.jpg"
import BlogCard from '@/components/BlogCard';

const Page = ({params}: { params: { slug: string } }) => {

    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [similarArticles, setSimilarArticles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/apis/articles/${params.slug}`);
                setBlog(response.data?.article);
            } catch (error: any) {
                toast.error(error.message)
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
            setSimilarArticles(data.blogs);
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
    
    return (
        <>
            {loading ? 
                <div className="mx-auto flex h-64 w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div> :

                <div className="">
                    <div>
                        <p className="text-3xl font-semibold text-black mb-4">{blog?.title || "Test Title"}</p>
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
                    <div className="flex flex-wrap justify-start gap-4 md:gap-8 lg:gap-8 mt-6 mb-4">
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
                    <div className="my-4 w-full h-[30rem] relative">
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
                    <div
                        className="ql-editor"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog?.content) }}
                    ></div>

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
                                    <BlogCard blog={article} key={article.id} />
                                ))}
                            </div>
                        }
                    </div>
                </div>
            }
        </>
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

export default Page