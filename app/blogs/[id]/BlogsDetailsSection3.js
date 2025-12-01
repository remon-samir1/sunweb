"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Axios from "@/app/lib/Axios";

const BlogsDetailsSection3 = () => {
  const { slug } = useParams();
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch related blogs
  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await Axios.get('blogs');
        const allBlogs = response.data.data;
        
        const filteredBlogs = allBlogs
          .filter(blog => blog.id !== slug)
          .slice(0, 3);
        
        setRelatedBlogs(filteredBlogs);
      } catch (err) {
        console.error("Error fetching related blogs:", err);
        setError("Failed to load related articles");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [slug]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Skeleton Loader
  const SkeletonLoader = () => (
    <section className="px-[5%]">
      <div className="h-4 bg-gray-700 rounded w-16 mb-2 animate-pulse"></div>
      <div className="h-8 bg-gray-700 rounded w-64 mb-4 animate-pulse"></div>
      <div className="space-y-2 max-w-[512px] mb-6">
        <div className="h-3 bg-gray-700 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6 animate-pulse"></div>
        <div className="h-3 bg-gray-700 rounded w-4/6 animate-pulse"></div>
      </div>

      <div className="flex items-center gap-8 mt-6 flex-wrap relative">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            style={{ flex: "1 1 30%" }}
            className="bg-background2 min-w-[250px] rounded-lg overflow-hidden cursor-pointer relative animate-pulse"
          >
            <div className="w-full h-[15rem] bg-gray-700"></div>
            <div className="p-3">
              <div className="h-5 bg-gray-600 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <section className="px-[5%]">
        <h4 className="text-main text-[1.1rem] font-semibold">blog</h4>
        <h3 className="mt-4 text-white text-[2.5rem] font-semibold">
          Related Articles
        </h3>
        <p className="text-white mt-4">{error}</p>
      </section>
    );
  }

  if (relatedBlogs.length === 0) {
    return (
      <section className="px-[5%]">
        <h4 className="text-main text-[1.1rem] font-semibold">blog</h4>
        <h3 className="mt-4 text-white text-[2.5rem] font-semibold">
          Related Articles
        </h3>
        <p style={{lineHeight:"30px"}} className="text-[1.1rem] text-body max-w-[512px] mt-4">
          Commodo elementum, sed imperdiet nunc euismod etiam aliquet viverra
          enim. Adipiscing nunc{" "}
        </p>
        <p className="text-white mt-6">No related articles available.</p>
      </section>
    );
  }

  return (
    <section className="px-[5%]">
      <h4 className="text-main text-[1.1rem] font-semibold">blog</h4>
      <h3 className="mt-4 text-white text-[2.5rem] font-semibold">
        Related Articles
      </h3>
      <p style={{lineHeight:"30px"}} className="text-[1.1rem] text-body max-w-[512px] mt-4">
        Commodo elementum, sed imperdiet nunc euismod etiam aliquet viverra
        enim. Adipiscing nunc{" "}
      </p>

      <div className="flex items-center gap-8 mt-6 flex-wrap relative">
        {relatedBlogs.map((blog, index) => (
          <Link
            href={`/blogs/${blog.id}`}
            key={blog.id}
            style={{ flex: "1 1 30%" }}
            className="bg-background2 min-w-[250px] rounded-lg overflow-hidden cursor-pointer relative hover:scale-105 transition-transform duration-300 group"
          >
            <img
              src={blog.seo_image || "/blogs.png"}
              height="100"
              alt={blog.title || "Related blog"}
              width="200"
              className="w-full h-[15rem] object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="p-3">
              <h4 
                style={{letterSpacing:"1px"}} 
                className="text-white text-[1rem] font-semibold line-clamp-2 group-hover:text-main transition-colors duration-200"
              >
                {blog.title || "No title available"}
              </h4>
              <p className="text-body text-[0.9rem] my-2">
                {formatDate(blog.created_at)} • {blog.comments_count || 0} Comments
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogsDetailsSection3;