
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import {Request, Response} from 'express'
import {loginInput, signupCreatorInput, signupEditorInput} from 'common'
import {PrismaClient} from 'database'
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

const prisma = new PrismaClient();


export async function signUpEditor(req: Request, res: Response) {
    const body = req.body;
    const inputValidation = signupEditorInput.safeParse(body);
    if (!inputValidation.success) return res.status(400).json({msg: 'invalid input'})
    const {firstname, lastname, username, email} = body;
    const uuid = uuidv4();
    console.log(uuid)
    const existingUserInEditor = await prisma.editor.findFirst({
        where: {
            username: username
        },
    })
    const existingUserInCreator = await prisma.creator.findFirst({
        where: {
            username: username
        },
    })
   if (existingUserInCreator != null || existingUserInEditor != null) {
        return res.sendStatus(403)
   }
    const user = await prisma.editor.create({
        data: {
            firstname: firstname,
            lastname: lastname,
            username: username,
            accesscode: uuid
        }
    })
    const tokenDetails = {
        id: user.id,
        username: user.username
    }
    const token = await jwt.sign(tokenDetails,process.env.ACCESS_KEY!, {expiresIn: "1d"})
    await prisma.$disconnect;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_USER!,
            pass: process.env.AUTH_PASS!
        }
    })
    const mailOptions = {
        from: process.env.AUTH_USER!,
        to: email,
        subject: "Your Aevy Account Access Code",
        text: `Your AevyTV Access Code is ${uuid}, make sure you don't lose this code!`
    }
    transporter.sendMail(mailOptions, function (err,info) {
        if (err) {
            console.log(err)
        } else {
            console.log("email sent!", info.response);
        }
    })
    return res.status(200).json({msg: "user created", user: user, token: token})
}

export async function signUpCreator(req: Request, res: Response) {
    const body = req.body;
    console.log(body)
    const inputValidation = signupCreatorInput.safeParse(body);
    console.log(inputValidation)
    if (!inputValidation.success) return res.status(400).json({msg: 'invalid input'})
    const {firstname, lastname, username, companyname, email} = body;
    const uuid = uuidv4();
    console.log(uuid)
    const existingUserInCreator = await prisma.creator.findFirst({
        where: {
            username: username
        },
    })
    const existingUserInEditor = await prisma.editor.findFirst({
        where: {
            username: username
        },
    })
    if (existingUserInCreator != null || existingUserInEditor != null) {
        return res.sendStatus(403)
    }
    const user = await prisma.creator.create({
        data: {
            firstname: firstname,
            lastname: lastname,
            username: username,
            accesscode: uuid,
            companyname: companyname
        }
    })
    const tokenDetails = {
        id: user.id,
        username: user.username
    }
    const token = await jwt.sign(tokenDetails,"ENV_KEY", {expiresIn: "1d"})
    await prisma.$disconnect;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_USER!,
            pass: process.env.AUTH_PASS!
        }
    })
    const mailOptions = {
        from: process.env.AUTH_USER,
        to: email,
        subject: "Your Aevy Account Access Code",
        text: `Your AevyTV Access Code is ${uuid}, make sure you don't lose this code!`
    }
    transporter.sendMail(mailOptions, function (err,info) {
        if (err) {
            console.log(err)
        } else {
            console.log("email sent!", info.response);
        }
    })
    return res.status(200).json({msg: "user created", user: user, token: token})
}


export async function login(req: Request, res: Response) {
    const body = req.body;
    console.log(body)
    const inputValidation = loginInput.safeParse(req.body);
    if (!inputValidation.success) return res.status(400).json({msg: 'invalid input'})
    const {username, accesscode, designation} = req.body;
    if (designation === 'editor') {
        const existingUser = await prisma.editor.findFirst({
            where: {
                username: username,
                accesscode: accesscode
            }
        })
        if (existingUser == null) {
            return res.sendStatus(403);
        }
        const tokenDetails = {
            id: existingUser.id,
            username: existingUser.username
        }
        const token = await jwt.sign(tokenDetails,process.env.ACCESS_KEY!, {expiresIn: "1d"})
        await prisma.$disconnect;
        console.log(token)
        return res.status(200).json({msg: "user logged in", user: existingUser, token: token})
    }
    const existingUser = await prisma.creator.findFirst({
        where: {
            username: username,
            accesscode: accesscode
        }
    })
    if (existingUser == null) {
        return res.sendStatus(403);
    }
    const tokenDetails = {
        id: existingUser.id,
        username: existingUser.username
    }
    const token = await jwt.sign(tokenDetails,"ENV_KEY", {expiresIn: "1d"})
    await prisma.$disconnect;
    return res.status(200).json({msg: "user logged in", user: existingUser, token: token})
}