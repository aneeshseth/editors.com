import { z } from "zod";

export const UserInput = z.object({
    email: z.string(),
    password: z.string()
})

export const signupEditorInput = z.object({
    firstname: z.string(),
    lastname: z.string(),
    username: z.string(),
    email: z.string()
})


export const signupCreatorInput = z.object({
    firstname: z.string(),
    lastname: z.string(),
    username: z.string(),
    companyname: z.string(),
    email: z.string()
})

export const loginInput = z.object({
    username: z.string(),
    accesscode: z.string(),
    designation: z.string()
})