import { useEffect, useState } from "react";
import { SlMagnifier } from "react-icons/sl";
import { motion, AnimatePresence } from "framer-motion";

import PostList from "@/app/components/PostList";

import * as api from "@/app/api";

export default function Search({ windowHeight, windowWidth, windowId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchPosts, setSearchPosts] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setLoading(true);
    api.search(searchTerm).then((response) => {
      setSearchPosts(response.posts);
      setSearchUsers(response.users);
      setLoading(false);
    });
  };

  const searchBarClassName = `flex items-center bg-white flex-grow mx-4 rounded-full border-2 shadow-sm w-full max-w-md`;
  const searchInputClassName = `flex-grow rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700`;
  const searchIconContainerClassName = `p-2 rounded-full cursor-pointer text-gray-700 hover:text-yellow-500 transition duration-300`;

  return (
    <motion.div
      className="flex flex-col items-center justify-start w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ height: `${windowHeight}px`, overflow: "hidden" }}
    >
      <motion.div className="mt-8 w-full flex justify-center">
        <motion.form
          onSubmit={handleSearch}
          className={searchBarClassName}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.input
            className={searchInputClassName}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Поиск..."
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.button
            type="submit"
            className={searchIconContainerClassName}
            onClick={handleSearch}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SlMagnifier size={24} />
          </motion.button>
        </motion.form>
      </motion.div>

      <motion.div
        className="w-full flex flex-col items-center mt-4"
        style={{ height: `${windowHeight * 0.6}px` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence>
          {searchPosts.length > 0 && (
            <motion.div
              className="p-2"
              style={{ height: `${windowHeight - 55}px` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PostList
                posts={searchPosts}
                windowHeight={windowHeight}
                windowWidth={windowWidth}
                windowId={windowId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
