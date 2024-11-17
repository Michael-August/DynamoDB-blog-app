"use client"

import React from "react";
import { useRouter } from "next/navigation";

const ArticleTags = ({ tags }: { tags: string[] }) => {
  const router = useRouter();

  const handleTagClick = (tag: string) => {
    router.push(`/blog/tags/${tag}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags?.map((tag, index) => (
        <span
          key={index}
          onClick={() => handleTagClick(tag)}
          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

export default ArticleTags
