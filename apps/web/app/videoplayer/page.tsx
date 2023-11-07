"use client"
import React, { useRef, useEffect } from 'react';
import { videoState } from '@/store/index';
import { useRecoilState } from 'recoil';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';

function Page() {
  const [viURL, setViURL] = useRecoilState(videoState);
  const videoRef = useRef(null);

  useEffect(() => {
    const player = videojs(videoRef.current, {
      controls: true,
      sources: [
        {
          src: viURL,
          type: 'application/x-mpegURL',
        },
      ],
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [viURL]);

  return (
    <div style={{ height: "100vh", width: "100vw", background: "black" }}>
      <section className="video-container" style={{ width: "500px", height: "500px" }}>
        <video ref={videoRef} className="video-js vjs-default-skin" />
      </section>
    </div>
  );
}

export default Page;
