"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Axios from "./lib/Axios";

const Testmonials = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    Axios.get("testimonials").then(data => {
      console.log(data);
      setTestimonials(data.data.data);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching testimonials:", error);
      setLoading(false);
    });
  }, []);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    
    setDirection(1);
    const nextIndex = (currentIndex + 1) % testimonials.length;
    animateCardChange(nextIndex);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    
    setDirection(-1);
    const prevIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    animateCardChange(prevIndex);
  };

  const animateCardChange = (newIndex) => {
    if (!cardRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => setCurrentIndex(newIndex)
    });

    // Animate out current card
    tl.to(cardRef.current, {
      x: direction * -100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    })
    // Reset position and animate in new card
    .set(cardRef.current, {
      x: direction * 100
    })
    .to(cardRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(".testmonials-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".testmonials-title",
          start: "top 85%",
          toggleActions: "play reverse play reverse"
        },
      });

      // Main Card
      gsap.from(".testmonials-card", {
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".testmonials-card",
          start: "top 80%",
          toggleActions: "play reverse play reverse"
        },
      });

      // Side images
      gsap.from(".side-img", {
        x: (i) => (i % 2 === 0 ? -100 : 100), 
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".testmonials-card",
          start: "top 75%",
          toggleActions: "play reverse play reverse"
        },
      });
    }, containerRef);

    return () => ctx.revert();
  });

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div
      ref={containerRef}
      className="testmonials py-20 flex justify-center items-center flex-col"
    >
      <div className="text-center testmonials-title">
        <div className="h-4 bg-gray-700 rounded w-32 mx-auto mb-2"></div>
        <div className="h-8 bg-gray-700 rounded w-64 mx-auto"></div>
      </div>

      {/* Main Card Skeleton */}
      <div className="mt-6 relative bg-[#27284B] border border-stroke rounded-lg p-6 md:w-[575px] w-[90vw] testmonials-card animate-pulse">
        <div className="flex justify-start items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-600 rounded"></div>
          ))}
        </div>
        <div className="flex justify-end">
          <div className="w-6 h-5 bg-gray-600 rounded"></div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-600 rounded w-5/6"></div>
          <div className="h-4 bg-gray-600 rounded w-4/6"></div>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-600 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-600 rounded w-32"></div>
            <div className="h-3 bg-gray-600 rounded w-24"></div>
          </div>
        </div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex items-center gap-4 mt-6">
        <div className="rounded-full border border-stroke bg-[#27284B] h-[3rem] w-[3rem]"></div>
        <div className="rounded-full border border-stroke bg-[#27284B] h-[3rem] w-[3rem]"></div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (testimonials.length === 0) {
    return (
      <div className="testmonials py-20 flex justify-center items-center flex-col">
        <div className="text-center">
          <p className="text-base capitalize text-main">Real feedback</p>
          <h3 className="text-[2rem] mt-2 text-white font-medium">
            Client Success Stories
          </h3>
        </div>
        <p className="text-white mt-6">No testimonials available yet.</p>
      </div>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div
      ref={containerRef}
      className="testmonials py-20 overflow-x-hidden flex justify-center items-center flex-col"
    >
      <div className="text-center testmonials-title">
        <p className="text-base capitalize text-main">Real feedback</p>
        <h3
          style={{ letterSpacing: "1px" }}
          className="text-[2rem] mt-2 text-white font-medium"
        >
          Client Success Stories
        </h3>
      </div>

      {/* Main Card */}
      <div 
        ref={cardRef}
        className="mt-6 relative bg-[#27284B] border border-stroke rounded-lg p-6 md:w-[575px] w-[90vw] testmonials-card"
      >
        <div className="flex justify-start items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <FaStar key={index} className="text-[#CFB107] w-4 h-4" />
          ))}
        </div>
        <div className="flex justify-end">
          <Image src="/eye.png" width="25" height="21" alt="eye" />
        </div>
        <p
          style={{ lineHeight: "30px" }}
          className="text-base mt-2 font-normal text-white"
        >
          {currentTestimonial?.content}
        </p>
        <div className="mt-8 flex items-center gap-4">
          <img 
            src={currentTestimonial?.client_image || "/placeholder-avatar.png"} 
            width="56" 
            height="56" 
            alt={currentTestimonial?.client_name} 
            className="rounded-full"
          />
          <div>
            <p className="text-white text-[1.1rem] font-bold">
              {currentTestimonial?.client_name}
            </p>
            <p className="text-body text-sm">
              {currentTestimonial?.client_position}
            </p>
          </div>
        </div>

        {/* Side Images */}
        <Image
          className="absolute top-0 left-[110%] side-img hidden md:block"
          src="/p1.png"
          width="72"
          height="72"
          alt="p1"
        />
        <Image
          className="absolute top-[35%] left-[120%] side-img hidden md:block"
          src="/p2.png"
          width="72"
          height="72"
          alt="p2"
        />
        <Image
          className="absolute top-[75%] left-[110%] side-img hidden md:block"
          src="/p3.png"
          width="72"
          height="72"
          alt="p3"
        />
        <Image
          className="absolute md:top-0 md:right-[110%] side-img top-[140%] right-[50%]"
          src="/p4.png"
          width="72"
          height="72"
          alt="p4"
        />
        <Image
          className="absolute md:top-[35%] md:right-[120%] side-img top-[140%] right-[34%]"
          src="/p5.png"
          width="72"
          height="72"
          alt="p5"
        />
        <Image
          className="absolute md:top-[75%] md:right-[110%] side-img top-[140%] right-[42%]"
          src="/p6.png"
          width="72"
          height="72"
          alt="p6"
        />
      </div>

      {/* Navigation Info */}
      {/* <div className="mt-4 text-white text-sm">
        {currentIndex + 1} / {testimonials.length}
      </div> */}

      {/* Buttons */}
      <div className="flex items-center gap-4 mt-6">
        <div 
          onClick={prevTestimonial}
          className="testmonials-btn left-btn rounded-full border border-stroke cursor-pointer hover:bg-opacity-60 duration-200 bg-[#27284B] h-[3rem] w-[3rem] flex justify-center items-center"
        >
          <IoIosArrowBack className="text-white w-5 h-5" />
        </div>
        <div 
          onClick={nextTestimonial}
          className="testmonials-btn right-btn rounded-full border border-stroke cursor-pointer hover:bg-opacity-60 duration-200 bg-[#27284B] h-[3rem] w-[3rem] flex justify-center items-center"
        >
          <IoIosArrowBack className="text-white w-5 h-5 rotate-180" />
        </div>
      </div>
    </div>
  );
};

export default Testmonials;