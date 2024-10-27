"use client"

import React, { useState } from 'react'
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const Page = () => {
    const [imagePreview, setImagePreview] = useState<any>(null);

    const router = useRouter()

    const {
        register,
        handleSubmit,
        control,
        setValue,
    } = useForm();

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
        const base64String = reader.result;
            setImagePreview(base64String);
        };

        reader.readAsDataURL(file);
        setValue('image', e.target.files);
    }

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append('image', data.image[0]);
        formData.append('title', data.title);
        formData.append('content', data.content);

        try {
            const response = await axios.post('/apis/articles', formData);
            toast.success(`${response.data?.message}`)
            router.push("/blog")
        } catch (error: any) {
            toast.error(`${error?.message}`)
            console.error(error);
        }
    };
    
    return (
        <div className='form container mx-auto lg:px-24'>
            <div className="top flex flex-col gap-4 mt-8 lg:mt-10">
                <span className='text-base lg:text-xl font-semibold'>Just Write</span>
                {/* <span className='text-sm lg:text-base'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore laborum explicabo alias quidem cupiditate, molestiae sint vitae similique iure et tempora voluptas error id sunt doloribus eveniet. Unde nostrum at, numquam omnis suscipit laboriosam fugiat odio perferendis voluptatum. Consequuntur accusantium possimus quos eveniet, fugit natus blanditiis repudiandae magnam cum minima!</span> */}
            </div>
            <div className="form lg:px-28 mt-10 mb-10 lg:mb-14">
                <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group flex flex-col gap-4">
                        <label htmlFor="image-upload">Select Article Image</label>
                        <input type="file" name="image" id="image-upload"
                            onChange={(e) => handleImageUpload(e)}
                        />
                        {imagePreview && (
                            <Image width={192} height={192} src={imagePreview} alt="Image Preview" className="w-48 h-48 object-cover" />
                        )}
                    </div>
                    <div className="form-group flex flex-col gap-4">
                        <label>Title</label>
                        <input {...register("title", { required: "Title is required" })} className='border border-gray-600 bg-transparent p-2 rounded-lg focus:outline-none focus:ring-0' type="text" name='title' placeholder='Article Title' />
                    </div>
                    <div className="form-group flex flex-col gap-4">
                        <label>Content</label>
                        <Controller
                            name='content'
                            control={control}
                            render={({field}) => <SimpleMDE className='bg-transparent' {...field} />}
                        />
                        
                    </div>

                    <button className='w-full p-2 bg-black text-white rounded-lg transition-all hover:bg-black/50'>Create</button>
                </form>
            </div>
        </div>
    )
}

export default Page