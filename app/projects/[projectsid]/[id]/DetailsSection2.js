"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Details.css";
import "react-image-gallery/styles/css/image-gallery.css";
import ReactImageGallery from "react-image-gallery";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Axios from "@/app/lib/Axios";
import Booking from "@/app/Components/Booking/Booking";

gsap.registerPlugin(ScrollTrigger);

const DetailsSection2 = () => {
  const { id } = useParams();
  const [modal , setModal] = useState(false)
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await Axios.get(`/projects/${id}`);
        setProject(response.data.data);
        console.log(response.data.data);
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const imageRef = useRef(null);
  const textRef = useRef(null);
  const titlesRef = useRef(null);
  const itemRef = useRef(null);

  useGSAP(() => {
    if (loading || !project) return;

    const animateFromLeft = gsap.from(imageRef.current, {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top 80%",
      },
    });

    const animateFromRight = gsap.from(textRef.current, {
      x: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%",
      },
    });

    const animateTitles = gsap.from(titlesRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: titlesRef.current,
        start: "top 90%",
      },
    });

    const animateItems = gsap.from(itemRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: itemRef.current,
        start: "top 90%",
      },
    });

    return () => {
      animateFromLeft.kill();
      animateFromRight.kill();
      animateTitles.kill();
      animateItems.kill();
    };
  }, [loading, project]);

  // Prepare images for gallery
  const images = project?.images?.length > 0 
    ? project.images.map((url) => ({
        original: url,
        thumbnail: url,
      }))
    : [{ original: "/placeholder-image.jpg", thumbnail: "/placeholder-image.jpg" }];

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="DevelopmentProjectDetails px-[7vw] py-7">
      <div className="content">
        {/* Image Gallery Skeleton */}
        <div className="img md:!w-[60%] animate-pulse">
          <div className="h-96 bg-gray-700 rounded-lg"></div>
          <div className="flex gap-2 mt-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded flex-1"></div>
            ))}
          </div>
        </div>

        {/* Text Content Skeleton */}
        <div className="text !flex-1">
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>

          {/* Buttons Skeleton */}
          <div className="flex flex-col mt-3 gap-2">
            <div className="h-12 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Attributes Skeleton */}
          <div className="details mt-6">
            <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
            <div className="container">
              <div className="titles">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded w-20 mb-2 animate-pulse"></div>
                ))}
              </div>
              <div className="item">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="discription mt-8">
        <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Error State
  if (error) {
    return (
      <div className="DevelopmentProjectDetails px-[7vw] py-7">
        <div className="text-center py-20">
          <h3 className="text-2xl text-white font-semibold mb-4">Project Not Found</h3>
          <p className="text-body mb-6">{error}</p>
          <Link 
            href="/projects" 
            className="bg-main text-black px-6 py-3 rounded font-semibold hover:bg-main/80 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return <SkeletonLoader />;
  }

  // Project not found state
  if (!project) {
    return (
      <div className="DevelopmentProjectDetails px-[7vw] py-7">
        <div className="text-center py-20">
          <h3 className="text-2xl text-white font-semibold mb-4">Project Not Found</h3>
          <p className="text-body mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/projects" 
            className="bg-main text-black px-6 py-3 rounded font-semibold hover:bg-main/80 transition-colors"
          >
            Browse All Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="DevelopmentProjectDetails px-[7vw] py-7">
      {
        modal && <Booking modal={modal} id={project.id} setModal={setModal}/>
      }
      <div className="content">
        <div className="img md:!w-[60%]" ref={imageRef}>
          <ReactImageGallery
            items={images}
            showBullets={false}
            showPlayButton={false}
          />
        </div>

        <div className="text !flex-1" ref={textRef}>
          <h3 className="uppercase max-w-[394px]">{project.title}</h3>
          <p className="!text-body">By {project.client_name || "Sunmed agency"}</p>

          <div className="flex flex-col mt-3">
            {project.project_url && (
              <a 
                target="_blank" 
                rel="noopener noreferrer"
                href={project.project_url} 
                className="button hover-main duration-200"
              >
                <Icon 
                  icon="pajamas:eye" 
                  width="22" 
                  height="22"
                  className="text-black"
                />
                <span>Live preview</span>
              </a>
            )}
            <button onClick={()=>setModal(true)} className="button hover-main duration-200">
              <Icon
                icon="material-symbols-light:book-outline"
                width="30"
                height="30"
                className="text-black"
              />
              <span>Book now</span>
            </button>
          </div>

          <div className="details">
            <h4>Attributes</h4>
            <div className="container">
              <div className="titles" ref={titlesRef}>
                {project.attributes?.map((data, index) => (
                  <span key={index}>{data.key}</span>
                )) || (
                  <>
                    <span>Technology</span>
                    <span>Duration</span>
                    <span>Client</span>
                  </>
                )}
              </div>
              <div className="item" ref={itemRef}>
                {project.attributes?.map((data, index) => (
                  <span key={index}>{data.value}</span>
                )) || (
                  <>
                    <span>{project.technology || "Not specified"}</span>
                    <span>{project.duration || "Not specified"}</span>
                    <span>{project.client_name || "Not specified"}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="discription">
        <h3>Descriptions</h3>
        {project.description ? (
          <div dangerouslySetInnerHTML={{ __html: project.description }} />
        ) : (
          <p>
            No description available for this project. Lorem ipsum dolor sit amet consectetur. 
            Urna neque nibh pretium hac eu turpis posuere. Erat sem adipiscing non vitae lacus 
            pellentesque justo est. Non eu eu aliquet cras in a.
          </p>
        )}
      </div>
    </div>
  );
};

export default DetailsSection2;