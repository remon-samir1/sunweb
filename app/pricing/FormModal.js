"use client"
import React, { useState } from "react";
import Axios from "../lib/Axios";

const ModalForm = ({ modal, selectedPlanId, setModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await Axios.post("package-requests", {
        plan_id: selectedPlanId,
        name: formData.name,
        type: "plan",
        email: formData.email,
        phone_number: formData.phone,
        idea: formData.message
      });
      
      console.log(response.data);
      showToast("Your request has been submitted successfully!", "success");
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      
      // Close modal after a short delay
      setTimeout(() => {
        setModal(false);
      }, 1500);
      
    } catch (err) {
      console.log(err);
      showToast("Failed to submit your request. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 left-4 z-[60] p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === "success" 
            ? "bg-green-500 text-white" 
            : "bg-red-500 text-white"
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background2 w-[90%] max-w-md p-6 rounded-xl shadow-lg relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl transition-colors"
              disabled={loading}
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4 text-white">
              Contact Form
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border border-stroke p-3 bg-white/5 text-white rounded-lg focus:ring-2 focus:ring-main focus:border-transparent outline-none placeholder-gray-400"
                required
                disabled={loading}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border border-stroke p-3 bg-white/5 text-white rounded-lg focus:ring-2 focus:ring-main focus:border-transparent outline-none placeholder-gray-400"
                required
                disabled={loading}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="border border-stroke p-3 bg-white/5 text-white rounded-lg focus:ring-2 focus:ring-main focus:border-transparent outline-none placeholder-gray-400"
                required
                disabled={loading}
              />

              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="border border-stroke p-3 bg-white/5 text-white rounded-lg h-24 resize-none focus:ring-2 focus:ring-main focus:border-transparent outline-none placeholder-gray-400"
                required
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className={`py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  loading 
                    ? "bg-gray-500 cursor-not-allowed" 
                    : "bg-main text-black hover:bg-main/90"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalForm;