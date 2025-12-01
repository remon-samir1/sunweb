"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState } from "react";
import Axios from "../lib/Axios";

const ContactSection2 = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const boxesData = [
    {
      icon: "mdi:address-marker",
      title: "Location",
      disc: "Location Puputan Renon East ST. 1190 Denpasar, Bali",
    },
    {
      icon: "solar:phone-bold",
      title: "Phone",
      disc: "Just Call On This Number(+62) 123-321-543",
    },
    {
      icon: "mdi:email",
      title: "Email",
      disc: "Sunmed@support.com Sunmed@production.com",
    },
    {
      icon: "streamline:web",
      title: "Website",
      disc: "Contact with us in our website Sunmedagency.com",
    },
  ];

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast("Please fill in all required fields", "error");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("Please enter a valid email address", "error");
      setLoading(false);
      return;
    }

    // Phone validation (optional field, but validate if provided)
    if (formData.phone) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        showToast("Please enter a valid phone number", "error");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await Axios.post("contacts", {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone, // Added phone field
        subject: formData.subject,
        message: formData.message
      });

      console.log("Contact form submitted:", response.data);
      showToast("Your message has been sent successfully! We'll get back to you soon.", "success");

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

    } catch (err) {
      console.error("Error submitting contact form:", err);
      const errorMessage = err.response?.data?.message || "Failed to send message. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-[60] p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
          toast.type === "success" 
            ? "bg-green-500 text-white border-l-4 border-green-400" 
            : "bg-red-500 text-white border-l-4 border-red-400"
        }`}>
          <div className="flex items-center gap-3">
            {toast.type === "success" ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="px-[5%] py-20 flex md:flex-row flex-col items-start gap-12">
        <div className="flex-1">
          <p className="text-[1.1rem] font-medium text-main">Get In Touch</p>
          <h3 className="text-[1.9rem] mt-4 font-semibold text-white">
            Got Any Questions​
          </h3>
          <p className="text-body text-base mt-4 max-w-[500px]">
            Lorem ipsum dolor sit amet consectetur. Tincidunt egestas ullamcorper
          </p>
          <div className="grid mt-8 grid-cols-2 grid-rows-2 gap-5">
            {boxesData.map((data, index) => (
              <div
                style={{
                  background:
                    "linear-gradient(180deg , rgba(193, 97, 201, 0.15) -16.04%, rgba(0, 0, 0, 0) 100%), rgba(39, 40, 75, 0.3)",
                }}
                key={index}
                className="p-5 border md:rounded-lg rounded-2xl border-stroke hover:border-main transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  <Icon
                    icon={data.icon}
                    width="36"
                    height="36"
                    style={{ color: "#fff" }}
                  />
                  <h4 className="text-base font-semibold text-white">
                    {data.title}
                  </h4>
                </div>
                <p className="md:text-[0.9rem] text-[0.8rem] text-body mt-3">
                  {data.disc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px] grid gap-3">
              <label htmlFor="name" className="text-base text-white font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="border border-main rounded-3xl text-white outline-none focus:border-white p-3 bg-transparent placeholder-gray-400 transition-colors duration-200"
                required
                disabled={loading}
              />
            </div>
            <div className="flex-1 min-w-[250px] grid gap-3">
              <label htmlFor="email" className="text-base text-white font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                className="border border-main rounded-3xl text-white outline-none focus:border-white p-3 bg-transparent placeholder-gray-400 transition-colors duration-200"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Phone Number Input - Added */}
          <div className="flex items-center gap-4 flex-wrap mt-4">
            <div className="flex-1 min-w-[250px] grid gap-3">
              <label htmlFor="phone" className="text-base text-white font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="border border-main rounded-3xl text-white outline-none focus:border-white p-3 bg-transparent placeholder-gray-400 transition-colors duration-200"
                disabled={loading}
              />
            </div>
            <div className="flex-1 min-w-[250px] grid gap-3">
              <label htmlFor="subject" className="text-base text-white font-medium">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="border border-main rounded-3xl text-white outline-none focus:border-white p-3 bg-transparent placeholder-gray-400 transition-colors duration-200"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="w-full mt-4 grid gap-3">
            <label htmlFor="message" className="text-base text-white font-medium">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              placeholder="Your message"
              value={formData.message}
              onChange={handleChange}
              className="border border-main h-44 text-white outline-none focus:border-white rounded-3xl p-3 bg-transparent placeholder-gray-400 resize-none transition-colors duration-200"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`text-base font-medium rounded-3xl p-3 w-full text-center mt-6 transition-all duration-200 flex items-center justify-center gap-2 ${
              loading 
                ? "bg-gray-500 text-gray-300 cursor-not-allowed" 
                : "bg-main text-black hover:bg-main/90 hover:scale-105 transform"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Message...
              </>
            ) : (
              <>
                <Icon icon="mdi:send" width="20" height="20" />
                Send Message
              </>
            )}
          </button>

          <p className="text-gray-400 text-sm mt-4 text-center">
            <span className="text-red-500">*</span> Required fields
          </p>
        </form>
      </div>

      <div className="w-[90%] h-[470px] mx-auto my-20">
        <Image
          src="/map.png"
          height={470}
          alt="contact us"
          width={200}
          className="w-full h-full object-cover rounded-lg md:rounded-none"
        />
      </div>
    </>
  );
};

export default ContactSection2;