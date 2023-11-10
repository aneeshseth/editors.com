import express from 'express'
const router = express.Router()
import {getFilteredVideos, getVideos, streamMasterFile} from '../controllers/videoController'


router.get("/videos", getVideos)
router.get("/stream/:manifest", streamMasterFile)
router.post("/filter", getFilteredVideos)

export default router;