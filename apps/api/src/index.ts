import express, {Request, Response} from 'express'
const app = express()
const port = 4001
import cors from 'cors'
import userRoutes from './routes/userRoutes'
import videoRoutes from './routes/videoRoutes'
import dotenv from 'dotenv'
import ffmpeg from "fluent-ffmpeg";
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
import jwt from 'jsonwebtoken'
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs'
dotenv.config()
app.use(express.json())
import multer from 'multer'
import path from 'path'
app.use(cors())
import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { verify } from './middleware/verify'
import bcrypt from 'bcryptjs'
import CryptoJS from 'crypto-js'
app.use(express.static('public'));


app.use("/",userRoutes);
app.use("/", videoRoutes)
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

app.get("/", (req,res) => {
  res.send("ehlloo")
})
app.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
  const bearerToken = req.headers.authorization;
  console.log("bear token")
  let username = ""
  await jwt.verify(bearerToken!, "ENV_KEY", async (err, decoded) => {
      if (err) {
          console.log(err)
          return res.sendStatus(403)
      }
      if (!decoded) {
          return res.sendStatus(403)
      }
      if (typeof decoded === "string") {
          return res.sendStatus(403)
      }
      username = decoded.username;
  })
  const s3 = new S3Client({
    credentials: {
        accessKeyId: "AKIATBHO5RAE2GVIHZZ7",
        secretAccessKey: "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"
    },
    region: "us-west-2"
})
  const params = {
      Bucket: "videotranscodingbucket",
      Key: req.file?.originalname,
      Body: req.file?.buffer,
      ContentType: req.file?.mimetype
  }
  const command = new PutObjectCommand(params)
  await s3.send(command)
  const getObjectParams = {
      Bucket: "videotranscodingbucket",
      Key: req.file?.originalname,
  }
  const command2 = new GetObjectCommand(getObjectParams)
  const url = await getSignedUrl(s3, command2, {expiresIn: 3700})  
  console.log("url")
  console.log(url)
  try {
    const outputDir = path.join(__dirname, '..', 'public', 'hls');
    const uniqueVal = `${encryptString(username)}=${Date.now()}`;
    const masterMenifestFileName = `${uniqueVal}.m3u8`;
    const bitrates = ['100k', '800k', '1200k', '2400k', '3000k'];
    const ffmpegPromises = bitrates.map( async (bitrate) => {
    const outputFileName = `${bitrate}-${uniqueVal}.m3u8`;
    const videoPath = url;
    ffmpeg()
    .input(videoPath)
      .outputOptions([
        '-profile:v baseline', // H.264 profile for wider devide suppoet
        '-level 3.0',  // H.264 level 
        '-start_number 0', // Segment start number
        '-hls_time 10',  // segnebt duration
        '-hls_list_size 0', // number of segments to keep in playlist (0 means all)
        '-f hls', // output format HLS
      ])
      .output(`${outputDir}/${outputFileName}`)
      .videoBitrate(bitrate)
      .audioCodec('aac')
      .audioBitrate('128k')
      .run();
  });
  
  await Promise.all(ffmpegPromises);

  const masterManifestContent: any = bitrates.map((bitrate) => {
    const playlistFileName = `${bitrate}-${uniqueVal}.m3u8`;
    const serverUrl = 'http://localhost:4002/public/hls'
    return `#EXT-X-STREAM-INF:BANDWIDTH=${bitrate},RESOLUTION=720X480\n${playlistFileName}`;
  }).join('\n');
  fs.writeFileSync(`${outputDir}/${masterMenifestFileName}`,`#EXTM3U
  ${masterManifestContent}`);

  /*
  Thumbnail Generation
  */
  ffmpeg(url).screenshots({
      timestamps: [0.5],
      filename: `${uniqueVal}`,
      folder: `${outputDir}/thumbnails`,
      size: '320x240'
  })
  setTimeout(async () => {
    const imageContent = fs.readFileSync(`${outputDir}/thumbnails/${uniqueVal}.png`)
    const params = {
        Bucket: "videotranscodingbucket",
        Key: `thumbnails/${uniqueVal}`,
        Body: imageContent,
        ContentType: 'image/png'
    }
    const command0 = new PutObjectCommand(params)
    await s3.send(command0)
    const getObjectParams = {
        Bucket: "videotranscodingbucket",
        Key: `thumbnails/${uniqueVal}`,
    }
    const command8 = new GetObjectCommand(getObjectParams)
    const url6 = await getSignedUrl(s3, command8, {expiresIn: 3700})  
    console.log(url6)
    let match = url6.match(/thumbnails\/(\d+)/);
    console.log("url decrypt")
    console.log(match![1])
    return res.sendStatus(200)
  }, 14000)
  }
  catch (err) {
    console.log(err);
  }
})

const originalChars = "abcdefghijklmnopqrstuvwxyz";
const encryptedChars = "1234567890!@#$%^&*()_+";

type CharMap = { [key: string]: string };

function createCharMap(): CharMap {
  const charMap: CharMap = {};
  for (let i = 0; i < originalChars.length; i++) {
    charMap[originalChars[i]] = encryptedChars[i % encryptedChars.length];
  }
  return charMap;
}

function encryptString(inputString: string): string {
  const charMap: CharMap = createCharMap();
  const encryptedString = inputString.replace(/[a-z]/g, (match) => charMap[match] || match);
  return encryptedString;
}

function decryptString(encryptedString: string): string {
  const charMap: CharMap = createCharMap();
  const reverseCharMap: CharMap = {};
  originalChars.split('').forEach((char, index) => {
    reverseCharMap[charMap[char]] = char;
  });

  const decryptedString = encryptedString.replace(/[0-9!@#$%^&*()_+]/g, (match) => reverseCharMap[match] || match);
  return decryptedString;
}
  

app.listen(process.env.PORT!, () => {
  console.log(`OYE HOYE ${port}`)
})



