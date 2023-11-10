"use client"
import * as React from "react";
import { Button } from "@ui/components/button";
import { useRouter } from 'next/navigation';
import './Page.css';

export default function Page() {
  const router = useRouter();

  function enterPage() {
    router.push("/enter");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
        <img src="https://pbs.twimg.com/profile_images/1688283261724684288/38bh9HB3_400x400.jpg" alt="Logo" className="mb-4" />
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mt-4 md:mt-6 lg:mt-10 text-center"
          style={{
            backgroundImage: 'linear-gradient(to right, #05baf6, #d23986)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            margin: "10px"
          }}
        >
          Create, Discover, All-at-One. Destination.
        </h1>
        <h3 className="text-gray-500 text-center mb-8 md:mb-12 lg:mb-16">© Aevy's Ultimate Creator/Editor Infrastructure</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-screen-lg mt-4 mx-auto">
          <div className="box mb-4 sm:mb-0 mr-5">
            <h4 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2 sm:mb-4 text-center">
              Recruiter?
            </h4>
            <Button style={{ fontSize: "1rem" }} onClick={enterPage}>Start Hiring!</Button>
          </div>
          <div className="box">
            <h4 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2 sm:mb-4 text-center">
              Member?
            </h4>
            <Button style={{ fontSize: "1rem" }} onClick={enterPage}>Signup/Login</Button>
          </div>
        </div>
      </div>
    </>
  );
}
