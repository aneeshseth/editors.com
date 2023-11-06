"use client"
import React, {useState} from 'react';
import { Button } from "@ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/select";
import {useRouter} from 'next/navigation'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { API_BACKEND_URL } from '@/constants';
import './page.css'

function Page() {
    const [enterState, setEnterState] = useState<String>("in");
    const [username, setUsername] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [designation, setDesignation] = useState("");
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [companyname, setCompanyname] = useState("")
    const router = useRouter()
    const notifySuccess = () => {
        toast.success('Action successful.')
    };
    const notifyFailure = () => {
        toast.error('Action failed.')
    }
    async function signIn() {
        try {
            const res = await axios.post(`${API_BACKEND_URL}/login`, {
                username: username,
                accesscode: accessCode,
                designation: designation
            })
            const data = await res.data;
            notifySuccess()
            localStorage.setItem("token", data?.token)
            router.push("/videos")
        } catch (err) {
            notifyFailure()
            console.log(err)
        }
    }
    async function signUp() {
        if (designation === 'editor') {
            try {
                const res = await axios.post(`${API_BACKEND_URL}/editor`, {
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    email: email
                })
                const data = await res.data;
                console.log(data)
                localStorage.setItem("token", data?.token)
                notifySuccess()
                router.push("/videos")
                return;
            } catch (err)  {
                notifyFailure()
                console.log(err)
            }  
        }
        try {
            const res = await axios.post(`${API_BACKEND_URL}/creator`, {
                firstname: firstname,
                lastname: lastname,
                username: username,
                companyname: companyname,
                email: email
            })
            const data = await res.data;
            console.log(data)
            localStorage.setItem("token", data?.token)
            notifySuccess()
            router.push("/videos")
        } catch (err) {
            notifyFailure()
            console.log(err)
        }
    }
    return (
        <div className="flex h-screen text-white" style={{ background: "black" }}>
        <div className="flex">
          <div style={{ marginRight: "120px" }}>
            <img
              src="https://images.unsplash.com/photo-1490810194309-344b3661ba39?auto=format&fit=crop&q=80&w=2896&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className='responsive-image'
            />
          </div>
          <div className='responsive-card'>
            {enterState === "in" ? (
              <Card className="max-w-[350px] bg-black mt-4 md:mt-6 mr-10">
                <CardHeader>
                  <CardTitle style={{ color: "white" }}>SignIn</CardTitle>
                  <CardDescription>Please Enter the Relevant details below.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="lastname" style={{ color: "white" }}>
                          Username
                        </Label>
                        <Input id="lastname" placeholder="Enter your Username" className="bg-white" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off"/>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="accessCode" style={{ color: "white" }}>
                          Access Code
                        </Label>
                        <Input id="accessCode" placeholder="Enter your Aevy Access Code" className="bg-white" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} autoComplete="off"/>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="designation" style={{ color: "white" }}>
                          Designation
                        </Label>
                        <Select value={designation} onValueChange={(e) => setDesignation(e)}>
                          <SelectTrigger id="designation" className="bg-white">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="Creator">Creator</SelectItem>
                            <SelectItem value="Editor">Editor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="text-black border-white" onClick={() => setEnterState("up")}>
                    SignUp?
                  </Button>
                  <Button className="bg-blue-500 hover-bg-blue-700" onClick={signIn}>Done</Button>
                </CardFooter>
              </Card>
            ) : (
                <Card className="max-w-[350px] bg-black mt-4 md:mt-6">
                <CardHeader>
                  <CardTitle style={{ color: "white" }}>SignUp</CardTitle>
                  <CardDescription>Please Enter the Relevant details below.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="firstname" style={{ color: "white" }} >
                          Firstname
                        </Label>
                        <Input id="firstname" placeholder="Enter your First Name" className="bg-white" value={firstname} onChange={(e) => setFirstname(e.target.value)} autoComplete="off"/>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="lastname" style={{ color: "white" }}>
                          Lastname
                        </Label>
                        <Input id="lastname" placeholder="Enter your Last Name" className="bg-white" value={lastname} onChange={(e) => setLastname(e.target.value)} autoComplete="off"/>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="accessCode" style={{ color: "white" }} >
                         Username
                        </Label>
                        <Input id="accessCode" placeholder="Enter a Username" className="bg-white" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off"/>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Email" style={{ color: "white" }}>
                         Email
                        </Label>
                        <Input id="accessCode" placeholder="Enter your Email" className="bg-white" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off"/>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="designation" style={{ color: "white" }}>
                          Designation
                        </Label>
                        <Select value={designation} onValueChange={(e) => setDesignation(e)}>
                          <SelectTrigger id="designation" className="bg-white">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="Creator">Creator</SelectItem>
                            <SelectItem value="Editor">Editor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {designation === 'Creator' && (
                             <div className="flex flex-col space-y-1.5">
                             <Label htmlFor="accessCode" style={{ color: "white" }}>
                               Company Name
                             </Label>
                             <Input id="accessCode" placeholder="Enter your Company Name" className="bg-white" value={companyname} onChange={(e) => setCompanyname(e.target.value)} autoComplete="off"/>
                           </div>
                        )}
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="text-black border-white" onClick={() => setEnterState("in")}>
                    SignIn?
                  </Button>
                  <Button className="bg-blue-500 hover-bg-blue-700" onClick={signUp}>Done</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }
  

export default Page;