"use client"

import BlogCard from "@/components/BlogCard";
import { AiFillRead } from "react-icons/ai";
import Image from "next/image";

import banner from "@/public/images/main-image.jpg"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get('/apis/articles');
            setArticles(response.data?.posts.slice(0, 8).reverse());
        } catch (error: any) {
          toast.error(`${error.message}`)
        } finally {
          setLoading(false);
        }
    };

    fetchData();
  }, [])
  return (
    <div>
      <div className="intro flex flex-col md:flex-row justify-between gap-5 mb-4 pt-5">
        <div> 
          <Image src={ banner } className="w-[inherit] h-[inherit]" alt={""} />
        </div>
        <div className="details text-center md:text-left leading-6 text-sm lg:text-base lg:leading-10">
          <span className="font-semibold text-gray-800 text-2xl lg:text-3xl">Ewere Diagboya </span>
          <span>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima ut excepturi ex tenetur sequi, atque natus mollitia, repellendus, voluptatibus cum quod maxime iure consequuntur ipsum. Cupiditate earum dolore non ullam. Dolorum, laudantium quae sequi commodi aliquam nihil reiciendis quis doloribus eaque aperiam optio magni dolor nostrum esse ea atque fugiat.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima ut excepturi ex tenetur sequi, atque natus mollitia, repellendus, voluptatibus cum quod maxime iure consequuntur ipsum. Cupiditate earum dolore non ullam. Dolorum, laudantium quae sequi commodi aliquam nihil reiciendis quis doloribus eaque aperiam optio magni dolor nostrum esse ea atque fugiat.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima ut excepturi ex tenetur sequi, atque natus mollitia, repellendus, voluptatibus cum quod maxime iure consequuntur ipsum. Cupiditate earum dolore non ullam. Dolorum, laudantium quae sequi commodi aliquam nihil reiciendis quis doloribus eaque aperiam optio magni dolor nostrum esse ea atque fugiat.
          </span>
        </div>
      </div>
      <div className="articles bg-white px-4 py-10 md:py-20 mb-10">
        <div className="top flex items-center gap-4 text-black mb-10">
          <AiFillRead className="font-semibold text-3xl text-slate-800" />
          <span className="font-semibold text-3xl">Latest Posts</span>
        </div>

        {loading ?
          <p>Loading...</p> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
              {articles.map((article: any) => (
                  <BlogCard blog={article} key={article.id} />
              ))}
          </div>
        }
      </div>
    </div>
  );
}

