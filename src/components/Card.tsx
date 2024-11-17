"use client";

import Image from "next/image";
import authorImage from "@/public/images/author-image.jpg"
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import DOMPurify from "dompurify";

export function Card({ title, imageUrl, date, content }: { title: string; imageUrl: string; date: any, content: string }) {
    console.log(imageUrl)
  return (
    <div className="max-w-xs w-full group/card">
        <div
            style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }}
            className={`
            cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4
            `}
        >
            <div className="absolute w-full h-full top-0 left-0 transition duration-300 bg-black opacity-80"></div>
            <div className="flex flex-row items-center space-x-4 z-10">
                <Image
                    height="100"
                    width="100"
                    alt="Avatar"
                    src={authorImage}
                    className="h-10 w-10 rounded-full border-2 object-cover"
                />
                <div className="flex flex-col">
                    <p className="font-normal text-base text-gray-50 relative z-10">
                    Ewere Diagboya
                    </p>
                    <p className="text-sm text-gray-400">{date}</p>
                </div>
            </div>
            <div className="text content">
                <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
                    {title}
                </h1>
                <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
                   <ReactMarkdown
                        components={{
                            a: ({ href, children }) => (
                                <a href={href} style={{ color: '#1e90ff', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
                                {children}
                                </a>
                            ),
                        }}
                        skipHtml={false}
                          rehypePlugins={[rehypeRaw]}
                    >
                          {DOMPurify.sanitize(content.slice(0, 80) + '...')}
                    </ReactMarkdown>
                </p>
            </div>
        </div>
    </div>
  );
}
