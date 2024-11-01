// Post.jsx (or .tsx)
import React, { useEffect, useState } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { fetchPost } from "@/app/utils/postUtils";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import { set } from "zod";

export default function Post({ postId }) {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();
  const [currentImage, setCurrentImage] = useState(0);


  let currentIndex = 0;

  function prevImage() {
    if (post.images.length === 1) {
      return;
    }
    if (currentImage - 1 < 0) {
      setCurrentImage(post.images.length - 1);
      return;
    }
    setCurrentImage(currentImage - 1);
  }

  function nextImage() {
    if (post.images.length === 1) {
      return;
    }
    if (currentImage + 1 >= post.images.length) {
      setCurrentImage(0);
      return;
    }
    setCurrentImage(currentImage + 1);
  }




  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      const fetchedPost = await fetchPost(postId);
      setPost(fetchedPost);
      setLoading(false);
    };
    fetchPostData();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <LoadingIndicator />
      </div>
    );
  }


  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p>Post not found</p>
      </div>
    );
  }



  return (
    <div>
      <div className="relative mx-auto">
        <div id="background" className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <img id="blurredBackground" src={post.images[currentImage].picpath} alt="Blurred Background" className="w-full h-full object-cover blur-lg scale-110" />
        </div>
        <div className="relative flex justify-center items-center w-full h-96 overflow-hidden">
          <img id="currentImage" src={post.images[currentImage].picpath} alt="Gallery Image" className="max-w-full max-h-full object-cover" />
        </div>

        <div onClick={prevImage} className={`${post.images.length === 1 ? "hidden" : ""} absolute top-0 left-0 h-full w-1/12 bg-gray-800 bg-opacity-5 hover:bg-opacity-50 cursor-pointer flex items-center justify-start`}>
          <span className="text-white text-3xl ml-4">‹</span>
        </div>

        <div onClick={nextImage} className={`${post.images.length === 1 ? "hidden" : ""} absolute top-0 right-0 h-full w-1/12 bg-gray-800 bg-opacity-5 hover:bg-opacity-50 cursor-pointer flex items-center justify-end`}>
          <span className="text-white text-3xl mr-4">›</span>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center px-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{post.name}</h1>
          <p className="text-sm font-semibold">{post.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-center">{new Date(post.createdAt).toDateString()}</p>
          <div className="flex flex-row gap-2">
            <BsHeart className="self-end w-6 h-6" />
            <p className="text-sm font-semibold">{post.likesCount}</p>
          </div>

        </div>
      </div>
      <div className="flex flex-row gap-3 mt-4">
        <img src={post.author.avatar} alt="Avatar" className="w-12 h-12 rounded-full" />
        <p className="text-lg font-semibold text-center">{post.author.name}</p>
      </div>

    </div>
  );
}
