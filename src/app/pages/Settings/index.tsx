"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/app/contexts/UserContext";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { motion } from "framer-motion";

import patchUser from "@/app/api/updateUser";

export default function Settings({ windowHeight, windowWidth }) {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUserContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(
    user?.uiBgPicPath || null
  );
  const [color, setColor] = useState("#ffffff");
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [changeUiBGVisible, setChangeUiBGVisible] = useState(false);
  const [alpha, setAlpha] = useState(1);

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleAlphaChange = (e) => {
    setAlpha(e.target.value);
  };

  useEffect(() => {
    setLoading(false);
  }, [user]);

  const handleSubmitUIBGChange = async (event) => {
    event.preventDefault();
    const file = event.target[0]?.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "uiBgUpdate");

    const response = await patchUser(formData);
    if (response) {
      setUser(response.user);
      setSelectedImage(response.user.uiBackground);
    }
  };

  const handleSubmitColorChange = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const colorWithAlpha = `${color}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
    formData.append("type", "uiColorUpdate");
    formData.append("hex", colorWithAlpha);
    const response = await patchUser(formData);
    if (response) {
      setUser(response.user);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    document.getElementById("fileInput")?.click();
  };

  const containerStyle = {
    width: windowWidth - 10,
    height: windowHeight - 55,
    overflowY: "auto",
  };

  return (
    <>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div
          style={containerStyle}
          className="flex flex-col items-center justify-center scrollbar-hidden p-6 gap-6 rounded-xl shadow-lg"
        >
          <h1 className="text-3xl font-bold text-center mb-4">Settings</h1>
          <div>
            <p>User ID: {user?.id}</p>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
          </div>

          <button
            onClick={() => setChangeUiBGVisible(!changeUiBGVisible)}
            className="border-2 border-dashed border-gray-400 px-4 py-2 rounded-3xl"
          >
            Change UI Background
          </button>

          {changeUiBGVisible && (
            <form
              className="flex flex-row items-center justify-center gap-2 w-full"
              onSubmit={handleSubmitUIBGChange}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div
                onClick={triggerFileSelect}
                className="w-64 h-40 border-2 border-dashed border-gray-400 flex justify-center items-center cursor-pointer"
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-500">
                    Click to select an image
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-24 py-2 rounded-3xl bg-lime-500"
              >
                Save
              </button>
            </form>
          )}

          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-row gap-4 items-center">
              <button
                className="border-2 border-dashed border-gray-400 px-4 py-2 rounded-3xl"
                onClick={() => setColorPickerVisible(!colorPickerVisible)}
              >
                Select background color
              </button>
            </div>
            {colorPickerVisible && (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-white rounded-lg shadow-lg flex items-center space-x-4"
              >
                <div className="relative inline-block">
                  <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="absolute opacity-0 w-0 h-0 top-14"
                  />
                  <div
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.target.parentElement.querySelector("input").click();
                    }}
                    className="w-12 h-12 rounded-full border-none cursor-pointer shadow-xl hover:shadow-inner"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={alpha}
                    onChange={handleAlphaChange}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer appearance-none"
                    style={{
                      background: `linear-gradient(to right, ${color}00, ${color}FF)`,
                    }}
                  />
                  <span className="text-sm text-gray-500 mt-1">
                    Opacity: {(alpha * 100).toFixed(0)}%
                  </span>
                </div>
                <button
                  className="w-24 py-2 rounded-3xl bg-lime-500"
                  onClick={handleSubmitColorChange}
                >
                  Save
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
