"use client"

import rehypeRaw from "rehype-raw"
import DOMPurify from "dompurify";
import { motion } from 'framer-motion'
import React from 'react'

const BlogContent = ({content}: {content: any}) => {
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            ></motion.div>
        </div>
    )
}

export default BlogContent