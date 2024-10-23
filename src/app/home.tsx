"use client";
import React from "react";
import Head from "next/head";

import Notification from "./components/Notifications";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Notification />
      <Main />
      <Footer />
    </>
  );
}