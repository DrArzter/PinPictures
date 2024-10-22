"use client";

import React, { useEffect, useState } from "react";
import { TwitterPicker } from 'react-color';
import { useUserContext } from "@/app/contexts/userContext";
import LoadingIndicator from "@/app/components/LoadingIndicator";

import patchUser from "@/app/api/updateUser";



export default function Settings({ windowHeight, windowWidth }) {
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useUserContext();
    const [selectedImage, setSelectedImage] = useState<string | null>(user?.uiBgPicPath || null);
    const [color, setColor] = useState('#ffffff');
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [changeUiBGVisible, setChangeUiBGVisible] = useState(false);
  
    const handleChangeComplete = (color) => {
      setColor(color.rgb);
      console.log(color);
    };

    useEffect(() => {
        setLoading(false);
    }, [user]);

    const handleSubmitUIBGChange = async (event: any) => {
        event.preventDefault();
        const file = event.target[0]?.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", "uiBgUpdate");

        const response = await patchUser(formData);
        console.log(response);
        if (response) {
            setUser(response.user);
            setSelectedImage(response.user.uiBgPicPath);
        }
    };

    const handleSubmitColorChange = async (event: any) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("type", "uiColorUpdate");
        formData.append("r", color.r);
        formData.append("g", color.g);
        formData.append("b", color.b);
        formData.append("a", 0.3);
        const response = await patchUser(formData);
        if (response) {
            setUser(response.user);
        }
    }

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string); // Set the selected image as base64 URL
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileSelect = () => {
        document.getElementById("fileInput")?.click();
    };

    const ContainerStyle = {
        width: windowWidth - 10,
        height: windowHeight - 60,
        overflowY: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
    };

    return (
        <>
            {loading ? (
                <LoadingIndicator />
            ) : (
                <div style={ContainerStyle} className="flex flex-col items-center p-14 gap-4">
                    <h1 className="text-3xl font-bold text-center mb-4">Settings</h1>
                    <div>
                        <p>User ID: {user?.id}</p>
                        <p>Name: {user?.name}</p>
                        <p>Email: {user?.email}</p>
                    </div>

                    <button onClick={() => setChangeUiBGVisible(!changeUiBGVisible)} className="border-2 border-dashed border-gray-400 px-4 py-2 rounded-3xl">Change UI Background</button>

                    {
                        changeUiBGVisible && (<form className="flex flex-row items-center justify-center gap-2 w-full" onSubmit={handleSubmitUIBGChange}>
    
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
                                    <span className="text-gray-500">Click to select an image</span>
                                )}
                            </div>
    
                            <button
                                type="submit"
                                className="w-24 py-2 rounded-3xl bg-lime-500 "
                            >
                                Save
                            </button>
                        </form>)
                    }
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-4 items-center">
                            <button 
                            className="border-2 border-dashed border-gray-400 px-4 py-2 rounded-3xl"
                            onClick={() => setColorPickerVisible(!colorPickerVisible)}>Select background color</button>
                            {colorPickerVisible && <button className="w-24 py-2 rounded-3xl bg-lime-500"
                            onClick={handleSubmitColorChange}>Save</button>} 
                        </div>
                        {colorPickerVisible &&  <TwitterPicker color={color} onChangeComplete={handleChangeComplete} className="ml-4" />}
                    </div>

                </div>
            )}
        </>
    );
}
