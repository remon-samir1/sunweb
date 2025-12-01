"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Axios from "@/app/lib/Axios";

const BlogsDetailsSection4 = ({slug}) => {
  const [formData, setFormData] = useState({
    comment: "",
    name: "",
    email: "",
    phone: "", // Changed from website to phone
    saveInfo: false
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.comment || !formData.name || !formData.email) {
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

    // Phone validation (if provided)
    if (formData.phone) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        showToast("Please enter a valid phone number", "error");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await Axios.post("comments", {
        blog_id: slug, 
        content: formData.comment,
        name: formData.name,
     email: formData.email,
        phone_number: formData.phone, // Send phone instead of website
        save_info: formData.saveInfo
      });

      console.log("Comment submitted:", response.data);
      showToast("Your comment has been submitted successfully! It will appear after approval.", "success");

      // Reset form after successful submission
      setFormData({
        comment: "",
        name: "",
        email: "",
        phone: "",
        saveInfo: false
      });

    } catch (err) {
      console.error("Error submitting comment:", err);
      const errorMessage = err.response?.data?.message || "Failed to submit comment. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-[5%] py-20">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-[60] p-4 rounded-lg shadow-lg transition-all duration-300 ${
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

      <h4 className="text-main text-[1.1rem] font-semibold">Comment</h4>
      <h3 className="mt-4 text-white text-[2.5rem] font-semibold">
        Leave a Reply
      </h3>
      <p
        style={{ lineHeight: "30px" }}
        className="text-[1.1rem] text-body mt-4"
      >
        Your email address will not be published. Required fields are marked *
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mt-4 textarea-hover">
          <label
            className="text-white text-[1.1rem] font-medium"
            htmlFor="comment"
          >
            Comment*
          </label>
          <textarea 
            id="comment" 
            value={formData.comment}
            onChange={handleChange}
            disabled={loading}
            className="bg-background2 h-40 outline-none text-white p-4 text-[1rem] w-full mt-4 border-b border-stroke focus:border-main transition-colors duration-200 resize-none placeholder-gray-400"
            placeholder="Write your comment here..."
            required
          />
        </div>
        
        <div className="mt-4 input-hover">
          <label
            className="text-white text-[1.1rem] font-medium"
            htmlFor="name"
          >
            Name*
          </label>
          <input 
            type="text" 
            id="name" 
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            className="bg-background2 outline-none text-white p-4 text-[1rem] w-full mt-4 border-b border-stroke focus:border-main transition-colors duration-200 placeholder-gray-400"
            placeholder="Your name"
            required
          />
        </div>
        
        <div className="mt-4 input-hover">
          <label
            className="text-white text-[1.1rem] font-medium"
            htmlFor="email"
          >
            Email*
          </label>
          <input 
            type="email" 
            id="email" 
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className="bg-background2 outline-none text-white p-4 text-[1rem] w-full mt-4 border-b border-stroke focus:border-main transition-colors duration-200 placeholder-gray-400"
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        {/* Changed from Website to Phone */}
        <div className="mt-4 input-hover">
          <label
            className="text-white text-[1.1rem] font-medium"
            htmlFor="phone"
          >
            Phone Number
          </label>
          <input 
            type="tel" 
            id="phone" 
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            className="bg-background2 outline-none text-white p-4 text-[1rem] w-full mt-4 border-b border-stroke focus:border-main transition-colors duration-200 placeholder-gray-400"
            placeholder="Your phone number (optional)"
          />
        </div>
        
        <div className="mt-4 flex items-center gap-3">
          <input 
            type="checkbox" 
            id="saveInfo" 
            checked={formData.saveInfo}
            onChange={handleChange}
            disabled={loading}
            className="accent-main w-4 h-4"
          />
          <label
            className="text-body text-[1rem] font-medium"
            htmlFor="saveInfo"
          >
            Save my name, email, and phone in this browser for the next time I comment.
          </label>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={`text-[0.9rem] text-black py-3 font-medium px-12 rounded-full mt-6 transition-all duration-200 flex items-center justify-center gap-2 ${
            loading 
              ? "bg-gray-500 cursor-not-allowed" 
              : "bg-main hover:bg-main/90 hover:scale-105"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Post comment"
          )}
        </button>
      </form>
    </div>
  );
};

export default BlogsDetailsSection4;