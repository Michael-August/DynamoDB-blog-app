import React, { useState } from 'react'
import { AiOutlineTwitter, AiFillFacebook, AiFillLinkedin, AiOutlineMedium } from 'react-icons/ai'
import {motion} from "framer-motion"
import Link from 'next/link'
import { toast } from 'react-toastify'

const Footer = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!fullName) {
            toast.error("Please provide your full name")
            return;
        }

        if (!email) {
            toast.error("Please provide an active email")
            return;
        }

        try {
            const response = await fetch("/apis/newsletterSub", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Subscription successful!.");
                setFullName("");
                setEmail("");
            } else {
                toast.error(data.message || "Subscription failed.")
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className='bg-black w-full container mx-auto text-white flex flex-col gap-3 py-20 items-center justify-center'>
            <div className="">
                <h3 className="text-2xl font-semibold">Subscribe to our Newsletter</h3>
                <p className="text-gray-400 mt-2">Stay updated with the latest news and articles.</p>
                <form onSubmit={handleSubmit} className="mt-5 flex flex-wrap justify-center gap-4">
                    <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name" 
                        className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address" 
                        className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit" 
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
            <div className='flex flex-col gap-3 py-20 items-center justify-center'>

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

                <div className='text-white text-sm mt-5'>
                    <Link href="/terms">Terms of Service</Link> | <Link href="/privacy">Privacy Policy</Link>
                </div>
            </div>
        </motion.div>
    )
}

export default Footer