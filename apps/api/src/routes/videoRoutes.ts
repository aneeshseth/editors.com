import express from 'express'
const router = express.Router()
import {getVideos} from '../controllers/videoController'


router.get("/videos", getVideos)

export default router;