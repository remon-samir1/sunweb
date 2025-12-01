"use client";

import Axios from "@/app/lib/Axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Logo = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await Axios.get('/layout-editors');
        
        if (response.data?.data?.[0]) {
          setData(response.data.data[0]);
        } else {
          throw new Error("No data received");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load logo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show skeleton/placeholder while loading
  if (isLoading) {
    return (
      <div className="w-[9rem] h-[2.7rem] bg-gray-200 animate-pulse rounded-md" />
    );
  }

  // Show fallback if error or no image
  if (error || !data?.identity_image) {
    return (
      <Link href="/" className="w-[9rem] h-[2.7rem] flex items-center justify-center">
        <div className="text-lg font-bold text-gray-700">Sunweb</div>
      </Link>
    );
  }

  return (
    <Link href="/" className="w-[9rem] h-[2.7rem]  relative block">
      <img
        src={data.identity_image}
        alt="Sunmed"
        fill
        className="object-cover w-full h-full"
        priority

      />
    </Link>
  );
};

export default Logo;