"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/app/resources/LogoIcon";

export default function Logo() {
  const router = useRouter();
  return (
    <div
      className="flex flex-row rounded-full justify-center items-center space-x-4 cursor-pointer dark:fill-white fill-black"
      onClick={() => router.push("/posts")}
    >
      <LogoIcon />
      <h1 className="text-2xl font-bold hidden md:flex">PinPictures</h1>
    </div>
  );
}
