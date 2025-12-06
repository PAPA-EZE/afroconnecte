import express from "express"
import * as photoController from "../controllers/photoController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.use(authenticate)

router.get("/", photoController.getPhotos)
router.post("/", photoController.upload.single("photo"), photoController.uploadPhoto)
router.delete("/:photoId", photoController.deletePhoto)
router.put("/:photoId/primary", photoController.setPrimaryPhoto)
router.put("/reorder", photoController.reorderPhotos)
router.post("/verification", photoController.upload.single("photo"), photoController.uploadVerificationPhoto)

export default router
