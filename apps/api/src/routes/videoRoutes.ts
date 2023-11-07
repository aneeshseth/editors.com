import express from 'express'
const router = express.Router()
import {getMasterFile, getVideos} from '../controllers/videoController'


router.get("/videos", getVideos)
router.post("/video", getMasterFile)

export default router;