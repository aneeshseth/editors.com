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
    const [location, setLocation] = useState("");
    const [role, setRole] = useState("")
    const [genre, setGenre] = useState("")
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
        if (designation === 'Editor') {
          console.log("ediutor designation")
          console.log(designation)
            try {
                const res = await axios.post(`${API_BACKEND_URL}/editor`, {
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    email: email,
                    location: location,
                    genre: genre,
                    role: role
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
        } else {
          console.log("creator designation")
          console.log(designation)
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
    }
    async function getDesignation(e) {
      console.log(e)
      setDesignation(e)
    }
    return (
        <div className="flex h-screen text-white" style={{ background: "black", height: "100%", }}>
        <div className="flex">
          <div style={{ marginRight: "120px" }}>
            <img
              src="https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                        <Select value={designation} onValueChange={(e) => getDesignation(e)}>
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
                        <Select value={designation} onValueChange={(e) => getDesignation(e)}>
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
                  <div style={{marginTop: "10px"}}>
                  <h1 htmlFor="accessCode" style={{ color: "white" }}>
                              Preferences:
                    </h1>
                    </div>
              <div  style={{ marginBottom: "20px", marginTop: "10px" }}>             
              <Select onValueChange={(e) => setLocation(e)}>
                <SelectTrigger id="designation"  style={{border: "none"}}>
                <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent position="popper">
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Remote/In-Person">Hybrid</SelectItem>
                <SelectItem value="In-Person">In-Person</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div  style={{ marginBottom: "20px", marginTop: "20px" }}>             
            <Select style={{ marginBottom: "20px" }} onValueChange={(e) => setRole(e)}>
                <SelectTrigger id="designation" style={{border: "none"}}> 
                <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent position="popper">
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Fulltime">Fulltime</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div  style={{ marginBottom: "20px", marginTop: "20px" }}>             
            <Select style={{ marginBottom: "20px" }} onValueChange={(e) => setGenre(e)}>
                <SelectTrigger id="designation"  style={{border: "none"}}>
                <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent position="popper">
                <SelectItem value="Infotainment">Infotainment</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Documentaries">Documentaries</SelectItem>
                <SelectItem value="Tech">Tech</SelectItem>
                <SelectItem value="Vlog/Personal Content">Vlog/Personal Content</SelectItem>
                </SelectContent>
            </Select>
            </div>
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