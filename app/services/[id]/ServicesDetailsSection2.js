"use client";

import Axios from "@/app/lib/Axios";
import { useGSAP } from "@gsap/react";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        y: -10,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div className="mt-6 border border-stroke overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex justify-start items-center gap-3 px-4 py-3 text-left font-medium transition-colors bg-background2 text-white"
      >
        {isOpen ? (
          <div className="flex justify-center items-center rounded-sm bg-main w-[32px] h-[24px]">
            <MdOutlineArrowBackIos className="text-black -rotate-90" />
          </div>
        ) : (
          <div className="flex justify-center items-center rounded-sm bg-main w-[32px] h-[24px]">
            <MdOutlineArrowBackIos className="text-black -rotate-180" />
          </div>
        )}
        {question}
      </button>

      <div
        ref={contentRef}
        className="px-8 text-body text-sm leading-relaxed bg-background2"
        style={{ height: 0, overflow: "hidden", opacity: 0 }}
      >
        <p className="py-4" dangerouslySetInnerHTML={{__html:answer}}></p>
      </div>
    </div>
  );
};

const ServicesDetailsSection2 = () => {
  const [data, setData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await Axios.get("/services");
        const allServices = response.data.data;
        setServices(allServices);
        
        // Find the current service by slug
        const currentService = allServices.find(service => service.slug === id);
        
        if (!currentService) {
          setError("Service not found");
          return;
        }
        
        setData(currentService);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const [openIndex, setOpenIndex] = useState(0);

  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const sideTabsRef = useRef([]);
  const accordionRef = useRef(null);
  const featuresRef = useRef([]);
  const faqRef = useRef(null);

  useGSAP(() => {
    if (loading || !data) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 90%",
          },
        }
      );
      
      sideTabsRef.current.forEach((tab, i) => {
        if (tab) {
          gsap.fromTo(
            tab,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              delay: i * 0.1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: tab,
                start: "top 90%",
              },
            }
          );
        }
      });

      const headings = sectionRef.current?.querySelectorAll("h3");
      if (headings && headings.length > 0) {
        gsap.fromTo(
          headings,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headings[0],
              start: "top 85%",
              toggleActions: "play reverse play reverse"
            },
          }
        );
      }

      if (accordionRef.current) {
        gsap.fromTo(
          accordionRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: accordionRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Features
      featuresRef.current.forEach((item, i) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              delay: i * 0.15,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 90%",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, data]);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="py-20 px-[5%] flex items-start flex-col-reverse md:flex-row-reverse gap-4">
      {/* Side Section Skeleton */}
      <div className="w-full md:w-[395px]">
        <div className="w-full bg-background2 px-3 py-5">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="border border-stroke bg-gray-700 p-4 mt-4 flex flex-row-reverse justify-between items-center gap-4 animate-pulse"
            >
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-600 rounded w-32"></div>
            </div>
          ))}
        </div>

        {/* Call to Action Skeleton */}
        <div className="mt-4 w-full h-[29rem] bg-gray-800 flex flex-col justify-center items-center animate-pulse">
          <div className="w-[120px] h-[120px] bg-gray-700 rounded-full"></div>
          <div className="h-6 bg-gray-700 rounded w-48 mt-8"></div>
          <div className="h-4 bg-gray-700 rounded w-32 mt-8"></div>
          <div className="h-8 bg-gray-700 rounded w-40 mt-4"></div>
        </div>
      </div>

      {/* Main Section Skeleton */}
      <div className="flex-1">
        {/* Main Image Skeleton */}
        <div className="w-full h-[28rem] bg-gray-700 animate-pulse"></div>

        {/* Title Skeleton */}
        <div className="h-8 bg-gray-700 rounded w-48 mt-6 animate-pulse"></div>

        {/* Description Skeleton */}
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse"></div>
        </div>

        {/* FAQ Title Skeleton */}
        <div className="h-8 bg-gray-700 rounded w-64 mt-6 animate-pulse"></div>

        {/* Accordion Skeleton */}
        <div className="space-y-4 mt-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border border-stroke p-4 bg-gray-800 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>

        {/* Features Skeleton */}
        <div className="mt-10 flex md:flex-row flex-col-reverse items-start gap-4">
          <div className="grid grid-cols-1 grid-rows-5 flex-1 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-40"></div>
              </div>
            ))}
          </div>
          <div className="flex-1 h-64 bg-gray-700 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Error State
  if (error) {
    return (
      <div className="py-20 px-[5%] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl text-white font-semibold mb-4">Service Not Found</h3>
          <p className="text-body mb-6">{error}</p>
          <Link 
            href="/services" 
            className="bg-main text-black px-6 py-3 rounded font-semibold hover:bg-main/80 transition-colors"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading || !data) {
    return <SkeletonLoader />;
  }

  // Empty State
  if (!data) {
    return (
      <div className="py-20 px-[5%] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl text-white font-semibold mb-4">No Service Details Available</h3>
          <p className="text-body mb-6">The service you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/services" 
            className="bg-main text-black px-6 py-3 rounded font-semibold hover:bg-main/80 transition-colors"
          >
            Browse All Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-20 px-[5%] flex items-start flex-col-reverse md:flex-row-reverse gap-4"
      ref={sectionRef}
    >
      {/* Side Section */}
      <div className="w-full md:w-[395px]">
        <div className="w-full bg-background2 px-3 py-5">
          {services?.map((service, index) => (
            <Link
              href={`/services/${service.slug}`}
              key={service.id}
              ref={(el) => (sideTabsRef.current[index] = el)}
              className="border sideTab border-stroke bg-white p-4 mt-4 flex flex-row-reverse justify-between items-center gap-4 opacity-0"
            >
              <Icon
                icon="solar:arrow-right-linear"
                width="24"
                height="24"
                className="text-background z-50"
              />
              <span className="font-medium z-50 text-background text-[1rem]">
                {service.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-4 w-full h-[29rem] sideLinear flex flex-col justify-center items-center">
          <div className="flex items-center justify-center rounded-full w-[120px] h-[120px] bg-[#F9F4FB] bg-opacity-55">
            <div className="flex items-center justify-center rounded-full w-[100px] h-[100px] bg-white">
              <Icon
                icon="lucide:phone-call"
                width="56"
                height="56"
                style={{ color: "#000" }}
              />
            </div>
          </div>
          <h4 className="text-[1.3rem] font-semibold text-white text-center max-w-[300px] mt-8">
            Get Easy Interior Solution From Us
          </h4>
          <p className="text-base font-medium text-white mt-8">Contact us anytime</p>
          <p className="text-[1.8rem] font-semibold text-white">1018883449</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1">
        {/* Main Image */}
        <div
          ref={imageRef}
          className="w-full h-[28rem] overflow-hidden relative opacity-0"
        >
          <img
            src={data.image || "/placeholder-image.jpg"}
            width="200"
            height="200"
            alt={data.name || "Service Image"}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="mt-6 text-[1.5rem] font-semibold text-white">
          Service Details
        </h3>

        <p 
          dangerouslySetInnerHTML={{__html: data?.description || "No description available."}} 
          className="mt-4 text-body text-[1.1rem]"
        />

        <h3 className="mt-6 text-[1.5rem] font-semibold text-white">
          Frequently Asked Question
        </h3>

        {/* Accordion */}
        <div className="flex-1" ref={accordionRef}>
          {data?.faqs?.length > 0 ? (
            data.faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))
          ) : (
            <p className="text-body mt-4">No FAQs available for this service.</p>
          )}
        </div>

        {/* Features */}
        <div className="mt-10 flex md:flex-row flex-col-reverse items-start gap-4 h-max">
          <div className="grid grid-cols-1 grid-rows-5 flex-1 gap-4">
            {data.benefits?.length > 0 ? (
              data.benefits.map((benefit, index) => (
                <div
                  key={index}
                  ref={(el) => (featuresRef.current[index] = el)}
                  className="flex items-center gap-3 group cursor-pointer opacity-0"
                >
                  <Icon
                    icon="mdi:checkbox-marked-circle-outline"
                    width="30"
                    height="30"
                    className="text-main transition-colors duration-200 group-hover:text-main/80"
                  />
                  <span className="text-[1.1rem] font-medium text-body transition-colors duration-200 group-hover:text-white/80">
                    {benefit.name}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-body">No benefits listed for this service.</p>
            )}
          </div>

          <div className="flex-1 h-full">
            <Image
              src="/services-ex.png"
              width="100"
              height="100"
              alt="meeting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesDetailsSection2;