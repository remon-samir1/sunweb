"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack } from "react-icons/io";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/navigation";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";
import Axios from "../lib/Axios";

gsap.registerPlugin(ScrollTrigger);

const ServeicesSection3 = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resize, setResize] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await Axios.get('/services');
        setServices(response.data.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
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

    const ctx = gsap.context(() => {
      gsap.from(".service-box", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <section ref={sectionRef} className="px-[5%] py-20">
      <div className="flex justify-center flex-col items-center gap-4">
        {/* Heading Skeleton */}
        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
        <div className="h-8 bg-gray-700 rounded w-96 max-w-full animate-pulse"></div>
      </div>

      <div className="mt-10 relative">
        {/* Navigation Buttons Skeleton */}
        <div className="left-btn absolute z-50 left-[-5%] top-1/2 rounded-full border border-stroke bg-[#27284B] h-[3rem] w-[3rem] animate-pulse"></div>
        <div className="right-btn absolute z-50 right-[-5%] top-1/2 rounded-full border border-stroke bg-[#27284B] h-[3rem] w-[3rem] animate-pulse"></div>

        {/* Swiper Skeleton */}
        <div className="flex gap-6 justify-center">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex-1 max-w-[400px]">
              <div className="service-box border p-3 flex-col border-stroke w-full h-[22rem] relative overflow-hidden rounded-2xl shadow-lg cursor-pointer flex justify-center items-center gap-4 animate-pulse">
                {/* Background Image Skeleton */}
                <div className="absolute h-[94%] w-[94%] top-1/2 left-1/2 translate-x-[-50%] rounded-xl translate-y-[-50%] bg-gray-700"></div>
                
                {/* Icon Skeleton */}
                <div className="w-[4.2rem] h-[4.5rem] rounded-lg bg-gray-600 flex justify-center items-center relative z-10">
                  <div className="w-10 h-10 bg-gray-500 rounded"></div>
                </div>
                
                {/* Title Skeleton */}
                <div className="h-6 bg-gray-600 rounded w-32 relative z-10"></div>
                
                {/* Description Skeleton */}
                <div className="space-y-2 relative z-10 w-full px-4">
                  <div className="h-3 bg-gray-600 rounded w-full"></div>
                  <div className="h-3 bg-gray-600 rounded w-5/6 mx-auto"></div>
                  <div className="h-3 bg-gray-600 rounded w-4/6 mx-auto"></div>
                </div>
                
                {/* Button Skeleton */}
                <div className="h-10 bg-gray-600 rounded w-32 relative z-10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <section ref={sectionRef} className="px-[5%] py-20">
      <div className="flex justify-center flex-col items-center gap-4">
        <h3 className="text-main text-base">What we offer</h3>
        <p className="max-w-[750px] font-medium text-white text-[1.9rem] text-center">
          Explore our full range of web solution services designed to help your
          business grow.
        </p>
      </div>

      <div className="mt-10 relative">
        <div className="left-btn absolute z-50 left-[-5%] top-1/2 rounded-full border border-stroke cursor-pointer hover:bg-opacity-60 duration-200 bg-[#27284B] h-[3rem] w-[3rem] !flex justify-center items-center ">
          <IoIosArrowBack className="text-white w-5 h-5" />
        </div>
        <div className="right-btn absolute z-50 right-[-5%] top-1/2 rounded-full border border-stroke cursor-pointer hover:bg-opacity-60 duration-200 bg-[#27284B] h-[3rem] w-[3rem] !flex justify-center items-center ">
          <IoIosArrowBack className="text-white w-5 h-5 rotate-180" />
        </div>
        <Swiper
          spaceBetween={30}
          slidesPerView={resize > 820 ? 3 : 1}
          navigation={{ nextEl: ".right-btn", prevEl: ".left-btn" }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {services?.map((data) => (
            <SwiperSlide key={data.id}>
              <Link 
                href={`/services/${data.slug}`} 
                className="service-box border p-3 flex-col border-stroke group w-full h-[22rem] relative overflow-hidden rounded-2xl shadow-lg cursor-pointer flex justify-center items-center gap-4"
              >
                <Image 
                  alt="service background"
                  width={100}
                  height={100}
                  src="/servicesBox.png"
                  className="absolute h-[94%] w-[94%] top-1/2 left-1/2 translate-x-[-50%] rounded-xl translate-y-[-50%] object-cover"
                />
                <div className="w-[4.2rem] h-[4.5rem] rounded-lg bg-main flex justify-center items-center relative z-10">
                  <Icon
                    icon={data.short_icon}
                    width="40"
                    height="40"
                    style={{ color: "#000" }}
                  />
                </div>
                <h3 className="text-[1.7rem] text-white font-medium relative z-10">
                  {data.short_title}
                </h3>
                <p className="text-base text-body max-w-[70%] text-center relative z-10">
                  {data.short_description}
                </p>
                <button className="flex items-center justify-center gap-3 bg-main py-2 px-6 rounded duration-300 hover-main mt-4 relative z-10">
                  <span className="text-black text-base font-semibold">
                    Learn more
                  </span>
                  <Icon
                    icon="teenyicons:arrow-solid"
                    width="16"
                    height="16"
                    style={{ color: "#000" }}
                    className="rotate-90"
                  />
                </button>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ServeicesSection3;