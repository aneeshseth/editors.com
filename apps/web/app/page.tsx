"use client"
import * as React from "react";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/select";
import {useRouter} from 'next/navigation'

export default function Page() {
  const router = useRouter()
  function enterPage() {
    router.push("/enter")
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <img src="https://pbs.twimg.com/profile_images/1688283261724684288/38bh9HB3_400x400.jpg"/>
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mt-4 md:mt-6 lg:mt-10"
          style={{
            backgroundImage: 'linear-gradient(to right, #05baf6, #d23986)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            margin: "10px"
          }}
        >
          Create, Discover, All-at-One. Destination.
        </h1>
        <h3 style={{ color: "gray", marginBottom: "38px" }}>© Powered By Aevy's Video Mastery Cohort</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-screen-lg mt-4 ml-10">
          <div className="box" style={{margin: "10px", marginRight: "200px"}}>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Are you a Recruiter/Creator?
            </h4>
            <Button style={{marginTop: "10px"}} onClick={enterPage}>Start Hiring!</Button>
          </div>
          <div className="box" style={{margin: "10px"}}>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Are you a member of the Cohort?
            </h4>
            <Button style={{marginTop: "10px"}} onClick={enterPage}>Signup/Login</Button>
          </div>
        </div>
      </div>
    </>
  );
}


