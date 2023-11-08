'use client'
import React, { useRef, useEffect } from 'react';
import { videoState } from '@/store/index';
import { useRecoilState } from 'recoil';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';
import { API_BACKEND_URL } from '@/constants';
import Hls from 'hls.js'

function Page() {
  const [viURL, setViURL] = useRecoilState(videoState);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (viURL) {

      console.log(viURL);

      const videoElement = videoRef.current;


      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(viURL);
        hls.attachMedia(videoElement);
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {

        videoElement.src = viURL;
      } else {
        console.error('HLS is not supported in this browser.');
      }

      const player = videojs(videoElement, {
        controls: true,
      });

      return () => {
        if (player) {
          player.dispose();
        }
      }

    }
  }, [viURL]);

  return (
    <div style={{ height: "100vh", width: "100vw", background: "black" }}>
        <video ref={videoRef} style={{marginTop: "150px"}}className='video-js vjs-default-skin vjs-16-9 vjs-matrix'/>
    </div>
  );
}

export default Page;
