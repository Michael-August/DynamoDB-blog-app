import Image from "next/image"

import aboutImage from "@/public/images/image-2.jpg"

import React from 'react'
import { AwardCards } from "@/components/AwardCards"
import { FaAward } from "react-icons/fa6"
import { FaBook } from "react-icons/fa"
import { GrGallery } from "react-icons/gr"

import image1 from "@/public/images/image-1.jpg"
import image2 from "@/public/images/image-2.jpg"

const Awards = [
    {
        title: "HACKERNOON CONTRIBUTOR OF THE YEAR- INTERNET",
        description: "The Internet is a mirror of the collective human psyche. And if we are anything, we are chaotic people. The internet, just like the...",
        link: "https://www.linkedin.com/in/ewere/details/honors/"
    },
    {
        title: "AWS Community Hero",
        description: "Recognized by Amazon Web Services for my speaking, blogging, and vlogging about AWS services as a community service in Lagos, Nigeria",
        link: "https://www.linkedin.com/in/ewere/details/honors/"
    },
    {
        title: "Nigerian Top Executives in the IT & Software Industry",
        description: "Ewere Diagboya Fellow is rated in the top 5 percent of all Nigerian executives based on the company size and international business network strength.",
        link: "https://www.linkedin.com/in/ewere/details/honors/"
    },
    {
        title: "Category Winner Samsung Apps Developer Contest",
        description: "Among the eighteen finalists in Nigeria, and first in the social network category with the application TextDeyGo (a mobile app for sending bulk SMS). The textdeygo Webservice was used to run the TextDeyGo mobile app which is a Java Mobile app.",
        link: "https://www.linkedin.com/in/ewere/details/honors/"
    },
    {
        title: "Best Server Monitoring Book of All Time",
        description: "Recognition for my book, Infrastructure Monitoring with Amazon CloudWatch",
        link: "https://www.linkedin.com/in/ewere/details/honors/"
    }
]

const Page = () => {
    return (
        <div>
            <div className="intro flex flex-col md:flex-row justify-between gap-5 mb-10 pt-5">
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

            <div className="mb-8">
                <div className="top flex items-center gap-4 text-black mb-5">
                    <FaAward className="font-semibold text-3xl text-slate-800" />
                    <span className="font-semibold text-3xl">Awards</span>
                </div>
                <AwardCards items={Awards} />
            </div>

            <div className="mb-8">
                <div className="top flex items-center gap-4 text-black mb-5">
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
                </div>
            </div>

            <div className="mb-8">
                <div className="top flex items-center gap-4 text-black mb-5">
                    <FaBook className="font-semibold text-3xl text-slate-800" />
                    <span className="font-semibold text-3xl">Books</span>
                </div>
            </div>
        </div>
    )
}

export default Page