"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Axios from "../lib/Axios";

gsap.registerPlugin(ScrollTrigger);

const BlogsSection3 = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsRef = useRef([]);

  // Fetch blogs from API
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

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useGSAP(() => {
    if (loading || blogs.length === 0) return;

    gsap.from(cardsRef.current, {
      scrollTrigger: {
        trigger: cardsRef.current[0],
        start: "top 90%",
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.15,
    });
  }, [loading, blogs]);

  // Mouse enter/leave effects
  useEffect(() => {
    if (loading || blogs.length === 0) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      card.addEventListener("mouseenter", () => {
        cardsRef.current.forEach((otherCard, i) => {
          if (otherCard && i !== index) {
            gsap.to(otherCard, { opacity: 0.4, duration: 0.3, ease: "power2.out" });
          } else if (otherCard) {
            gsap.to(otherCard, { opacity: 1, duration: 0.3, ease: "power2.out" });
          }
        });
      });

      card.addEventListener("mouseleave", () => {
        cardsRef.current.forEach((otherCard) => {
          if (otherCard) {
            gsap.to(otherCard, { opacity: 1, duration: 0.3, ease: "power2.out" });
          }
        });
      });
    });

    // Cleanup
    return () => {
      cardsRef.current.forEach((card) => {
        if (card) {
          card.removeEventListener("mouseenter", () => {});
          card.removeEventListener("mouseleave", () => {});
        }
      });
    };
  }, [loading, blogs]);

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="px-[5%] py-20 flex items-center gap-8 flex-wrap relative">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          style={{ flex: "1 1 30%" }}
          className="bg-background2 rounded-lg min-w-[250px] overflow-hidden cursor-pointer relative animate-pulse"
        >
          <div className="w-full md:h-[15rem] bg-gray-700"></div>
          <div className="p-3">
            <div className="h-5 bg-gray-600 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="px-[5%] py-20 text-center">
        <p className="text-white text-lg">{error}</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="px-[5%] py-20 text-center">
        <p className="text-white text-lg">No blogs available yet.</p>
      </div>
    );
  }

  return (
    <div className="px-[5%] py-20 flex items-center gap-8 flex-wrap relative">
      {blogs.map((blog, index) => (
        <Link
          href={`/blogs/${blog.id}`}
          key={blog.id}
          ref={(el) => (cardsRef.current[index] = el)}
          style={{ flex: "1 1 30%" }}
          className="bg-background2 rounded-lg min-w-[250px] overflow-hidden cursor-pointer relative hover:scale-105 transition-transform duration-300"
        >
          <img
            src={blog.seo_image || "/blogs.png"}
            height="100"
            width="200"
            alt={blog.title || "Blog image"}
            className="w-full md:h-[15rem] object-cover"
          />
          <div className="p-3">
            <h4 
              style={{ letterSpacing: "1px" }} 
              className="text-white text-[1rem] font-semibold line-clamp-2 hover:text-main transition-colors duration-200"
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
  );
};

export default BlogsSection3;