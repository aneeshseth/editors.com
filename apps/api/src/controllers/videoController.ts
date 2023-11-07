
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


export async function getMasterFile(req: Request, res: Response) {
    const {inputString} = req.body;
    console.log("input string")
    console.log(inputString[0])
    const matches = inputString.match(/thumbnails\/([^/]+)\/([^?]+)/);

    if (matches && matches.length === 3) {
        const username = matches[1];
        const randomString = matches[2];
        console.log("Username: " + username);
        console.log("Random String: " + randomString);
        const uuid = randomString.split("?")[0]
        console.log("Username:", username);
        console.log("UUID:", uuid);
        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `hls/${username}/${uuid}`,
        }
        const command8 = new GetObjectCommand(getObjectParams)
        const url6 = await getSignedUrl(s3, command8, {expiresIn: 3700})  
        console.log(url6)
        return res.status(200).json({url: url6})
    } else {
        console.log("Pattern not found in the input string.");
        res.sendStatus(400)
    }   
       
        /*
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl')
        fs.createReadStream(url6).pipe(res);
        */
}


export async function streamMasterFile(req: Request, res: Response) {
    try {
        console.log("MANIFEST PATHHHH")
        console.log(req.params.manifest)
        const manifestPath = "https://videotranscodingbucket.s3.us-west-2.amazonaws.com/thumbnails/techmartin/1699342207368?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIATBHO5RAE2GVIHZZ7%2F20231107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231107T073049Z&X-Amz-Expires=3700&X-Amz-Signature=8cfe40a419085ecb19b1e6904839254c933e1b0c3f20efb47c04718db8036599&X-Amz-SignedHeaders=host&x-id=GetObject"
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl')
        request.get(manifestPath).on('error', (err) => {
            console.log('error')
        }).pipe(res)
    } catch (err) {
        console.log('RERRRORRR')
        console.log(err)
    }
}

