import React, { useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { createPost } from "@/app/api";
import { motion } from "framer-motion";

export default function CreatePost({ windowHeight }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPost({ name, description, images });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert("Максимум 10 изображений");
      return;
    }

    setImages((prevImages) => [...prevImages, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prevPreviews) => [...prevPreviews, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index, e) => {
    e.stopPropagation();
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length + images.length > 10) {
      alert("Максимум 10 изображений");
      return;
    }

    setImages((prevImages) => [...prevImages, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prevPreviews) => [...prevPreviews, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const isSubmitDisabled = !name || !description || images.length === 0 || loading;

  const imagesContainerMaxHeight = windowHeight * 0.4;

  return (
    <div
      className="flex flex-col w-full max-w-2xl bg-white bg-opacity-20 rounded-3xl shadow-xl p-8 mt-4 overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      style={{ maxHeight: `${windowHeight - 50}px` }}
    >
      <motion.h1
        className="text-4xl font-extrabold text-center mb-8 text-white drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Create Post
      </motion.h1>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-lg font-medium mb-2 text-white">Post title</label>
          <motion.input
            type="text"
            placeholder="Enter post title..."
            className="w-full p-4 border border-transparent rounded-xl focus:outline-none transition duration-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2 text-white">Post description</label>
          <motion.textarea
            placeholder="Enter post description..."
            className="w-full p-4 border border-transparent rounded-xl resize-none focus:outline-none transition duration-300"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div>
          <div
            className="w-full p-6 border-4 border-dashed border-white rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-10 transition duration-300"
            onClick={handleFileInputClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{ maxHeight: `${imagesContainerMaxHeight}px`, overflowY: "auto" }}
          >
            <AiOutlineCloudUpload className="text-white text-6xl mb-4" />
            <p className="text-white">Перетащите изображения сюда или нажмите для выбора файлов</p>
            <p className="text-sm text-white mt-2">({images.length}/10)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />

            {imagePreviews.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-32 h-32 object-cover rounded-xl transform group-hover:scale-105 transition duration-300"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleRemoveImage(index, e)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-75 hover:opacity-100 transition duration-300"
                    >
                      <MdClose size={20} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
        <motion.button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full py-4 rounded-xl text-white font-semibold transition-colors duration-300 ${
            isSubmitDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          }`}
          whileHover={!isSubmitDisabled ? { scale: 1.02 } : {}}
          whileTap={!isSubmitDisabled ? { scale: 0.98 } : {}}
          transition={{ duration: 0.2 }}
        >
          {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Publish"}
        </motion.button>
      </form>
    </div>
  );
}
