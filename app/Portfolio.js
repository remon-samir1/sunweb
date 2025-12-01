"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import Axios from "./lib/Axios";

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]); 
  const [services, setServices] = useState([]);
  const [servicesId, setServicesId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, servicesRes] = await Promise.all([
          Axios.get('/projects'),
          Axios.get("/services")
        ]);
        
        setProjects(projectsRes.data.data);
        setAllProjects(projectsRes.data.data.slice(-6)); // Store all projects
        setServices(servicesRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (servicesId !== null) {
      // Filter from allProjects instead of current filtered projects
      const filtered = allProjects.filter(data => data.service_id == servicesId);
      setProjects(filtered);
    } else {
      // Reset to all projects when no filter is selected
      setProjects(allProjects);
    }
  }, [servicesId, allProjects]);

  useGSAP(() => {
    if (loading) return; // Don't run animations while loading

    // Animation for section heading
    gsap.from(sectionRef.current.querySelectorAll("p, h3"), {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: 'play reverse play reverse'
      },
    });

    // Animation for cards
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: 'play reverse play reverse'
        },
      });
    });
  }, [loading]);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <section className="px-[5%] mt-8">
      {/* Heading Skeleton */}
      <div className="flex items-start md:items-end flex-col md:flex-row justify-between">
        <div>
          <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-8 bg-gray-700 rounded w-48"></div>
        </div>
        <div className="rounded-full overflow-x-scroll no-scrollbar max-w-[90vw] px-2 h-14 flex items-center justify-start gap-2 bg-gray-800 mt-4 md:mt-0">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-700 rounded-full w-20"></div>
          ))}
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid md:grid-cols-3 grid-cols-1 grid-rows-6 md:grid-rows-3 gap-4 mt-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={`h-[280px] md:h-auto bg-gray-800 rounded-2xl animate-pulse ${
              index === 0
                ? "md:col-span-1 md:row-span-2"
                : index === 1 || index === 4
                ? "md:col-span-2 md:row-span-1"
                : "md:col-span-1 md:row-span-1"
            }`}
          ></div>
        ))}
      </div>
    </section>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <section ref={sectionRef} className="px-[5%] mt-8">
      {/* Heading */}
      <div className="flex items-start md:items-end flex-col md:flex-row justify-between">
        <div>
          <p className="text-main whitespace-nowrap text-base">Our Portfolio</p>
          <h3 className="text-white whitespace-nowrap text-[2rem] font-semibold">
            Our Portfolio Showcase
          </h3>
        </div>
        <nav
          style={{
            background: "rgba(175, 175, 175, 0.10)",
            backdropFilter: "blur(10px) saturate(1)",
          }}
          className="rounded-full overflow-x-scroll no-scrollbar max-w-[90vw] px-2 h-14 flex items-center justify-start gap-2"
        >
          {/* All Projects Button */}
          <button
            onClick={() => setServicesId(null)}
            className={`text-white px-2 md:px-3 capitalize rounded-full hover:bg-main duration-300 whitespace-nowrap py-2 ${
              servicesId === null ? "bg-main" : ""
            }`}
          >
            All
          </button>
          
          {services?.map((btn, index) => (
            <button
              onClick={() => setServicesId(btn.id)}
              key={btn.id || btn.name}
              className={`text-white px-2 md:px-3 capitalize rounded-full hover:bg-main duration-300 whitespace-nowrap py-2 ${
                servicesId === btn.id ? "bg-main" : ""
              }`}
            >
              {btn.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 grid-cols-1 grid-rows-6 md:grid-rows-3 gap-4 mt-6">
        {projects?.length > 0 ? (
          projects.map((data, index) => (
            <Link 
              href={`/projects/details/${data.id}`} 
              key={data.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`group h-[280px] md:h-auto relative border overflow-hidden border-[#4C4C66] rounded-2xl cursor-pointer 
                ${index === 0
                  ? "md:col-span-1 md:row-span-2"
                  : index === 1 || index === 4
                  ? "md:col-span-2 md:row-span-1"
                  : "md:col-span-1 md:row-span-1"}`}
            >
              <img
                src={data.images?.[0] || "/placeholder-image.jpg"}
                loading="lazy"
                alt="project"
                className="w-full h-full object-cover transform group-hover:scale-110 duration-700 ease-out"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent md:opacity-0 group-hover:opacity-100 duration-500"></div>

              {/* Text */}
              <div className="absolute bottom-6 left-6 right-6 md:translate-y-10 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500">
                <h3 className="text-white text-[1.2rem] font-semibold">
                  {data.title}
                </h3>
                <p className="text-[0.9rem] text-gray-200 mt-2 line-clamp-2">
                  {data.description}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-white text-lg">No projects found for this filter.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;