import Link from 'next/link'
import React from 'react'
import { AiOutlineMenu } from 'react-icons/ai'

const NavBar = () => {
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
                <div className="icon block lg:hidden cursor-pointer">
                    <AiOutlineMenu />
                </div>
            </nav>
            {/* <div className={`for-mobile lg:hidden absolute top-0 left-0 w-screen h-screen bg-white`}>

            </div> */}
        </div>
    )
}

export default NavBar