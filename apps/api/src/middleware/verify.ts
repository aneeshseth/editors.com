import {NextFunction, Request, Response} from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {PrismaClient} from 'database'
const prisma = new PrismaClient();
import dotenv from 'dotenv'
dotenv.config()

export async function verify(req: Request, res: Response, next: NextFunction) {
    try {
        const bearerToken = req.headers.authorization;
        console.log("bear token")
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
            req.headers["userId"] = decoded.id;
            console.log(decoded)
            const userInEditor = await prisma.editor.findFirst({
                where: {
                    username: decoded.username
                }
            })
            const userInCreator = await prisma.creator.findFirst({
                where: {
                    username: decoded.username
                }
            })
            if (userInCreator == null && userInEditor == null) {
                return res.sendStatus(403)
            }
            if (userInCreator != null) {
                return res.status(200).json({user: userInCreator, designation: 'creator'})
            }
            if (userInEditor != null) {
                return res.status(200).json({user: userInEditor, designation: 'editor'})
            }
        })
    } catch (err) {
       return res.sendStatus(403)
    } 
}   