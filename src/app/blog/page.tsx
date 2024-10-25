import BlogCard from '@/components/BlogCard'
import React from 'react'
import { AiFillRead } from 'react-icons/ai'

import Pagination from '@/components/Pagination'

const page = () => {
    return (
        <div>
            {/* <div className='w-full'>
                <Image className='w-[inherit]' width={500} height={300} src={banner} alt={'Banner image'} />
            </div> */}
            <div className="articles bg-white px-4 py-10 md:py-20 mb-10">
                <div className="top flex items-center gap-4 text-black mb-10">
                    <AiFillRead className="font-semibold text-3xl text-slate-800" />
                    <span className="font-semibold text-3xl">All Posts</span>
                </div>

                <div className="grid grid-cols-4 gap-2 md:gap-4">
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                </div>

                <Pagination page={`1`} totalPages={10} />
            </div>
        </div>
    )
}

export default page