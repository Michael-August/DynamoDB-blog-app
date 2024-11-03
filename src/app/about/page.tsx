import Image from "next/image"

import aboutImage from "@/public/images/image-2.jpg"

import React from 'react'

const Page = () => {
    return (
        <div>
            <div className="intro flex flex-col md:flex-row justify-between gap-5 mb-4 pt-5">
                <div> 
                    <Image src={ aboutImage } className="w-[inherit] h-[inherit]" alt={""} />
                </div>
                <div className="details text-center md:text-left leading-6 text-sm lg:text-base lg:leading-10">
                    <span className="font-semibold text-gray-800 text-2xl lg:text-3xl">Ewere Diagboya </span>
                    <span>
                        started his career in tech in 2003. He started as a Software Developer in PHP, Visual Basic, HTML, and CSS. He later switched to DevOps and Cloud in 2015. He is the first AWS Community Hero in Africa and the author of two books: Infrastructure Monitoring with Amazon CloudWatch and Techtionary which are available on Amazon.com. He is an AWS Community leader in Nigeria. He loves to talk about Cloud Computing, DevOps, and innovations around efficient software delivery technologies and processes. He has also been a two-time judge for the Cybersafe Foundation Cybergirls Fellowship and PipeOps Hackathon.
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Page