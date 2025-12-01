"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Footer.css";
import Logo from "../Logo/Logo";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { FaPhone, FaLocationDot, FaEarthAmericas } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

// GSAP
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Axios from "@/app/lib/Axios";
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const footerRef = useRef(null);

  // Fetch services from API
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Axios.get('/layout-editors');
        setData(response.data.data[0].identity_contact);
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

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-title", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".footer-col", {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 70%",
        },
      });
    }, footerRef);

    return () => ctx.revert();
  });

  const Links = [
    { name: "Home", link: "/" },
    { name: "About us", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Blog", link: "/blog" },
    { name: "Projects", link: "/projects" },
    { name: "Pricing Plan", link: "/pricing" },
    { name: "Contact us", link: "/contact" },
  ];

  // Skeleton loader for services
  const ServicesSkeleton = () => (
    <div className="mt-6">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex mt-3 items-center gap-2 animate-pulse">
          <div className="w-5 h-5 bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-600 rounded w-32"></div>
        </div>
      ))}
    </div>
  );

  return (
    <footer ref={footerRef} className="footer px-[5%] py-5 mt-10 md:mt-0">
      <div className="text-center">
        <h2 className="footer-title text-white font-bold text-5xl md:text-8xl md:border-b-8 border-b-4 border-b-white py-2 w-max mx-auto ">
          Get In touch
        </h2>
      </div>

      <div className="flex items-start md:flex-row flex-col md:gap-5 gap-8 justify-between mt-16 flex-wrap">
        {/* first col */}
        <div className="footer-col flex-1 flex flex-col justify-start min-w-[250px]">
          <Logo />
          <p
            style={{ lineHeight: "25px" }}
            className="mt-6 text-white font-light text-[0.9rem]"
          >
            Sunmed Web Solution is a digital agency that provides creative and
            modern web solutions. We design and develop websites and platforms
            tailored to help businesses enhance their online presence and
            achieve growth
          </p>
          <div className="flex mt-6 items-center gap-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
              <div
                key={i}
                className="w-9 h-9 hover:bg-main cursor-pointer duration-300 flex justify-center items-center rounded-full bg-glass"
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Links col */}
        <div className="footer-col flex-1">
          <h3 className="text-white text-[1.3rem] font-semibold">Quick Links</h3>
          <div className="mt-6">
            {Links.map((data, key) => (
              <Link key={key} className="flex mt-3 items-center gap-2 group" href={data.link}>
                <IoIosArrowBack className="text-main w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                <span className="text-white text-base font-medium group-hover:text-main transition-colors duration-200">
                  {data.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Services col */}
        <div className="footer-col flex-1">
          <h3 className="text-white text-[1.3rem] font-semibold">Services</h3>
          {loading ? (
            <ServicesSkeleton />
          ) : (
            <div className="mt-6">
              {services.length > 0 ? (
                services.map((service, key) => (
                  <Link 
                    key={service.id} 
                    className="flex mt-3 items-center gap-2 group" 
                    href={`/services/${service.slug}`}
                  >
                    <IoIosArrowBack className="text-main w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                    <span className="text-white text-base font-medium group-hover:text-main transition-colors duration-200">
                      {service.name}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 mt-3">No services available</p>
              )}
            </div>
          )}
        </div>
        {/* Services col */}
        <div className="footer-col flex-1">
          <h3 className="text-white text-[1.3rem] font-semibold">Contacts</h3>
          {loading ? (
            <ServicesSkeleton />
          ) : (
            <div className="mt-6">
              {data?.length > 0 ? (
                data.map((contact, key) => (
                  <div 
                    
                  >
                    <img src={contact.icon} className=" w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                    <span className="text-white text-base font-medium group-hover:text-main transition-colors duration-200">
                      {contact.name}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 mt-3">No contacts available</p>
              )}
            </div>
          )}
        </div>

      

        {/* Newsletter col */}
        <div className="footer-col flex-1">
          <h3 className="text-white text-[1.3rem] font-semibold">Join newsletter</h3>
          <div className="mt-6">
            <Image src="/news.png" alt="news" width={119} height={39} />
            <div className="flex items-center gap-2 bg-glass h-14 mt-8 rounded-lg border border-stroke hover:border-main transition-colors duration-200">
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent ml-4 text-white flex-1 outline-none border-none placeholder-gray-400"
              />
              <button className="bg-main px-6 py-2 hover:bg-main/90 rounded-md mr-4 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-stroke mt-12 pt-6 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Sunmed Web Solution. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

