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
import { AiFillFacebook, AiOutlineLinkedin, AiOutlineTwitter } from 'react-icons/ai';

const Page = ({params}: { params: { slug: string } }) => {

    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
                    </div>
                </div>
            }
        </>
    )
}

const SocialMediaSharing = ({ url, title }: { url: string; title: string }) => {
  return (
        <div className="social-sharing flex flex-col gap-3">
            <h4>Share this post:</h4>
            <div className="social-buttons flex gap-1">
                <FacebookShareButton url={url} hashtag={'#ewereblog'}>
                    <FacebookIcon size={24} round />
                </FacebookShareButton>
                <TwitterShareButton url={url} title={title}>
                    <TwitterIcon size={24} round />
                </TwitterShareButton>
                <LinkedinShareButton url={url}>
                        <LinkedinIcon size={24} round />
                </LinkedinShareButton>
            </div>
        </div>
    );
};

export default Page