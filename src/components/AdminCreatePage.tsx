"use client";

import React, { useEffect, useState } from "react";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import TagInput from "@/components/TagInput";

import "react-quill/dist/quill.snow.css";
import { Loader2 } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Page = () => {
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [slug, setSlug] = useState<string | null>(null);

  const router = useRouter();

  const { register, handleSubmit, control, setValue, reset } = useForm();

  const isEditMode = Boolean(slug);

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

  const fetchData = async (slug: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/apis/articles/${slug}`);
      const fetchedArticle = response?.data?.article;

      setArticle(fetchedArticle);
      setValue("title", fetchedArticle?.title);
      setValue("content", fetchedArticle?.content);
      setTags(fetchedArticle?.tags || []);
      setImagePreview(fetchedArticle?.imageFileName ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${fetchedArticle?.imageFileName}` : fetchedArticle?.imageUrl);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();

    if (isEditMode) {
      formData.append("id", article?.id);
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      } else {
        if (article?.imageUrl) {
          formData.append("imageUrl", article?.imageUrl);
        } else {
          formData.append("imageFileName", article?.imageFileName)
        }
      }
    } else {
      formData.append("image", data.image?.[0]);
    }

    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("createdAt", article?.createdAt);
    formData.append("tags", JSON.stringify(tags));

    try {
      const endpoint = isEditMode
        ? `/apis/articles/${slug}`
        : "/apis/articles";
      const method = isEditMode ? "put" : "post";

      const response = await axios({ method, url: endpoint, data: formData });
      toast.success(response?.data?.message);
      router.push("/admin");
      localStorage.removeItem("slug");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    }
  }, [router]);

  useEffect(() => {
    const slugFromStorage = localStorage.getItem("slug");
    if (slugFromStorage) {
      setSlug(slugFromStorage);
      fetchData(slugFromStorage);
    } else {
      reset(); // Clear form for create mode
      setImagePreview(null);
      setTags([]);
    }
  }, [slug, reset]);

  return (
    <div className="form container mx-auto lg:px-24">
      {loading ? (
        <div className="mx-auto flex h-64 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      ) : (
        <div>
          <h1 className="text-lg font-bold">
            {isEditMode ? "Edit Article" : "Create Article"}
          </h1>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Image Upload */}
            <div className="form-group flex flex-col gap-4">
              <label htmlFor="image-upload">Select Article Image</label>
              <input
                type="file"
                name="image"
                id="image-upload"
                onChange={(e) => handleImageUpload(e)}
              />
              {imagePreview && (
                <Image
                  width={192}
                  height={192}
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-48 h-48 object-cover"
                />
              )}
            </div>

            {/* Tags */}
            <div className="form-group flex flex-col gap-4">
              <label>Tags</label>
              <TagInput tags={tags} setTags={setTags} />
            </div>

            {/* Title */}
            <div className="form-group flex flex-col gap-4">
              <label>Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="border border-gray-600 bg-transparent p-2 rounded-lg focus:outline-none focus:ring-0"
                type="text"
                placeholder="Article Title"
              />
            </div>

            {/* Content */}
            <div className="form-group flex flex-col gap-4">
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
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className={`w-full p-2 mt-14 bg-black text-white rounded-lg mb-5 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-black/50"
              }`}
            >
              {isEditMode ? "Edit Article" : "Create Article"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Page;
