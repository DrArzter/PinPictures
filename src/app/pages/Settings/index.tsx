"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/app/contexts/UserContext";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { motion } from "framer-motion";

import { User } from "@/app/types/global";
import patchUser from "@/app/api/updateUser";

interface SettingsProps {
  windowHeight: number;
  windowWidth: number;
}

export default function Settings({ windowHeight, windowWidth }: SettingsProps) {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUserContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(
    user?.uiBgPicPath || null
  );
  const [color, setColor] = useState("#ffffff");
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [changeUiBGVisible, setChangeUiBGVisible] = useState(false);
  const [alpha, setAlpha] = useState(1);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlpha(Number(e.target.value)); // Ensure value is treated as a number
  };

  useEffect(() => {
    setLoading(false);
  }, [user]);

  // Обработчик для изменения фона UI
  const handleSubmitUIBGChange = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Приведение типа, чтобы TypeScript знал, что event.target — это HTMLFormElement
    const fileInput = event.target instanceof HTMLFormElement
      ? (event.target.elements[0] as HTMLInputElement) // Извлекаем первый элемент формы
      : null;
      
    const file = fileInput?.files?.[0];
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

  // Обработчик для изменения цвета UI
  const handleSubmitColorChange = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
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

  // Обработчик для выбора нового изображения
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Безопасное извлечение файла
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

  const containerStyle: React.CSSProperties = {
    width: windowWidth - 10,
    height: windowHeight - 55,
    overflowY: "auto", // Это допустимо как строка
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
              onSubmit={handleSubmitUIBGChange} // onSubmit используется для формы
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
                type="submit" // Кнопка отправляет форму, активируя onSubmit
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
                      const target = e.target as HTMLElement;
                      target.parentElement?.querySelector("input")?.click();
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
                  type="submit"
                  className="w-24 py-2 rounded-3xl bg-lime-500"
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
