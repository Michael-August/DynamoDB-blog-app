"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface TagListProps {
  topTags: string[];
  currentTag?: string;
}

export default function TagList({ topTags, currentTag }: TagListProps) {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  return (
    <motion.div className="flex flex-wrap my-10 gap-4 border-b border-gray-300 pb-2">
      {topTags.map((tag) => (
        <motion.a
          key={tag}
          href={`/tag/${tag}`}
          onMouseEnter={() => setHoveredTag(tag)}
          onMouseLeave={() => setHoveredTag(null)}
          className="relative cursor-pointer text-sm font-medium transition-colors text-gray-600 hover:text-black"
          whileTap={{ scale: 0.95 }}
        >
          {tag}
          {(currentTag === tag || hoveredTag === tag) && (
            <motion.div
              layoutId="underline"
              className="absolute left-0 -bottom-2 h-[2px] w-full bg-black"
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.a>
      ))}
    </motion.div>
  );
}
