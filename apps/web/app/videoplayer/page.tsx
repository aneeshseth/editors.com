"use client"
import React, { useRef, useEffect } from 'react';
import { videoState } from '@/store/index';
import { useRecoilState } from 'recoil';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';
import {API_BACKEND_URL} from '@/constants'
function Page() {
  const [viURL, setViURL] = useRecoilState(videoState);
  const videoRef = useRef(null);

  useEffect(() => {
    alert("helo")
    try {
      const player = videojs(videoRef.current, {
        controls: true,
        sources: [
          {
            src: `${API_BACKEND_URL}/stream/deg2edwu`,
            type: 'application/x-mpegURL',
          },
        ],
      });
  
      return () => {
        if (player) {
          player.dispose();
        }
      };
    } catch (err) {
      console.log(err)
    }
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", background: "black" }}>
      <section className="video-container" style={{ width: "500px", height: "500px" }}>
        <video ref={videoRef} className="video-js vjs-default-skin" />
      </section>
    </div>
  );
}

export default Page;
