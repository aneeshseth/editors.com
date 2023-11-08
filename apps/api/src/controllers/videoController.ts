
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import {Request, Response} from 'express'
import {loginInput, signupCreatorInput, signupEditorInput} from 'common'
import {PrismaClient} from 'database'
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'
dotenv.config()
import request from 'request'
import nodemailer from 'nodemailer'
import {S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command} from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_ID!,
        secretAccessKey: process.env.ACCESS_KEY_AWS!
    },
    region: "us-west-2"
})
const prisma = new PrismaClient();

export async function getVideos(req: Request, res: Response) {
    console.log(process.env.BUCKET_NAME)
    const command2 = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME,
        Prefix: 'thumbnails'
    })
    const { Contents, IsTruncated, NextContinuationToken } = await s3.send(command2);
    let images: string[] = [];
    /*
    @Gets each image using the AWS image keys and adds it to the images array
    */
    async function getImage (key: any) {
        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: key.Key,
        }
        const command2 = new GetObjectCommand(getObjectParams)
        const url = await getSignedUrl(s3, command2, {expiresIn: 3700}) 
        console.log("url") 
        return url;
    }
    const imagePromises = Contents?.map(async (imageKey) => getImage(imageKey));
    const imageUrls = await Promise.all(imagePromises!);
    console.log(imageUrls)
    return res.status(200).json({images: imageUrls});
}



export async function streamMasterFile(req: Request, res: Response) {
    try {
      const manifest = req.params.manifest;
      console.log(manifest)
      console.log("WEIUKGDF")
      const manifestPath = path.join(__dirname, '..','public', 'hls', `${manifest}`);
      console.log(manifestPath)
      if ( !fs.existsSync(manifestPath) ) {
        const manifestPath2 = path.join(__dirname, '..','public', 'hls', `${manifest}.m3u8`);
        if (!fs.existsSync(manifestPath2) )  {
            return res.status(400).json({status: false, msg: 'No Such Manifest file'});
        }
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        fs.createReadStream(manifestPath2).pipe(res);
      } else {
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        fs.createReadStream(manifestPath).pipe(res);
      }
    } catch (err) {
      console.log(err)
    }
}

