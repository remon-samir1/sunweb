"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack } from "react-icons/io";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/css";
import "swiper/css/navigation";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Axios from "../lib/Axios";

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection2 = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resize, setResize] = useState(0);

  useLayoutEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await Axios.get('/projects');
        setProjects(response.data.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setResize((85 / 100) * window.innerWidth);
      };

      setResize((85 / 100) * window.innerWidth);
      window.addEventListener("resize", handleResize);
      
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const sectionRef = useRef(null);

  useGSAP(() => {
    if (loading) return;

    const boxes = sectionRef.current?.querySelectorAll(".service-box");
    const texts = sectionRef.current?.querySelectorAll(".service-text");

    if (boxes && boxes.length > 0) {
      // Boxes animation - smooth (no scale)
      gsap.fromTo(
        boxes,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    }

    if (texts && texts.length > 0) {
      // Texts animation
      gsap.fromTo(
        texts,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [loading]);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="px-[5%] py-20" ref={sectionRef}>
      <div className="text-center mb-10">
        <div className="h-4 bg-gray-700 rounded w-32 mx-auto mb-2 animate-pulse"></div>
        <div className="h-8 bg-gray-700 rounded w-64 mx-auto animate-pulse"></div>
      </div>

      <div className="mt-10 relative z-50">
        {/* Navigation buttons skeleton */}
        <div className="left-btn absolute top-[110%] left-[38%] md:left-[-5%] md:top-1/2 z-50 rounded-full border border-stroke bg-[#27284B] h-[3rem] w-[3rem] animate-pulse"></div>
        <div className="right-btn absolute md:!right-[-5%] top-[110%] md:left-[101%] left-[52%] md:top-1/2 z-50 rounded-full border border-stroke bg-[#27284B] h-[3rem] w-[3rem] animate-pulse"></div>

        {/* Swiper skeleton */}
        <div className="flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex-1 min-w-[300px]">
              <div className="service-box relative border border-stroke p-3 w-full h-[26rem] overflow-hidden rounded-2xl shadow-lg cursor-pointer flex justify-center items-center animate-pulse">
                {/* Background image skeleton */}
                <div className="absolute h-full w-full top-0 left-0 bg-gray-700 rounded-2xl"></div>

                {/* Content skeleton */}
                <div className="z-20 absolute top-[50%] left-0 w-full h-full p-6 bg-gray-800/90">
                  <div className="h-6 bg-gray-600 rounded w-3/4 mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-600 rounded w-full"></div>
                    <div className="h-3 bg-gray-600 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-600 rounded w-4/6"></div>
                  </div>
                  <div className="h-4 bg-gray-600 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (projects.length === 0) {
    return (
      <div className="px-[5%] py-20 text-center">
        <div className="text-center mb-10">
          <p className="text-main font-medium text-[1.1rem]">Our Work Project</p>
          <h3 className="text-[1.9rem] font-semibold text-white">
            Explore Your Design Project​
          </h3>
        </div>
        <p className="text-white text-lg">No projects available yet.</p>
      </div>
    );
  }

  return (
    <div className="px-[5%] py-20" ref={sectionRef}>
      <div className="text-center mb-10">
        <p className="text-main font-medium text-[1.1rem]">Our Work Project</p>
        <h3 className="text-[1.9rem] font-semibold text-white">
          Explore Your Design Project​
        </h3>
      </div>

      <div className="mt-10 relative z-50">
        {/* Navigation buttons */}
        <div className="left-btn absolute top-[110%] left-[38%] md:left-[-5%] md:top-1/2 z-50 rounded-full border border-stroke cursor-pointer hover:bg-opacity-60 duration-200 bg-[#27284B] h-[3rem] w-[3rem] flex justify-center items-center">
          <IoIosArrowBack className="text-white w-5 h-5" />
        </div>
        <div className="right-btn absolute md:!right-[-5%] top-[110%] md:left-[101%] left-[52%] md:top-1/2 z-50 rounded-full border border-stroke cursor-pointer hover:bg-opacity-60 duration-200 bg-[#27284B] h-[3rem] w-[3rem] flex justify-center items-center">
          <IoIosArrowBack className="text-white w-5 h-5 rotate-180" />
        </div>

        {/* Swiper */}
        <Swiper
          spaceBetween={30}
          slidesPerView={resize > 820 ? 4 : 1.2}
          navigation={{ nextEl: ".right-btn", prevEl: ".left-btn" }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id}>
              <Link 
                href={`/projects/details/${project.id}`} 
                className="service-box relative border border-stroke p-3 w-full h-[26rem] overflow-hidden rounded-2xl shadow-lg cursor-pointer flex justify-center items-center group transition-all duration-700 z-10"
              >
                {/* Background image */}
                <img
                  src={project.images[0] || "/project-ex.png"}
                  alt={project.title}
                  className="absolute h-full w-full top-0 left-0 object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />

                {/* Overlay */}
                <div
                  className="z-20 absolute top-[50%] left-0 w-full h-full p-6 transition-all duration-700 group-hover:top-0 group-hover:bg-[#1f203c]/90"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(12, 3, 70, 0.4) -52.21%, #1F203C 59.67%)",
                  }}
                >
                  <h3 className="service-text text-[1.3rem] text-white font-bold mb-2 transform transition-all duration-700 group-hover:translate-y-[-8px] group-hover:text-main">
                    {project.title}
                  </h3>
                  <p className="service-text text-[0.9rem] text-gray-300 mb-3 opacity-90 transition-all duration-700 group-hover:translate-y-[-6px] group-hover:text-white line-clamp-3">
                    {project.description}
                  </p>
                  <button className="service-text mt-2 text-white border-b border-b-white group-hover:text-main group-hover:border-main transition-colors duration-500">
                    View details
                  </button>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition duration-700 group-hover:shadow-[0_0_35px_rgba(0,200,255,0.6)]"></div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProjectsSection2;