"use client";
import React from "react";
import Head from "next/head";

import Notification from "./components/Notifications";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import UserCard from "./components/UserCard";

export default function Home() {
  return (
    <>
      <Notification />
      <UserCard />
      <Main />
      <Footer />
    </>
  );
}