import React from 'react'
import { AiOutlineTwitter, AiFillFacebook, AiFillLinkedin } from 'react-icons/ai'
import { MdEmail } from 'react-icons/md'

const Footer = () => {
    return (
        <div className='bg-black w-full container mx-auto text-white flex flex-col gap-3 py-20 items-center justify-center'>
            <div className="font-semibold text-2xl">
                Ewere Diagboya 
            </div>
            <div className="font-semibold text-base mb-5">
                © {new Date().getFullYear()} Ewere Diagboya | All Right Reserved 
            </div>
            <div className="flex gap-5">
                <a className='border border-white rounded-full p-2' href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer">
                    <AiOutlineTwitter size={24} />
                </a>
                <a className='border border-white rounded-full p-2' href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
                    <AiFillFacebook size={24} />
                </a>
                <a className='border border-white rounded-full p-2' href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
                    <AiFillLinkedin size={24}  />
                </a>
                <a className='border border-white rounded-full p-2' href="mailto:your@email.com" target="_blank" rel="noopener noreferrer">
                    <MdEmail size={24} />
                </a>
            </div>
        </div>
    )
}

export default Footer