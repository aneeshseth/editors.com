import express from 'express'
const router = express.Router()
import {getMasterFile, getVideos, streamMasterFile} from '../controllers/videoController'


router.get("/videos", getVideos)
router.post("/video", getMasterFile)
router.get("/stream/:manifest", streamMasterFile)

export default router;