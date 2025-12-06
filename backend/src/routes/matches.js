import express from "express"
import * as matchController from "../controllers/matchController.js"
import { authenticate, requireOnboarding } from "../middleware/auth.js"

const router = express.Router()

router.use(authenticate)
router.use(requireOnboarding)

router.get("/", matchController.getMatches)
router.get("/:matchId", matchController.getMatchById)
router.delete("/:matchId", matchController.unmatch)

export default router
