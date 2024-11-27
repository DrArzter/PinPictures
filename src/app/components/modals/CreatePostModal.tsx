"use client";

import React, { useState, useRef, useCallback } from "react";
import { MdClose } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { createPost } from "@/app/api";
import { motion } from "framer-motion";
import { ApiResponse, NewPost } from "@/app/types/global";

interface CreatePostModalProps {
  onClose: () => void;
}

const CreatePostModal = React.memo(({ onClose }: CreatePostModalProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<
    (string | ArrayBuffer | null)[]
  >([]);
  const { addNotification } = useNotificationContext();
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Обработчик отправки формы
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault(); // Остановить стандартное действие формы
      setLoading(true);

      let response: ApiResponse<NewPost> | undefined;

      try {
        response = await createPost({ name, description, images });
      } catch (err) {
        console.error(err);
        addNotification({
          status: "error",
          message: "An error occurred",
          time: 5000,
          clickable: false,
        });
      } finally {
        setLoading(false);
        if (response) {
          console.log(response.data.data);
          addNotification({
            status: response.status,
            message: response.message,
            link_to: `/post/${response.data.data}`,
            time: 5000,
            clickable: true,
          });
          if (response.status === "success") {
            setName("");
            setDescription("");
            setImages([]);
            setImagePreviews([]);
            onClose();
          }
        }
      }
    },
    [name, description, images, addNotification, onClose]
  );

  // Обработчик добавления изображений
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length + images.length > 10) {
        alert("Maximum of 10 images allowed");
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
    },
    [images]
  );

  // Обработчик удаления изображения
  const handleRemoveImage = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
      setImagePreviews((prevPreviews) =>
        prevPreviews.filter((_, i) => i !== index)
      );
    },
    []
  );

  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length + images.length > 10) {
        alert("Maximum of 10 images allowed");
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
    },
    [images]
  );

  const isSubmitDisabled =
    !name || !description || images.length === 0 || loading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-lightModeBackground dark:bg-darkModeBackground rounded-3xl p-6 relative w-11/12 max-w-3xl overflow-y-auto scrollbar-hidden">
        <button
          onClick={onClose}
          className="absolute z-[999] top-4 right-4 text-darkModeText dark:text-darkModeSecondaryText hover:text-darkModeSecondaryText"
          aria-label="Close Modal"
        >
          <MdClose size={34} />
        </button>
        <motion.h1
          className="text-4xl font-extrabold text-center mb-8 light:lightModeText dark:darkModeText drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Create Post
        </motion.h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-medium mb-2 light:lightModeText dark:darkModeText">
              Post title
            </label>
            <motion.input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter post title..."
              className="w-full p-4 border border-lightModeBorder dark:border-darkModeBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2 light:lightModeText dark:darkModeText">
              Post description
            </label>
            <motion.textarea
              placeholder="Enter post description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 border border-lightModeBorder dark:border-darkModeBorder rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div>
            <div
              className="w-full p-6 border-4 border-dashed border-lightModeBorder dark:border-darkModeBorder rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-lightModeSecondaryBackground dark:hover:bg-darkModeSecondaryBackground transition duration-300"
              onClick={handleFileInputClick}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <AiOutlineCloudUpload className="text-lightModeText dark:text-darkModeText text-6xl mb-4" />
              <p className="text-lightModeText dark:text-darkModeText">
                Drag and drop images here or click to select files
              </p>
              <p className="text-sm text-lightModeSecondaryText dark:text-darkModeSecondaryText mt-2">
                ({images.length}/10)
              </p>
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
                        src={preview as string}
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
            {loading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              "Publish"
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
});

export default CreatePostModal;
