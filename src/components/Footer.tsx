import React from 'react'
import { AiOutlineTwitter, AiFillFacebook, AiFillLinkedin, AiOutlineMedium } from 'react-icons/ai'
import {motion} from "framer-motion"

const Footer = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className='bg-black w-full container mx-auto text-white flex flex-col gap-3 py-20 items-center justify-center'>
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
        </motion.div>
    )
}

export default Footer