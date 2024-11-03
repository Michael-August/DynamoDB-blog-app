import React from 'react'
import { GrGallery } from 'react-icons/gr'
import Image from 'next/image'

import image1 from "@/public/images/image-1.jpg"
import image2 from "@/public/images/image-2.jpg"

const Page = () => {
    return (
        <div>
            <div className="articles bg-white px-4 py-10 md:py-20 mb-10 w-full">
                <div className="top flex items-center gap-4 text-black mb-10">
                    <GrGallery className="font-semibold text-3xl text-slate-800" />
                    <span className="font-semibold text-3xl">Gallery</span>
                </div>
                <div className="grid grid-cols-auto-fit gap-1">
                    <div className="gallery-item">
                        <Image src={image1} width={0} height={0} alt={''} />
                    </div>
                    <div className="gallery-item">
                        <Image src={image2} width={0} height={0} alt={''} />
                    </div>
                    <div className="gallery-item">
                        <Image src={image2} width={0} height={0} alt={''} />
                    </div>
                    <div className="gallery-item">
                        <Image src={image2} width={0} height={0} alt={''} />
                    </div>
                    <div className="gallery-item">
                        <Image src={image2} width={0} height={0} alt={''} />
                    </div>
                    <div className="gallery-item">
                        <Image src={image2} width={0} height={0} alt={''} />
                    </div>
                    <div className="gallery-item">
                        <Image src={image2} width={0} height={0} alt={''} />
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Page