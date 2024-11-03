import React from 'react'
import { GrGallery } from 'react-icons/gr'

const Page = () => {
    return (
        <div>
            <div className="articles bg-white px-4 py-10 md:py-20 mb-10">
                <div className="top flex items-center gap-4 text-black mb-10">
                    <GrGallery className="font-semibold text-3xl text-slate-800" />
                    <span className="font-semibold text-3xl">Gallery</span>
                </div>
                
                
            </div>
        </div>
    )
}

export default Page