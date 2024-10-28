"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'

const NavBar = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }
    
    return (
        <div className='relative '>
            <nav className='fixed bg-[#f7fbff] z-50 top-0 flex items-center w-full justify-between mx-auto px-2 md:px-4 container py-4'>
                <div className="logo text-base lg:text-xl font-semibold">
                    <Link href={"/"}>Ewere Diagboya</Link>
                </div>
                <ul className='hidden lg:flex lg:items-center lg:gap-5'>
                    <li>
                        <Link href={"/"}>Home</Link>
                    </li>
                    <li>
                        <Link href={"/blog"}>Blog</Link>
                    </li>
                    <li>
                        <Link href={"/blog"}>Contact</Link>
                    </li>
                    {/* <li>
                        <Link href={"/blog"}>Blog</Link>
                    </li> */}
                </ul>
                <div className='hidden lg:block border-2 border-black px-4 py-2 hover:bg-black hover:text-white rounded-tl-2xl rounded-br-2xl cursor-pointer'>
                    Eweres Blog
                </div>
                <div className="icon block lg:hidden cursor-pointer" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
                </div>
            </nav>
            {isMobileMenuOpen && (
                <div className="for-mobile lg:hidden fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-4">
                    <Link href="/" onClick={toggleMobileMenu} className="text-sm font-medium">
                        Home
                    </Link>
                    <Link href="/blog" onClick={toggleMobileMenu} className="text-sm font-medium">
                        Blog
                    </Link>
                    <Link href="/contact" onClick={toggleMobileMenu} className="text-sm font-medium">
                        Contact
                    </Link>
                </div>
            )}
        </div>
    )
}

export default NavBar