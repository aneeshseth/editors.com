"use client"
import React, {useState, CSSProperties, useEffect, useRef} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};
import axios from 'axios';
import './Page.css'; 
import { Button } from "@ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/select";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { API_BACKEND_URL } from '@/constants';
import {creatorState, usernameState, firstnameState, lastnameState, companynameState, editorState, usernameStateE, firstnameStateE, lastnameStateE, videoState} from '@/store/index'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';


const Page = () => {
    const router = useRouter()
    const [creator, setCreator] = useState(true);
    const [enterState, setEnterState] = useState<String>("in");
    const [username, setUsername] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [designation, setDesignation] = useState("");
    const [position, setPosition] = useState("bottom")
    const [viU, setViU] = useRecoilState(videoState)
    const [vidsRef, setVidsRef] = useState([])
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");
    const [location, setLocation] = useState("");
    const [role, setRole] = useState("")
    const [genre, setGenre] = useState("")
    const formData = new FormData();
    const [creatorS, setCreatorState] = useRecoilState(creatorState)
    const [editorS, setEditorState] = useRecoilState(editorState)
    const videoRef = useRef(null);
    async function notify() {
        const res = await axios.post(`${API_BACKEND_URL}/filter`, {
            location: location,
            role: role,
            genre: genre
        })
        const data = await res.data;
        setVidsRef(data.images)
        toast.success('The filters have been applied.')
    };
    const handleVideoChange = (e: any) => {
        console.log(e.target.files[0]);
        formData.append('video', e.target.files[0]);
    }
    async function handelSubmit() {
        try {
            const uploadVid = await axios.post(`${API_BACKEND_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem("token")
                }
            })
            const data = await uploadVid.data;
            console.log(data)
            toast.success("Video will be uploaded and then trascoded sucessfully soon!")
        } catch (err) {
            console.log(err)
            toast.error("Video Uploading Failed.")
        }
    }

    async function streamManifest(urlForManifest: string) {
        const regex = /thumbnails\/([^?]+)/;
        const match = urlForManifest.match(regex);
        console.log(match[1])
        setViU(`http://localhost:4001/stream/${match[1]}`)
        router.push("/videoplayer")
    }
    
    async function getUser() {
        try {
            const getUser = await axios.get(`${API_BACKEND_URL}/verify`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            const data = await getUser.data;
            console.log(data)
            if (data.designation == 'editor') {
                setCreator(false)
                setEditorState(data.user)
            } else {
                setCreator(true)
                setCreatorState(data.user)
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function getAllVideos() {
        try {
            const getVideoRefereceUrls = await axios.get(`${API_BACKEND_URL}/videos`)
            const data = await getVideoRefereceUrls.data;
            console.log(data)
            setVidsRef([...vidsRef, data.images])
        } catch (err) {

        }
    }



    async function callStack() {
        await getUser();
      await getAllVideos()
    }
    useEffect(() => {
        !localStorage.getItem("token") ? router.push("/") : callStack()
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])
    if (loading) {
        return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", height: "100vh", width: "100vw"}}>
        <ClipLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
        </div>
        )
    }
    if (creator) {
        return (
        <div className="flex h-screen text-white" style={{ backgroundColor: "black", height: "100%" }}>
          <div className="flex" style={{marginLeft: "15px"}}>
            <div className='hide-image'  style={{ height: "100vh", width: "37vw" }}>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: "20px"}}>
            <div style={{width: "70px", height: "70px", marginLeft: "3px", top: "0px", marginBottom: "40px"}}>
            <img
                src="https://pbs.twimg.com/profile_images/1688283261724684288/38bh9HB3_400x400.jpg"
                />
            </div>
            <div style={{display: 'flex', flexDirection: "column", height: "90vh"}}>
            <div style={{marginBottom: "30px"}}>
            <Select style={{ marginBottom: "20px" }} onValueChange={(e) => setLocation(e)}>
                <SelectTrigger id="designation" className="bg-black" style={{border: "none", backgroundColor: "purple"}}>
                <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent position="popper">
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Remote/In-Person">Hybrid</SelectItem>
                <SelectItem value="In-Person">In-Person</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div style={{marginBottom: "30px"}}>
            <Select style={{ marginBottom: "20px" }} onValueChange={(e) => setRole(e)}>
                <SelectTrigger id="designation" className="bg-black" style={{border: "none", backgroundColor: "green"}}> 
                <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent position="popper">
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Fulltime">Fulltime</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div style={{marginBottom: "30px"}}>
            <Select style={{ marginBottom: "20px" }} onValueChange={(e) => setGenre(e)}>
                <SelectTrigger id="designation" className="bg-black" style={{border: "none", backgroundColor: "orange"}}>
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
            <Button onClick={notify}>Apply</Button>
            </div>
        </div>
            </div>
            <div className="video-grid" style={{ margin: "30px", marginTop: "60px" }}>
            {vidsRef[0].map((key, index) => (
            key !== null && (
                <div className='video-item' key={index} style={{ width: "100%", height: "100%" }}>
                    <img src={key} style={{ borderRadius: "20px" }} onClick={() => {
                        streamManifest(key)
                    }} />
                </div>
                )
            ))}

            </div>
            </div>
        </div>
        )
    } else {
        return (
        <div style={{height: "100vh", width: "100wh", border: "solid", background: "black"}}>
            <div style={{ margin: "10px" }}>
                <input
                className="file-input"
                type="file"
                name="video"
                accept="video/mp4"
                onChange={handleVideoChange}
                style={{marginTop: "5px"}}
                />
                <Button className="upload-button" onClick={async () => {
                    await handelSubmit()
                }} style={{ position: "absolute", top: "15px", right: "20px" }}>
                    Upload (+)
                </Button>
            </div>
            <div className="video-grid" style={{ margin: "30px", marginTop: "60px" }}>
            {vidsRef[0].map((key, index) => (
                  <div className='video-item' key={index}  onClick={() => {
                    streamManifest(key)
                }}>
                    <img src={key} style={{borderRadius: "20px"}}/>
                </div>
            ))}
            </div>
            </div>
        );
    }
};

export default Page;

/*
 

*/




