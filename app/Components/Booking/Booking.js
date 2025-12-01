"use client"
import Axios from "@/app/lib/Axios";
import React, { useState } from "react";

const Booking = ({ modal, setModal  , id}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatssapp: "",
    phone: "",
    message: "",
  });
  const [files, setFiles] = useState([]);
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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("project_id", id);
      formDataToSend.append("type", "booking");

      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone_number", formData.phone);
      formDataToSend.append("whatsapp_number", formData.whatssapp);
      formDataToSend.append("idea", formData.message);
      
      files.forEach((file) => {
        formDataToSend.append("files[]", file);
      });

      const response = await Axios.post("package-requests", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log(response.data);
      showToast("Your request has been submitted successfully!", "success");
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        whatssapp: "",
        message: "",
      });
      setFiles([]);
      
      // Reset file input
      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";
      
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

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 z-[999999] left-4  p-4 rounded-lg shadow-lg transition-all duration-300 ${
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999]">
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
              <input
                type="tel"
                name="whatssapp"
                placeholder="Whatsapp number"
                value={formData.whatssapp}
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

              {/* File Upload Section */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-300 mb-1">
                  Attach Files (Optional)
                </label>
                
                <div className="flex flex-col gap-2">
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-medium
                      file:bg-main/20 file:text-white
                      hover:file:bg-main/30
                      cursor-pointer
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  />
                  
                  {/* File Preview */}
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                      {files.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between bg-white/5 p-2 rounded"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-300 truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-red-400 p-1"
                            disabled={loading}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Supported files: images, documents, PDFs, etc.
                  </p>
                </div>
              </div>

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

export default Booking;