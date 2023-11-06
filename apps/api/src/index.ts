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

app.use(express.static('public'));
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_ID!,
        secretAccessKey: process.env.ACCESS_KEY_AWS!
    },
    region: "us-west-2"
})


app.use("/",userRoutes);
app.use("/", videoRoutes)
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

app.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
    const bearerToken = req.headers.authorization;
    let username: any;
    jwt.verify(bearerToken!, "ENV_KEY", async (err, decoded) => {
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
    /*
    @Uploads the video to S3
    */
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: req.file?.originalname,
        Body: req.file?.buffer,
        ContentType: req.file?.mimetype
    }
    const videoUpload = new PutObjectCommand(params)
    await s3.send(videoUpload)

    /*
    @Gets the URL of the Video Uploaded to S3
    */
    const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: req.file?.originalname,
    }
    const command2 = new GetObjectCommand(getObjectParams)
    const url = await getSignedUrl(s3, command2, {expiresIn: 3700})  
    /*
    @Video Transcoding
    */
    try {
      const outputDir = path.join(__dirname, '..', 'public', 'hls');
      const uniqueVal = `${Date.now()}`;
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
    /*
    @Master.m3u8 file creation
    */
    const masterManifestContent: any = bitrates.map((bitrate) => {
      const playlistFileName = `${bitrate}-${uniqueVal}.m3u8`;
      const serverUrl = 'http://localhost:4002/public/hls'
      return `#EXT-X-STREAM-INF:BANDWIDTH=${bitrate},RESOLUTION=720X480\n${playlistFileName}`;
    }).join('\n');
    fs.writeFileSync(`${outputDir}/${masterMenifestFileName}`,`#EXTM3U
    ${masterManifestContent}`);
    let myuuid = uuidv4();
    setTimeout(async () => {
        const fileContent = fs.readFileSync(`${outputDir}/${masterMenifestFileName}`);
        const s3Params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `m3u8s/${username}/${myuuid}`,
            Body: fileContent,
            ContentType: 'application/vnd.apple.mpegurl',
        };
        const command3 = new PutObjectCommand(s3Params)
        await s3.send(command3)
        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `m3u8s/${username}/${myuuid}`,
        }
        const command8 = new GetObjectCommand(getObjectParams)
        const url6 = await getSignedUrl(s3, command8, {expiresIn: 3700})  
        console.log("m3u8 url")
        console.log(url6)
    }, 14000)
    /*
    @Thumbnail Creator
    */
    ffmpeg(url).screenshots({
        timestamps: [0.5],
        filename: `${username}`,
        folder: outputDir,
        size: '320x240'
    })
    setTimeout(async () => {
        const filePath = `public/hls/techmartin.png`;
        const fileContent = fs.readFileSync(filePath);
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `thumbnails/${username}/${myuuid}`,
            Body: fileContent,
            ContentType: 'image/png'
        }
        const command0 = new PutObjectCommand(params)
        await s3.send(command0)
        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `thumbnails/${username}/${myuuid}`,
        }
        const command8 = new GetObjectCommand(getObjectParams)
        const url6 = await getSignedUrl(s3, command8, {expiresIn: 3700})  
        console.log(url6)
    }, 14000)
    /*
    @Deleting all temporary files on the server
    */
    setTimeout(async () => {
        fs.readdir(outputDir, (err, files) => {
            if (err) {
                console.log(err)
            }
            files.forEach(file => {
              const filePath = path.join(outputDir, file);
              if (fs.statSync(filePath).isFile()) {
                fs.unlink(filePath, (err) => {
                  if (err) {
                    console.log(err)
                  }
                });
              }
            });
          });   
    }, 14000)
    console.log(`${username}/${myuuid}`)
    return res.status(200).json({imageUrl: `${username}/${myuuid}`})
    }
    catch (err) {
      console.log(err);
    }
})
  

app.listen(process.env.PORT!, () => {
  console.log(`server listening on port ${port}`)
})