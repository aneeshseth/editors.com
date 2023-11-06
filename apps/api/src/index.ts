import {PrismaClient} from 'database'
import {signupEditorInput} from 'common'
import express from 'express'
const app = express()



app.listen(4001, () => {
    console.log("app listening on port")
})