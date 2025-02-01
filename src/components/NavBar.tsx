"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {motion} from "framer-motion"
import Subscribe from './Subscribe'


const NavBar = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [subModalOpen, setSubModalOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const pathname = usePathname();
    const router = useRouter()
    
    return (
        <>
            <div className='relative'>
                <nav className='fixed bg-[#f7fbff] z-50 top-0 flex items-center w-full justify-between mx-auto px-2 md:px-4 container py-4'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="logo text-base lg:text-xl font-semibold">
                        <Link href={"/"}>Ewere Diagboya</Link>
                    </motion.div>
                    {/* <ul className='hidden lg:flex lg:items-center lg:gap-5'>
                        <li>
                            <Link href={"/"}>Home</Link>
                        </li>
                        <li>
                            <Link href={"/about"}>About</Link>
                        </li>
                        <li>
                            <Link href={"/blog"}>Blog</Link>
                        </li>
                        <li>
                            {pathname === "/admin/" ?
                                <Link href={"/admin/create"}>Create</Link> :
                                <Link href={"/blog"}>Contact</Link>
                            }
                        </li>
                    </ul> */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className='flex items-center gap-4'>
                        <Link href={"/about"} className='border-2 transition-all border-black px-4 py-2 hover:bg-black hover:text-white rounded-tl-2xl rounded-br-2xl cursor-pointer'>
                            About
                        </Link>
                        <span onClick={() => setSubModalOpen(!subModalOpen)} className='px-4 py-2 hover:bg-black transition-all hover:text-white rounded-tl-2xl rounded-br-2xl cursor-pointer'>
                            Subscribe
                        </span>
                        {(pathname === "/admin/" || pathname === "/admin/create/") && <div className='cursor-pointer hidden lg:block' onClick={() => { localStorage.removeItem("token"); router.push("/auth")}}>sign out</div>}
                    </motion.div>
                    {/* <div className="icon block lg:hidden cursor-pointer" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
                    </div> */}
                </nav>
                {/* {isMobileMenuOpen && (
                    <div className="for-mobile lg:hidden fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-4">
                        <Link href="/" onClick={toggleMobileMenu} className="text-sm font-medium">
                            Home
                        </Link>
                        <Link href="/about" onClick={toggleMobileMenu} className="text-sm font-medium">
                            About
                        </Link>
                        <Link href="/blog" onClick={toggleMobileMenu} className="text-sm font-medium">
                            Blog
                        </Link>
                        {pathname === "/admin/" ?
                            <Link onClick={toggleMobileMenu} href={"/admin/create"}>Create</Link> :
                            <Link onClick={toggleMobileMenu} href={"/blog"}>Contact</Link>
                        }
                        {pathname === "/admin/" && <div onClick={() => { localStorage.removeItem("token"); router.push("/auth")}}>sign out</div>}
                    </div>
                )} */}
            </div>
            {subModalOpen && <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-80 z-[60]">
                <div className="modal-card bg-white p-4 rounded-lg flex flex-col gap-4">
                    <div className='flex justify-end' onClick={() => setSubModalOpen(false)}>
                        <span className='text-red-700 cursor-pointer font-bold'>X</span>
                    </div>
                    <h3 className="text-2xl font-semibold">Subscribe to our Newsletter</h3>
                    <p className="text-gray-400 mt-2">Stay updated with the latest news and articles.</p>
                    <Subscribe setModal={setSubModalOpen} fromNavBar={true} />
                </div>
            </div>}
        </>
    )
}

export default NavBar