import express from "express"
import * as reportController from "../controllers/reportController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.use(authenticate)

router.post("/user/:userId", reportController.reportUser)
router.post("/block/:userId", reportController.blockUser)
router.delete("/block/:userId", reportController.unblockUser)
router.get("/blocked", reportController.getBlockedUsers)

export default router
