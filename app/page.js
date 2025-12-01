"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Navbar from "./Components/Navbar/Navbar";
import Image from "next/image";
import "./Home.css";
import { useGSAP } from "@gsap/react";
import About from "./About";
import Portfolio from "./Portfolio";
import Contact from "./Contact";
import LatestProjects from "./LatestProjects";
import Testmonials from "./Testmonials";
import Footer from "./Components/Footer/Footer";
import Link from "next/link";
import Axios from "./lib/Axios";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState(0);
  
  const svgRef = useRef();
  const headingRef = useRef();
  const textRef = useRef();
  const buttonsRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Axios.get('/layout-editors');
        setData(response.data.data[0]);
        console.log(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setSize((85 / 100) * window.innerWidth);
      };

      setSize((window.innerWidth * 100) / 90);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useGSAP(() => {
    if (loading) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Only hide animated elements initially, not the entire content
    const headingWords = headingRef.current?.querySelectorAll(".word");
    const buttons = buttonsRef.current?.children;

    if (headingWords) {
      gsap.set(headingWords, { opacity: 0, y: 50 });
    }
    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0, y: 30 });
    }
    if (buttons) {
      gsap.set(buttons, { opacity: 0, y: 20, scale: 0.8 });
    }

    // Staggered word animation
    if (headingWords && headingWords.length > 0) {
      tl.to(headingWords, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        rotate: 0,
      });
    }

    // Text animation
    if (textRef.current) {
      tl.to(
        textRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
        },
        "-=0.5"
      );
    }

    // Button animation
    if (buttons && buttons.length > 0) {
      tl.to(
        buttons,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          scale: 1,
        },
        "-=0.3"
      );
    }

    // SVG path drawing animation
    const path = svgRef.current?.querySelector("path");
    if (path) {
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        stroke: "#54EECC",
        strokeWidth: 2,
        fill: "transparent",
      });

      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 1.8,
        },
        "-=0.2"
      )
        .to(
          path,
          {
            fill: "#54EECC",
            duration: 0.8,
          },
          "-=0.5"
        )
        .to(path, {
          strokeWidth: 0,
          duration: 0.5,
        });
    }

    // Button hover animations
    const buttonElements = buttonsRef.current?.querySelectorAll("button") || [];

    buttonElements.forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          boxShadow: "0 0 15px #54EECC",
          duration: 0.3,
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          boxShadow: "none",
          duration: 0.3,
        });
      });
    });

    return () => {
      buttonElements.forEach((btn) => {
        btn.removeEventListener("mouseenter", () => {});
        btn.removeEventListener("mouseleave", () => {});
      });
    };
  }, [loading]);

  // Skeleton Loader Component
  const SkeletonHero = () => (
    <div className="home pt-[20vh] max-w-[100vw] overflow-hidden">
      {/* Heading Skeleton */}
      <div className="flex justify-center px-4">
        <div className="max-w-[900px] w-full text-center">
          <div className="h-16 bg-gray-700 rounded mb-4 mx-auto w-3/4 animate-pulse"></div>
          <div className="h-16 bg-gray-700 rounded mb-4 mx-auto w-4/5 animate-pulse"></div>
          <div className="h-16 bg-gray-700 rounded mx-auto w-2/3 animate-pulse"></div>
        </div>
      </div>

      {/* Text Skeleton */}
      <div className="mt-8 max-w-[700px] mx-auto px-4">
        <div className="h-4 bg-gray-700 rounded mb-3 w-full animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded mb-3 w-5/6 mx-auto animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6 mx-auto animate-pulse"></div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex items-center justify-center md:flex-row flex-col gap-3 mt-8 w-full px-4">
        <div className="h-12 bg-gray-700 rounded-3xl w-[90%] md:w-40 animate-pulse"></div>
        <div className="h-12 bg-gray-700 rounded-3xl w-[90%] md:w-40 animate-pulse"></div>
      </div>

      {/* SVG Skeleton */}
      <div className="mt-8 flex justify-center">
        <div className="h-32 bg-gray-700 rounded w-full max-w-[1250px] mx-4 animate-pulse"></div>
      </div>
    </div>
  );

  // Split heading text into words
  const headingLines = data?.hero_title ? [data.hero_title] : ["Innovative Web Solutions for a Smarter Digital Future"];

  if (loading) {
    return (
      <>
        <Navbar />
        <SkeletonHero />
        {/* Show other components but in skeleton state */}
        <div className="opacity-70">
          <About />
          <Portfolio />
          <Contact />
          <LatestProjects />
          <Testmonials />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="home pt-[20vh] max-w-[100vw] overflow-hidden" ref={containerRef}>
        {/* Heading - Always visible, only words are animated */}
        <h3
          ref={headingRef}
          className="text-4xl md:leading-[70px] leading-[50px] px-4 md:text-5xl font-semibold max-w-[900px] text-white text-center mx-auto"
        >
          {headingLines.map((line, i) => (
            <div key={i} className="line">
              {line.split(" ").map((word, j) => (
                <span key={j} className="word inline-block">
                  {word}&nbsp;
                </span>
              ))}
            </div>
          ))}
        </h3>

        {/* Text - Will be animated but visible in DOM */}
        <p
          ref={textRef}
          style={{ lineHeight: "30px", marginTop: "20px" }}
          className="text-center text-[#D1D5DB] text-[1.1rem] mx-auto max-w-[90%] md:max-w-[700px]"
        >
          {data?.hero_description || "Building modern web solutions that drive your business forward with cutting-edge technology and innovative design."}
        </p>

        {/* Buttons - Will be animated but visible in DOM */}
        <div
          ref={buttonsRef}
          style={{ margin: "25px 0" }}
          className="flex items-center justify-center md:flex-row flex-col gap-3 mt-5 w-full"
        >
          <Link
            href={`${data?.hero_primary_button_link || "#"}`}
            className="font-semibold md:py-2 py-3 px-5 cursor-pointer md:w-max w-[90%] text-center text-black bg-white rounded-3xl md:rounded border border-white transition-colors hover:bg-transparent hover:text-white"
          >
            {data?.hero_primary_button_text || "Get Started"}
          </Link>
          <Link 
            href={`${data?.hero_secondry_button_link || "#"}`}
            className="font-semibold md:py-2 py-3 px-5 cursor-pointer md:w-max w-[90%] text-center bg-transparent text-white rounded-3xl md:rounded border border-white transition-colors hover:bg-white hover:text-black"
          >
            {data?.hero_secondery_button_text || "Learn More"}
          </Link>
        </div>

        {/* SVG - Always visible, only path is animated */}
        <svg
          ref={svgRef}
          width={size}
          height="140"
          viewBox="0 0 1250 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_40_940)">
            <path
              d="M1233 123C1118.56 81.0704 887.92 15.7474 603.695 17.0183C328.388 18.2461 130.543 81.3936 17 123C150.481 86.7357 360.96 46.4002 603.695 42.8675C880.737 38.8393 1090.83 84.3985 1233 123Z"
              fill="transparent"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_40_940"
              x="0.4"
              y="0.4"
              width="1249.2"
              height="139.2"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0  0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="8.3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
              />
              <feBlend
                mode="hard-light"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_40_940"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_40_940"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
      
      {/* Always show other components - they handle their own loading states */}
      <About />
      <Portfolio />
      <Contact />
      <LatestProjects />
      <Testmonials />
      <Footer />
    </>
  );
}