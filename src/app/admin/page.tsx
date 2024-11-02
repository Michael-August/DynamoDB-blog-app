"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import blogImage from "@/public/images/blogBodyImg.jpg"
import authorImage from "@/public/images/author-image.jpg"
import moment from 'moment';
import { FaEllipsisV } from 'react-icons/fa';

const Page = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openActions, setOpenActions] = useState<number | null>(null)

  const router = useRouter()
  
  const fetchData = async () => {
    try {
      const response = await axios.get('/apis/articles');
      setArticles(response.data?.posts);
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
    } else {
      fetchData();
    }
  }, [router]);

  const handleViewDetails = (id: string) => {
    // if (!blog) return;
    router.push(`/blog/${id}`)
  }

  const handleDelete = async (slug: string, articleId: string) => {
    const deleteToastId = toast.info("Deleting...", { autoClose: false });
    try {

      await axios({method: "delete", url: `/apis/articles/${slug}`, data: {id: articleId}});

      toast.dismiss(deleteToastId);

      toast.success("Deleted successfully!", {
        autoClose: 2000,
      });
      fetchData()
    } catch (error: any) {
      toast.dismiss(deleteToastId);
      toast.error("Error deleting resource: " + error.message, {
        autoClose: 2000,
      });
      console.error("Error deleting resource:", error.message);
    }
  };

  const handleEdit = (slug: string) => {
    localStorage.setItem("slug", slug)
    router.push("/admin/create")
  }

  const toggleActionsCard = (index: number) => {
    setOpenActions(openActions === index ? null : index)
  }

  return (
    <div>
      {loading ? <p>Loading...</p> : 
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4'>
        {articles.map((article: any, index:number) => (
          <div key={article.id} onClick={() => toggleActionsCard(index)} className="relative p-3 border border-[#e3e3e3] rounded-lg mb-10">
            <div className="menu absolute cursor-pointer top-2 right-2">
              <FaEllipsisV onClick={() => toggleActionsCard(index)} className='text-gray-600' />
            </div>
            {
              <div className="menu-options absolute top-0 right-0">
                {openActions === index && 
                <div className="bg-white flex flex-col gap-3 transition-all py-2 px-4 shadow-lg">
                    <span onClick={() => handleDelete(article.slug, article.id)} className="transition-all hover:bg-red-800 hover:text-white text-red p-2 -mx-4 cursor-pointer">Delete Article</span>
                    <span onClick={() => handleEdit(article.slug)} className="transition-all hover:bg-yellow-600 hover:text-white text-black p-2 -mx-4 cursor-pointer">Edit Article</span>
                </div>}
              </div>
            }
            <div className='w-fit -mx-3 -mt-3'>
                <Image className='w-[inherit] rounded-lg' src={article?.imageUrl || blogImage} width={300} height={200} alt="blog img" />
            </div>

            {/* category */}
            {/* <div className="my-4">
                <span className="text-[#4b6bfb] bg-[#f2f4fb] rounded-full px-2 py-1 text-center text-sm capitalize">{ blog?.category.toLowerCase() || 'General'}</span>
            </div> */}

            {/* title */}
            <div>
                <p className="text-xl font-semibold mt-5">{article?.title || "Test title here"}</p>
            </div>

            {/* author details */}
            <div className="flex flex-col gap-4 mt-6 mb-4">
              <div className="flex justify-start gap-2">
                  {/* author img */}
                  <div>
                      <Image src={authorImage} width={32} height={32} className="rounded-full w-[30px] h-[30px]" alt="author Image" />
                  </div>
                  <div>
                      <p>Ewere Diagboya</p>
                  </div>
              </div>

              <div>
                  {/* Date */}
                  <p>
                      { moment(article?.createdAt).format("Do MMMM YYYY")}
                  </p>
              </div>
              </div>
            </div>
        ))}
          </div>
      }
    </div>
    
  )
}

export default Page