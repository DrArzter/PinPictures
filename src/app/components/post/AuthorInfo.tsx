"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@/app/types/global";

interface AuthorInfoProps {
  user: User;
  createdAt: string;
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ user, createdAt }) => {
  const router = useRouter();
  return (
    <div className="flex items-center space-x-4">
      <div className="rounded-full cursor-pointer border border-yellow-500">
        <Image
          onClick={() => router.push(`/profile/${user.name}`)}
          src={user.avatar}
          alt={`${user.name} avatar`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full rounded-full"
        />
      </div>
      <div>
        <p
          onClick={() => router.push(`/profile/${user.name}`)}
          className="font-semibold text-lg cursor-pointer"
        >
          {user.name}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default AuthorInfo;
