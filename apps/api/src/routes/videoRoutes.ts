import express from 'express'
const router = express.Router()
import {getVideos, streamMasterFile} from '../controllers/videoController'


router.get("/videos", getVideos)
router.get("/stream/:manifest", streamMasterFile)

export default router;