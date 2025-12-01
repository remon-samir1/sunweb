"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Axios from "../lib/Axios";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const BlogsSection2 = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectionRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await Axios.get("blogs");
        setBlogs(response.data.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useGSAP(() => {
    if (loading) return;

    const section = sectionRef.current;
    if (!section) return;

    gsap.from(section.querySelectorAll("h3, p, h2"), {
      scrollTrigger: {
        trigger: section,
        start: "top 50%",
        toggleActions: "play reverse play reverse"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.3,
      ease: "power3.out",
    });

    gsap.from(section.querySelector("img"), {
      scrollTrigger: {
        trigger: section,
        toggleActions: "play reverse play reverse",
        start: "top 50%",
      },
      x: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, [loading]);

  // Get the first blog
  const firstBlog = blogs.length > 0 ? blogs[0] : null;

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div ref={sectionRef} className="px-[5%] py-20">
      <div className="text-center">
        <div className="h-4 bg-gray-700 rounded w-16 mx-auto mb-2 animate-pulse"></div>
        <div className="h-8 bg-gray-700 rounded w-64 mx-auto animate-pulse"></div>
        <div className="space-y-2 mt-3 max-w-[750px] mx-auto">
          <div className="h-3 bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-700 rounded w-5/6 mx-auto"></div>
          <div className="h-3 bg-gray-700 rounded w-4/6 mx-auto"></div>
        </div>
      </div>
      <div className="mt-10 flex items-start flex-col md:flex-row gap-10 h-max">
        <div className="md:w-[55%] w-full h-64 bg-gray-700 rounded animate-pulse"></div>
        <div className="flex-1">
          <div className="h-8 bg-gray-700 rounded w-full mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-700 rounded w-4/6"></div>
            <div className="h-3 bg-gray-700 rounded w-full"></div>
          </div>
          <div className="h-10 bg-gray-700 rounded w-32 mt-6 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="px-[5%] py-20 text-center">
        <div className="text-center">
          <p className="text-[1.1rem] text-main font-semibold">blog</p>
          <h3 className="font-semibold text-[1.9rem] md:text-[2.5rem] text-white mt-3">
            Latest Blog & News
          </h3>
        </div>
        <p className="text-white mt-6">{error}</p>
      </div>
    );
  }

  if (!firstBlog) {
    return (
      <div className="px-[5%] py-20 text-center">
        <div className="text-center">
          <p className="text-[1.1rem] text-main font-semibold">blog</p>
          <h3 className="font-semibold text-[1.9rem] md:text-[2.5rem] text-white mt-3">
            Latest Blog & News
          </h3>
        </div>
        <p className="text-white mt-6">No blogs available yet.</p>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="px-[5%] py-20">
      <div className="text-center">
        <p className="text-[1.1rem] text-main font-semibold">blog</p>
        <h3 className="font-semibold text-[1.9rem] md:text-[2.5rem] text-white mt-3">
          Latest Blog & News
        </h3>
        <p
          style={{ lineHeight: "28px" }}
          className="text-body text-base text-center mx-auto max-w-[750px] mt-3"
        >
          Commodo elementum, sed imperdiet nunc euismod etiam aliquet viverra
          enim. Adipiscing nunc condimentum risus id. Aquam mattis magna
          facilisi
        </p>
      </div>
      <div className="mt-10 flex items-start flex-col md:flex-row gap-10 h-max">
        <img
          src={firstBlog.seo_image || "/blogs.png"}
          height="400"
          alt={firstBlog.title || "Blog image"}
          width="600"
          className="md:w-[55%] w-full h-auto object-cover rounded-lg"
        />
        <div className="flex-1">
          <h2 className="text-white text-[1.5rem] md:text-[2.5rem] font-semibold leading-tight">
            {firstBlog.title || "No title available"}
          </h2>
          <p className="text-body text-base my-4">
            {formatDate(firstBlog.created_at)} • {firstBlog.comments_count || 0} Comments
          </p>
          <p className="text-body text-[1.1rem] leading-relaxed">
            {firstBlog.excerpt || firstBlog.content?.substring(0, 200) + "..." || "No content available"}
          </p>
          <Link href={`/blogs/${ firstBlog.id}`}>
            <button
              ref={btnRef}
              className="flex items-center mt-6 gap-4 border border-main px-6 py-2 rounded-lg transition-all duration-300 hover:bg-main hover:text-black group"
            >
              <span className="text-base font-bold text-main group-hover:text-black transition-colors">
                Read more
              </span>
              <Icon
                icon="mingcute:arrows-right-line"
                width="18"
                height="18"
                className="text-main group-hover:text-black transition-colors"
              />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogsSection2;