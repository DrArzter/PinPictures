import React, { useEffect, useState, useCallback, useRef } from "react";
import { MdImageNotSupported } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";


import { IoTrashBin } from "react-icons/io5";

import * as postUtils from "@/app/utils/postUtils";
import { createPost } from "@/app/api";


export default function CreatePost() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const inputClass = `input w-5/6 rounded-md p-2 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:scale-110 text-lightModeText border-zinc-800`;

    const imageContainerClass = "w-5/6 flex flex-wrap gap-2 overflow-y-auto";

    const imagePreviewClass = "rounded-lg max-h-32";

    const removeImageButtonClass =
        "absolute top-2 right-2 bg-red-500 text-white rounded-md p-2 opacity-75 hover:opacity-100 transition-opacity duration-200";

    const fileInputButtonClass = `relative flex items-center justify-center w-5/6 p-6 rounded-lg cursor-pointer transition-colors duration-300 borderhover:bg-black hover:text-white text-lightModeText border-zinc-800`;

    async function handleSubmit(e) {
        e.preventDefault();
        
        createPost({ name, description, images })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }


    function handleImageChange(e) {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 10) {
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
    }

    function handleImageClick(index) {
        setFullScreenImage(imagePreviews[index]);
    }

    function handleRemoveImage(index) {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    }

    function handleFileInputClick() {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    return (
        <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full p-4">
            <h1 className="text-2xl font-bold text-center mb-4">Create Post</h1>
            <form className="flex flex-col items-center gap-4 w-full" onSubmit={handleSubmit}>
                <div className="w-full">
                    <label className="block text-sm mb-1">Post Name</label>
                    <input
                        type="text"
                        placeholder="Enter post name..."
                        className="w-full p-2 border rounded text-black"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="w-full">
                    <label className="block text-sm mb-1">Post Description</label>
                    <textarea
                        placeholder="Enter post description..."
                        className="w-full p-2 border rounded max-h-32 text-black"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <input
                    ref={fileInputRef}
                    id="imageInput"
                    type="file"
                    name="images"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                />
                <div className={imageContainerClass}>
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={preview}
                                alt={`Preview ${index}`}
                                className={imagePreviewClass}
                                onClick={() => handleImageClick(index)}
                            />
                            <button
                                type="button"
                                className={removeImageButtonClass}
                                onClick={() => handleRemoveImage(index)}
                            >
                                <MdImageNotSupported />
                            </button>
                        </div>
                    ))}
                </div>
                {images.length < 10 && (
                    <div className="w-full flex justify-center">
                        <div className={fileInputButtonClass} onClick={handleFileInputClick}>
                            <span>Click to select images (max {10 - images.length})</span>
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    className={`w-full py-2 rounded-3xl  ${images.length < 1 ? "cursor-not-allowed bg-gray-500" : "bg-red-500"} `}
                >
                    Create Post
                </button>
            </form>
        </div>
    );
}