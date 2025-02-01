"use client"

import { BlogPostCardProps } from "@/app/blog/[slug]/page";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
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
          {tags.map((tag, index: number) => (
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

export const SocialMediaSharing = ({ slug, title }: { slug: string; title: string }) => {
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUrl(`${window.location.origin}/blog/${slug}`);
        }
    }, [slug]);

    if (!url) return null; // Render nothing until the URL is set
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
                <WhatsappShareButton url={url}>
                  <WhatsappIcon size={30} round />
                </WhatsappShareButton>
            </div>
        </div>
    );
};