import React from 'react'
import { AiOutlineTwitter, AiFillFacebook, AiFillLinkedin, AiOutlineMedium } from 'react-icons/ai'
import { MdEmail } from 'react-icons/md'

const Footer = () => {
    return (
        <div className='bg-black w-full container mx-auto text-white flex flex-col gap-3 py-20 items-center justify-center'>
            <div className="font-semibold text-2xl">
                Ewere Diagboya 
            </div>
            <div className="font-semibold text-base mb-5 text-center">
                © {new Date().getFullYear()} Ewere Diagboya | All Right Reserved 
            </div>
            <div className="flex gap-5">
                <a className='border border-white rounded-full p-2' href="https://x.com/nimboya" target="_blank" rel="noopener noreferrer">
                    <AiOutlineTwitter size={24} />
                </a>
                <a className='border border-white rounded-full p-2' href="https://medium.com/@nimboya" target="_blank" rel="noopener noreferrer">
                    <AiOutlineMedium size={24} />
                </a>
                <a className='border border-white rounded-full p-2' href="https://LinkedIn.com/in/ewere" target="_blank" rel="noopener noreferrer">
                    <AiFillLinkedin size={24}  />
                </a>
            </div>
        </div>
    )
}

export default Footer