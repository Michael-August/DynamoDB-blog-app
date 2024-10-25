import Link from 'next/link'
import React from 'react'

const NavBar = () => {
    return (
        <nav className='fixed bg-[#f7fbff] z-50 top-0 flex items-center w-full justify-between mx-auto px-2 md:px-4 container py-4'>
            <div className="logo text-xl font-semibold">
                <Link href={"/"}>Ewere Diagboya</Link>
            </div>
            <ul className='flex items-center gap-5'>
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
            <div className='border-2 border-black px-4 py-2 hover:bg-black hover:text-white rounded-tl-2xl rounded-br-2xl cursor-pointer'>
                Eweres Blog
            </div>
        </nav>
    )
}

export default NavBar