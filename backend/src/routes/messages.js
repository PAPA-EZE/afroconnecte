import express from "express"
import * as messageController from "../controllers/messageController.js"
import { authenticate, requirePremium, requireOnboarding } from "../middleware/auth.js"
import { messageValidators } from "../middleware/validators.js"
import { messageRateLimit } from "../middleware/rateLimit.js"

const router = express.Router()

router.use(authenticate)
router.use(requireOnboarding)

router.get("/ice-breakers", messageController.getIceBreakers)
router.get("/:matchId", messageController.getMessages)
router.post("/:matchId", messageRateLimit, messageValidators, messageController.sendMessage)
router.delete("/:matchId/:messageId", messageController.deleteMessage)

// Premium
router.get("/:matchId/:messageId/read-status", requirePremium, messageController.getReadStatus)

export default router
