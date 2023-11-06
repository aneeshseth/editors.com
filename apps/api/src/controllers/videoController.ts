
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import {Request, Response} from 'express'
import {loginInput, signupCreatorInput, signupEditorInput} from 'common'
import {PrismaClient} from 'database'
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'
import {S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command} from '@aws-sdk/client-s3'
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
    console.log("HELLOOOo")
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
        console.log(url);
        images = [...images, url];
    }

    Contents?.map(async (imageKey) => (
        await getImage(imageKey)
    ))
    console.log(images)
    return res.status(200).json({images: images});
}
