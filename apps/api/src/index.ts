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
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

app.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
  const bearerToken = req.headers.authorization;
  let username: any;
  jwt.verify(bearerToken!, "ENV_KEY", async (err, decoded) => {
      if (err) {
          console.log(err);
          return res.sendStatus(403);
      }
      if (!decoded) {
          return res.sendStatus(403);
      }
      if (typeof decoded === "string") {
          return res.sendStatus(403);
      }
      username = decoded.username;
  });

  /*
  @Uploads the video to S3
  */
  const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.file?.originalname,
      Body: req.file?.buffer,
      ContentType: req.file?.mimetype
  };
  const videoUpload = new PutObjectCommand(params);
  await s3.send(videoUpload);

  /*
  @Gets the URL of the Video Uploaded to S3
  */
  const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.file?.originalname,
  };
  const command2 = new GetObjectCommand(getObjectParams);
  const videoUrl = await getSignedUrl(s3, command2, { expiresIn: 3700 });

  /*
  @Video Transcoding
  */
  try {
      const outputDir = path.join(__dirname, '..', 'public', 'hls');
      const uniqueVal = `${Date.now()}`;
      const bitrates = ['100k', '800k', '1200k', '2400k', '3000k'];

      // Create an array to store promises for uploading .ts and .m3u8 files to S3
      const s3UploadPromises: any[] = [];

      await Promise.all(
          bitrates.map(async (bitrate) => {
              const outputFileName = `${bitrate}-${uniqueVal}.m3u8`;
              const videoPath = videoUrl;
  
              const ffmpegPromise = new Promise(async (resolve, reject) => {
                  const ffmpegCommand = ffmpeg()
                      .input(videoPath)
                      .outputOptions([
                          '-profile:v baseline',
                          '-level 3.0',
                          '-start_number 0',
                          '-hls_time 10',
                          '-hls_list_size 0',
                          '-f hls',
                      ])
                      .output(`${outputDir}/${outputFileName}`)
                      .videoBitrate(bitrate)
                      .audioCodec('aac')
                      .audioBitrate('128k');
  
                  ffmpegCommand.on('end', async () => {
                      console.log(`Video Transcoding Complete: ${outputFileName}`);
  
                      // Upload the .m3u8 file to S3
                      const fileContent = fs.readFileSync(`${outputDir}/${outputFileName}`);
                      const s3Params = {
                          Bucket: process.env.BUCKET_NAME,
                          Key: `hls/${username}/${outputFileName}`,
                          Body: fileContent,
                          ContentType: 'application/vnd.apple.mpegurl',
                      };
                      const command3 = new PutObjectCommand(s3Params);
                      await s3.send(command3);
  
                      // Upload the associated .ts files
                      setTimeout(() => {
                        const tsFiles = fs.readdirSync(outputDir)
                        .filter((file) => {
                          const extension = path.extname(file);
                          return extension === '.ts';
                        });
              
                        console.log("ts files")
                        console.log(tsFiles)
                        const tsUploadPromises = tsFiles.map((tsFile) => {
                            const tsFileContent = fs.readFileSync(`${outputDir}/${tsFile}`);
                            const tsS3Params = {
                                Bucket: process.env.BUCKET_NAME,
                                Key: `hls/${username}/${tsFile}`,
                                Body: tsFileContent,
                                ContentType: 'video/MP2T', 
                            };
                            const tsCommand = new PutObjectCommand(tsS3Params);
                            console.log("ts command")
                            console.log(tsCommand)
                            return s3.send(tsCommand);
                        });
                      }, 14000)
  
                      resolve(outputFileName);
                  });
  
                  ffmpegCommand.on('error', (err) => {
                      console.error('Error transcoding:', err);
                      reject(err);
                  });
  
                  ffmpegCommand.run();
              });
  
              s3UploadPromises.push(ffmpegPromise);
          })
      );

      await Promise.all(s3UploadPromises);

      /*
      @Master.m3u8 file creation
      */
      const masterMenifestFileName = `${uniqueVal}.m3u8`;
      const masterManifestContent = bitrates.map((bitrate) => {
          const playlistFileName = `${bitrate}-${uniqueVal}.m3u8`;
          const s3HlsUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/hls/${username}/${playlistFileName}`;
          return `#EXT-X-STREAM-INF:BANDWIDTH=${bitrate},RESOLUTION=720x480\n${s3HlsUrl}`;
      }).join('\n');

      fs.writeFileSync(`${outputDir}/${masterMenifestFileName}`, `#EXTM3U\n${masterManifestContent}`);

      // Upload the master .m3u8 file to S3
      const masterFileContent = fs.readFileSync(`${outputDir}/${masterMenifestFileName}`);
      const masterS3Params = {
          Bucket: process.env.BUCKET_NAME,
          Key: `hls/${username}/${masterMenifestFileName}`,
          Body: masterFileContent,
          ContentType: 'application/vnd.apple.mpegurl',
      };
      const command4 = new PutObjectCommand(masterS3Params);
      await s3.send(command4);
      

      //thumbnail creator
    ffmpeg(videoUrl).screenshots({
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
            Key: `thumbnails/${username}/${uniqueVal}`,
            Body: fileContent,
            ContentType: 'image/png'
        }
        const command0 = new PutObjectCommand(params)
        await s3.send(command0)
        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `thumbnails/${username}/${uniqueVal}`,
        }
        const command8 = new GetObjectCommand(getObjectParams)
        const url6 = await getSignedUrl(s3, command8, {expiresIn: 3700})  
        console.log("thumbnail")
        console.log(url6)
    }, 14000)
      return res.status(200).json({ imageUrl: `thumbnails/${username}/${uniqueVal}.m3u8` });
  } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'An error occurred' });
  }
});

  

app.listen(process.env.PORT!, () => {
  console.log(`server listening on port ${port}`)
})