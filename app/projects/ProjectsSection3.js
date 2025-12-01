"use client";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Axios from "../lib/Axios"; // Adjust import path as needed

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ProjectsSection3 = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const headingRef = useRef(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await Axios.get('/projects');
        // Get top 4 projects (you can adjust this logic based on your needs)
        const topProjects = response.data.data.filter(prev => prev.is_best === 1).slice(0, 4);
        setProjects(topProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Set up animations on component mount
  useGSAP(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Animate heading
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate cards with staggered animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        // Scroll animation
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Hover animation - scale up and reduce opacity of other cards
        card.addEventListener("mouseenter", () => {
          // Scale up the hovered card
          gsap.to(card, {
            // scale: 1.03,
            duration: 0.4,
            ease: "power2.out",
          });
          
          // Reduce opacity of other cards
          cardsRef.current.forEach((otherCard) => {
            if (otherCard && otherCard !== card) {
              gsap.to(otherCard, {
                opacity: 0.4,
                duration: 0.4,
                ease: "power2.out",
              });
            }
          });
        });

        card.addEventListener("mouseleave", () => {
          // Reset the hovered card
          gsap.to(card, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
          
          // Reset opacity of all cards
          cardsRef.current.forEach((otherCard) => {
            if (otherCard) {
              gsap.to(otherCard, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
              });
            }
          });
        });

        // Button hover animation
        const button = card.querySelector("button");
        if (button) {
          button.addEventListener("mouseenter", () => {
            gsap.to(button, {
              y: -3,
              duration: 0.3,
            });
          });

          button.addEventListener("mouseleave", () => {
            gsap.to(button, {
              y: 0,
              duration: 0.3,
            });
          });
        }
      });
    }, sectionRef);

    // Clean up
    return () => ctx.revert();
  }, [loading]);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div ref={sectionRef} className="px-[5%] py-20 overflow-hidden">
      <div ref={headingRef} className="text-center mb-10">
        <div className="h-4 bg-gray-700 rounded w-32 mx-auto mb-2 animate-pulse"></div>
        <div className="h-8 bg-gray-700 rounded w-64 mx-auto animate-pulse"></div>
      </div>
      <div className="flex items-center gap-4 mt-8 flex-wrap">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-[24rem] border border-stroke p-4 flex-1 min-w-[250px] rounded-2xl animate-pulse bg-gray-800"
          >
            <div className="w-full h-[50%] rounded-lg bg-gray-700"></div>
            <div className="h-6 bg-gray-700 rounded w-3/4 mt-6"></div>
            <div className="space-y-2 mt-4">
              <div className="h-3 bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              <div className="h-3 bg-gray-700 rounded w-4/6"></div>
            </div>
            <div className="h-10 bg-gray-700 rounded-full mt-6"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="px-[5%] py-20 text-center">
        <div className="text-center mb-10">
          <p className="text-main font-medium text-[1.1rem]">
            Top Project Design
          </p>
          <h3 className="text-[1.9rem] font-semibold text-white">
            Our Best Design Project​
          </h3>
        </div>
        <p className="text-white text-lg">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="px-[5%] py-20 text-center">
        <div className="text-center mb-10">
          <p className="text-main font-medium text-[1.1rem]">
            Top Project Design
          </p>
          <h3 className="text-[1.9rem] font-semibold text-white">
            Our Best Design Project​
          </h3>
        </div>
        <p className="text-white text-lg">No projects available yet.</p>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="px-[5%] py-20 overflow-hidden">
      <div ref={headingRef} className="text-center mb-10 opacity-0">
        <p className="text-main font-medium text-[1.1rem]">
          Top Project Design
        </p>
        <h3 className="text-[1.9rem] font-semibold text-white">
          Our Best Design Project​
        </h3>
      </div>
      <div className="flex items-center gap-4 mt-8 flex-wrap">
        {projects.map((project, index) => (
          <Link 
            href={`/projects/details/${project.id}`}
            key={project.id}
            ref={(el) => (cardsRef.current[index] = el)}
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(12, 3, 70, 0.5) -52.21%, #1F203C 59.67%)",
              backdropFilter: "blur(10px)",
            }}
            className="h-[24rem] border border-stroke p-4 flex-1 min-w-[250px] rounded-2xl opacity-0 transform will-change-transform"
          >
            <img
              src={project.images?.[0] || "/project-ex.png"}
              className="w-full h-[50%] rounded-lg border border-stroke object-cover transform will-change-transform"
              alt={project.title}
            />
            <h4 className="text-[1.2rem] text-white font-semibold mt-6">
              {project.title}
            </h4>
            <p className="mt-4 text-[0.9rem] text-body max-w-[80%] line-clamp-3">
              {project.description}
            </p>
            <button className="w-full py-2 text-black text-base font-medium bg-main rounded-full mt-6 transition-all duration-200 transform will-change-transform">
              View Details
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection3;