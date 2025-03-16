'use client';
import React, { useEffect } from "react";
import SearchBar from "@/app/components/common/SearchBar";
import searchPost from "../api/searchPost";
import { Post, ShortUser } from "../types/global";

export default function Page() {

    const [searchTerm, setSearchTerm] = React.useState("");
    const [users, setUsers] = React.useState<ShortUser[] | undefined>([]);
    const [posts, setPosts] = React.useState<Post[] | undefined>([]);
    const [tab, setTab] = React.useState(0);

    useEffect(() => {
        if (searchTerm === "") {
            setUsers([]);
            setPosts([]);
            return;
        }
        searchPost(searchTerm).then((data) => {
            const searched = data.data.data

            setUsers(searched.Users);
            setPosts(searched.Posts);
            
        })
    }, [searchTerm]);

    return (
    <div className="flex flex-col items-center justify-center h-full pt-10">
        <h1 className="text-2xl font-bold mb-6">Search</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

        {tab === 0 && (
            <div>
                <h2 className="text-2xl font-bold mb-4">Users</h2>
                <ul>
                    {users?.map((user) => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            </div>
        )}

        {tab === 1 && (
            <div>
                <h2 className="text-2xl font-bold mb-4">Posts</h2>
                <ul>
                    {posts?.map((post) => (
                        <li key={post.id}>{post.name}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
    );
}