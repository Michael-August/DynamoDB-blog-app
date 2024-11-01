"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const Page = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const res = await fetch('/apis/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const { token } = await res.json();
            localStorage.setItem('token', token);
            router.push('/admin');
        } else {
            toast.error('Invalid credentials');
        }
    };
    return (
        <form onSubmit={handleSubmit} className='w-screen md:w-[60%] flex flex-col gap-7 shadow-md bg-white p-5 rounded-lg'>
            <div className='flex flex-col gap-3'>
                <label>Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder='username' className='p-3 focus:outline-none focus:right-0 border border-gray-400 rounded-md' />
            </div>
            <div className='flex flex-col gap-3'>
                <label>Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='********' className='p-3 focus:outline-none focus:right-0 border border-gray-400 rounded-md' />
            </div>

            <button type='submit' className='w-full p-2 bg-black text-white rounded-lg transition-all hover:bg-black/50 mt-6'>Log in</button>
        </form>
    )
}

export default Page