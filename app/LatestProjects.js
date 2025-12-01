"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Axios from "./lib/Axios";

gsap.registerPlugin(ScrollTrigger);

const LatestProjects = () => {
  const [resize, setResize] = useState(0);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    // Set initial resize value
    if (typeof window !== "undefined") {
      setResize((85 / 100) * window.innerWidth);
    }

    const handleResize = () => {
      setResize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, servicesRes] = await Promise.all([
          Axios.get('/projects'),
          Axios.get("/services")
        ]);

        // Get latest 6 projects (you can adjust this logic based on your API)
        const latestProjects = projectsRes.data.data.slice(0, 6);
        setProjects(latestProjects);
        setServices(servicesRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get service name by service_id
  const getServiceName = (serviceId) => {
    const service = services.find(service => service.id === serviceId);
    return service ? service.name : "Uncategorized";
  };

  useGSAP(() => {
    if (loading) return;

    let ctx = gsap.context(() => {
      gsap.from(".project-card", {
        opacity: 0,
        y: 80,
        duration: 0.7,
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: 'play reverse play reverse'
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  // Skeleton Loader
  const SkeletonLoader = () => (
    <section className="px-[5%] my-16" ref={containerRef}>
      <div className="flex items-end justify-between">
        <div>
          <div className="h-4 bg-gray-700 rounded w-40 mb-2"></div>
          <div className="h-8 bg-gray-700 rounded w-56"></div>
        </div>
        <div className="md:flex items-center gap-4 hidden">
          <div className="rounded-full border border-stroke bg-[#27284B] h-[3rem] w-[3rem]"></div>
          <div className="rounded-full border border-stroke bg-[#27284B] h-[3rem] w-[3rem]"></div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex-1">
              <div className="project-card w-full h-[350px] bg-gray-800 rounded-2xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center mt-6 md:hidden gap-4">
        <div className="rounded-full border border-stroke bg-[#27284B] h-[3rem] w-[3rem]"></div>
        <div className="rounded-full border border-stroke bg-[#27284B] h-[3rem] w-[3rem]"></div>
      </div>
    </section>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <section className="px-[5%] my-16" ref={containerRef}>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-main whitespace-nowrap text-base tracking-wider">
            Our LATEST PROJECTS
          </p>
          <h3 className="text-white whitespace-nowrap text-[2rem] font-semibold">
            Our Successful Projects
          </h3>
        </div>
        <div className="md:flex items-center gap-4 hidden ">
          <div className="left-btn rounded-full border border-stroke cursor-pointer hover:bg-opacity-60 duration-200 bg-[#27284B] h-[3rem] w-[3rem] flex justify-center items-center ">
            <IoIosArrowBack className="text-white w-5 h-5" />
          </div>
          <div className="right-btn rounded-full border border-stroke cursor-pointer hover:bg-opacity-60 duration-200 bg-[#27284B] h-[3rem] w-[3rem] flex justify-center items-center ">
            <IoIosArrowBack className="text-white w-5 h-5 rotate-180" />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Swiper
          spaceBetween={30}
          slidesPerView={resize > 820 ? 3 : resize > 640 ? 2 : 1}
          navigation={{ nextEl: ".right-btn", prevEl: ".left-btn" }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {projects.map((data) => (
            <SwiperSlide key={data.id}>
              <Link 
                href={`/projects/details`} 
                className="project-card group w-full h-full relative overflow-hidden rounded md:rounded-2xl shadow-lg cursor-pointer"
              >
                <img
                  src={data.images?.[0] || "/placeholder-image.jpg"}
                  alt={data.title}
                  className="object-cover w-full h-[350px] transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 duration-500 flex flex-col justify-end p-5">
                  <span className="text-main text-sm uppercase tracking-wider">
                    {getServiceName(data.service_id)}
                  </span>
                  <h4 className="text-white text-lg font-semibold mt-1">
                    {data.title}
                  </h4>
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                    {data.description}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex items-center justify-center mt-6 md:hidden gap-4">
        <div className="left-btn rounded-full border border-stroke cursor-pointer hover:bg-opacity-60 duration-200 bg-[#27284B] h-[3rem] w-[3rem] flex justify-center items-center ">
          <IoIosArrowBack className="text-white w-5 h-5" />
        </div>
        <div className="right-btn rounded-full border border-stroke cursor-pointer hover:bg-opacity-60 duration-200 bg-[#27284B] h-[3rem] w-[3rem] flex justify-center items-center ">
          <IoIosArrowBack className="text-white w-5 h-5 rotate-180" />
        </div>
      </div>
    </section>
  );
};

export default LatestProjects;