"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import authorImage from "@/public/images/author-image.jpg"
import moment from 'moment';
import { FaEllipsisV, FaSearch } from 'react-icons/fa';
import { Loader2, X } from 'lucide-react';

import {motion} from "framer-motion"
interface Article {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
  imageUrl?: string;
  imageFileName?: string;
  status: "published" | "unpublished";
}
  
const AdminHomePage = () => {
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [openActions, setOpenActions] = useState<number | null>(null)

  const [openPublishModal, setOpenPublishModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const [articleToPublish, setArticleToPublish] = useState<Article | null>(null)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)

  const [sendEmail, setSendEmail] = useState(false)
  
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()

  const debounceDelay = 1000;
  
  const fetchData = async (searchValue?: string) => {
    setLoading(true)
    try {
      const response = await axios.get(`/apis/articles?search=${searchValue ? searchValue : ''}`);
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
      fetchData(undefined);
    }
  }, [router]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, debounceDelay]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const search = async () => {
        fetchData(debouncedSearchTerm)
      };
      search();
    } else {
      fetchData()
    }
  }, [debouncedSearchTerm]);

  const handleViewDetails = (id: string) => {
    // if (!blog) return;
    router.push(`/blog/${id}`)
  }

  const handleDelete = async (slug: string, articleId: string, createdAt: any) => {
    const deleteToastId = toast.info("Deleting...", { autoClose: false });
    setIsDeleting(true)
    try {

      await axios({method: "delete", url: `/apis/articles/${slug}`, data: {id: articleId, createdAt}});

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
    } finally {
      setIsDeleting(false)
      setArticleToDelete(null)
      setOpenDeleteModal(false)
    }
  };

  const handleStatusUpate = async (slug: string, status: "published" | "unpublished", articleId: string, createdAt: any) => {

    const updateToastId = toast.info("Updating...", { autoClose: false });
    if (status === "published") {
      setIsPublishing(true)
    } 
    try {

      await axios({method: "patch", url: `/apis/articles/${slug}`, data: {status, sendEmail, id: articleId, createdAt}});

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
    } finally {
      setIsPublishing(false)
      setSendEmail(false)
      setArticleToPublish(null)
      setOpenPublishModal(false)
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
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className='flex items-center gap-4 px-3 py-2 rounded-xl mb-3 w-full border border-gray-400'
      >
        <FaSearch />
        <input placeholder='search articles...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" className='bg-transparent focus:outline-none focus:ring-0 w-full' />
      </motion.div>
      {loading ?
        <div className="mx-auto flex h-64 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div> : 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4'
        >
        {articles.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((article: any, index:number) => (
          <div key={article.id} onClick={() => { if (openActions === index) setOpenActions(null) }} className="max-w-xs w-full group/card">
            <div
              style={{ backgroundImage: `url(${article?.imageFileName ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${article?.imageFileName}` : article?.imageUrl})`, backgroundSize: 'cover' }}
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
                      <span onClick={() => { setArticleToDelete(article); setOpenDeleteModal(true)}} className="transition-all hover:bg-red-800 hover:text-white text-red p-2 -mx-4 cursor-pointer">Delete Article</span>
                      <span onClick={() => handleEdit(article.slug)} className="transition-all hover:bg-yellow-600 hover:text-white text-black p-2 -mx-4 cursor-pointer">Edit Article</span>
                      {article.status === "published" ?
                        <span onClick={() => handleStatusUpate(article.slug, "unpublished", article.id, article?.createdAt)} className="transition-all hover:bg-green-600 hover:text-white text-black p-2 -mx-4 cursor-pointer">Unpublish Article</span>
                        :
                        <span onClick={() => { setArticleToPublish(article); setOpenPublishModal(true)}} className="transition-all hover:bg-green-600 hover:text-white text-black p-2 -mx-4 cursor-pointer">Publish Article</span>

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

      {openPublishModal &&
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{background: "rgba(0, 0, 0, 0.7)"}}
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
            <div className="flex items-end justify-end">
              <X onClick={() => { setOpenPublishModal(false); setArticleToPublish(null)}} className="cursor-pointer hover:scale-110 transition-all" />
            </div>
            <p className="text-base font-bold mb-4">{ articleToPublish?.title }</p>
            <label className="flex items-center gap-3 mb-4 cursor-pointer group">
              <input
                type="checkbox"
                name="sendEmail"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="peer hidden"
              />
              <div className="w-5 h-5 rounded-md border-2 border-gray-300 peer-checked:border-black peer-checked:bg-black flex items-center justify-center transition-colors duration-200">
                {sendEmail && (
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-black transition-colors duration-200">
                Do you want to send an email on publish of this article?
              </span>
            </label>
            <div className='flex items-center justify-between'>
              <button onClick={() => { setOpenPublishModal(false); setArticleToPublish(null)}} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              <button onClick={() => handleStatusUpate(articleToPublish?.slug as string, "published" ,articleToPublish?.id as string, articleToPublish?.createdAt)} className="px-4 py-2 bg-red-800 text-white rounded-md">
                {isPublishing ? <Loader2 className="h-8 w-8 animate-spin text-white" /> : "Publish"}
              </button>
            </div>
          </div>
        </motion.div>
      }

      {openDeleteModal &&
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{background: "rgba(0, 0, 0, 0.7)"}}
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
            <div className="flex items-end justify-end">
              <X onClick={() => { setOpenDeleteModal(false); setArticleToDelete(null)}} className="cursor-pointer hover:scale-110 transition-all" />
            </div>
            <p className="text-sm">Are you sure you want to delete this article;</p>
            <p className="text-base font-bold mb-4">{ articleToDelete?.title }</p>
            <div className='flex items-center justify-between'>
              <button onClick={() => { setOpenDeleteModal(false); setArticleToDelete(null)}} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              <button onClick={() => handleDelete(articleToDelete?.slug as string, articleToDelete?.id as string, articleToDelete?.createdAt)} className="px-4 py-2 bg-red-800 text-white rounded-md">
                {isDeleting ? <Loader2 className="h-8 w-8 animate-spin text-white" /> : "Delete"}
              </button>
            </div>
          </div>
        </motion.div>
      }
    </div>
    
  )
}

export default AdminHomePage