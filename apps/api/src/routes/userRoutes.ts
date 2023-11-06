import express from 'express'
const router = express.Router()
import {login, signUpCreator, signUpEditor} from '../controllers/userController'
import {verify} from '../middleware/verify'

router.post("/editor", signUpEditor)
router.post("/creator", signUpCreator)
router.post("/login", login)
router.get("/verify", verify)
export default router;