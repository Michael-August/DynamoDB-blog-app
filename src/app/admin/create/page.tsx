"use client"

import React, { useEffect, useState } from 'react'
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import TagInput from '@/components/TagInput';

import "react-quill/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Page = () => {
    const [imagePreview, setImagePreview] = useState<any>(null);

    const router = useRouter()
    const [article, setArticle] = useState<any>(null);
    const [slug, setSlug] = useState('');

    const [loading, setLoading] = useState(false);

    const [tags, setTags] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        control,
        setValue,
    } = useForm();

    // React Quill modules for toolbar configuration
    const modules = {
        toolbar: [
            [{ size: [] }],
            [{ header: "1" }, { header: "2" }, { font: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"], // Removes formatting
        ],
    };

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "image",
        "video",
    ];

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
        setLoading(true)
        const formData = new FormData();

        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        } else if (article?.imageUrl) {
            formData.append('imageUrl', article.imageUrl);
            formData.append('id', article.id);
        }

        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('tags', JSON.stringify(tags));

        try {
            const endpoint = slug ? `/apis/articles/${slug}` : '/apis/articles';
            const method = slug ? 'put' : 'post';

            const response = await axios({ method, url: endpoint, data: formData });
            toast.success(`${response.data?.message}`)
            router.push("/admin")
            localStorage.removeItem("slug")
        } catch (error: any) {
            console.log(error)
            toast.error(`${error?.message}`)
        } finally {
            setLoading(false)
        }
    };

    const fetchData = async (slug: string) => {
        
        try {
            const response = await axios.get(`/apis/articles/${slug}`);
            const fetchedArticle = response.data?.article;
            setArticle(response.data?.article);

            setValue("title", fetchedArticle?.title);
            setValue("content", fetchedArticle?.content);
            setTags(fetchedArticle?.tags)
            setImagePreview(fetchedArticle?.imageUrl);
        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth');
        }
    }, [router]);

    useEffect(() => {
        const slugFromStorage = localStorage.getItem("slug") as string;
        setSlug(slugFromStorage)
        if (slugFromStorage) {

            fetchData(slug);
        }
    }, [slug])
    
    return (
        <div className='form container mx-auto lg:px-24'>
            <div className="top flex flex-col gap-4 mt-8 lg:mt-10">
                <span className='text-base lg:text-xl font-semibold'>Just Write</span>
                {/* <span className='text-sm lg:text-base'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore laborum explicabo alias quidem cupiditate, molestiae sint vitae similique iure et tempora voluptas error id sunt doloribus eveniet. Unde nostrum at, numquam omnis suscipit laboriosam fugiat odio perferendis voluptatum. Consequuntur accusantium possimus quos eveniet, fugit natus blanditiis repudiandae magnam cum minima!</span> */}
            </div>
            <div className="form mt-10 mb-10 lg:mb-14">
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
                    <div className='form-group flex flex-col gap-4'>
                        <label>Tags</label>
                        <TagInput tags={tags} setTags={setTags} />
                    </div>
                    <div className="form-group flex flex-col gap-4">
                        <label>Title</label>
                        <input {...register("title", { required: "Title is required" })} className='border border-gray-600 bg-transparent p-2 rounded-lg focus:outline-none focus:ring-0' type="text" name='title' placeholder='Article Title' />
                    </div>
                    <div className="form-group flex flex-col gap-4">
                        {/* <label>Content</label> */}
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <ReactQuill
                                    className="bg-white h-[80vh]"
                                    theme="snow"
                                    modules={modules}
                                    formats={formats}
                                    {...field}
                                    onChange={(value) => field.onChange(value)}
                                />
                            )}
                        />
                        
                    </div>

                    {
                        !slug ? <button className='w-full p-2 mt-14 bg-black text-white rounded-lg transition-all hover:bg-black/50'>Create Article</button>
                            : <button className='w-full p-2 mt-14 bg-black text-white rounded-lg transition-all hover:bg-black/50'>Edit Article</button>
                    }
                </form>
            </div>
        </div>
    )
}

export default Page