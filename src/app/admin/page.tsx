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
import { Loader2 } from 'lucide-react';

import {motion} from "framer-motion"

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

  const handleStatusUpate = async (slug: string, status: "published" | "unpublished", articleId: string) => {

    const updateToastId = toast.info("Updating...", { autoClose: false });
    try {

      await axios({method: "patch", url: `/apis/articles/${slug}`, data: {status, id: articleId}});

      toast.dismiss(updateToastId);

      toast.success("Updated successfully!", {
        autoClose: 2000,
      });
      fetchData()
    } catch (error: any) {
      toast.dismiss(updateToastId);
      toast.error("Error updating resource: " + error.message, {
        autoClose: 2000,
      });
      console.error("Error updating resource:", error.message);
    }
  }

  const handleEdit = (slug: string) => {
    localStorage.setItem("slug", slug)
    router.push("/admin/create")
  }

  const toggleActionsCard = (index: number) => {
    setOpenActions(openActions === index ? null : index)
  }

  return (
    <div className='mb-5'>
      {loading ?
        <div className="mx-auto flex h-64 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div> : 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4'
        >
        {articles.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((article: any, index:number) => (
          <div key={article.id} onClick={() => { if (openActions === index) setOpenActions(null) }} className="max-w-xs w-full group/card">
            <div
              style={{ backgroundImage: `url(${article.imageUrl})`, backgroundSize: 'cover' }}
              className={`
                cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4
              `}
            >
              <div className="menu absolute cursor-pointer top-2 right-2 z-50">
                <FaEllipsisV onClick={() => toggleActionsCard(index)} className='text-white' />
              </div>
              {
                <div className="menu-options absolute top-0 right-0 z-50">
                  {openActions === index && 
                  <div className="bg-white flex flex-col gap-3 transition-all py-2 px-4 shadow-lg">
                      <span onClick={() => handleDelete(article.slug, article.id)} className="transition-all hover:bg-red-800 hover:text-white text-red p-2 -mx-4 cursor-pointer">Delete Article</span>
                      <span onClick={() => handleEdit(article.slug)} className="transition-all hover:bg-yellow-600 hover:text-white text-black p-2 -mx-4 cursor-pointer">Edit Article</span>
                      {article.status === "published" ?
                        <span onClick={() => handleStatusUpate(article.slug, "unpublished", article.id)} className="transition-all hover:bg-green-600 hover:text-white text-black p-2 -mx-4 cursor-pointer">Unpublish Article</span>
                        :
                        <span onClick={() => handleStatusUpate(article.slug, "published", article.id)} className="transition-all hover:bg-green-600 hover:text-white text-black p-2 -mx-4 cursor-pointer">Publish Article</span>

                      }
                  </div>}
                </div>
              }

              <div className="absolute w-full h-full top-0 left-0 transition duration-300 bg-black opacity-80"></div>
              <div className="flex flex-row items-center space-x-4 z-10">
                  <Image
                      height="100"
                      width="100"
                      alt="Avatar"
                      src={authorImage}
                      className="h-10 w-10 rounded-full border-2 object-cover"
                  />
                  <div className="flex flex-col">
                      <p className="font-normal text-base text-gray-50 relative z-10">
                      Ewere Diagboya
                      </p>
                      <p className="text-sm text-gray-400">{moment(article?.createdAt).format("Do MMMM YYYY")}</p>
                  </div>
              </div>
              <div className="text content">
                  <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
                      {article.title}
                  </h1>
                  <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
                      Card with Author avatar, complete name and time to read - most
                      suitable for blogs.
                  </p>
              </div>
              </div>
          </div>
        ))}
          </motion.div>
      }
    </div>
    
  )
}

export default Page