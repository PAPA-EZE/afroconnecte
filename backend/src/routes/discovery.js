import express from "express"
import * as discoveryController from "../controllers/discoveryController.js"
import { authenticate, requirePremium, requireOnboarding } from "../middleware/auth.js"
import { swipeValidators, discoveryFiltersValidators } from "../middleware/validators.js"
import { swipeRateLimit } from "../middleware/rateLimit.js"

const router = express.Router()

router.use(authenticate)
router.use(requireOnboarding)

// Découverte
router.get("/profiles", discoveryFiltersValidators, discoveryController.getDiscoveryProfiles)
router.get("/profiles/:userId", discoveryController.getProfileById)
router.post("/swipe/:userId", swipeRateLimit, swipeValidators, discoveryController.swipeProfile)

// Premium
router.post("/rewind", requirePremium, discoveryController.rewindLastSwipe)
router.get("/who-liked-me", requirePremium, discoveryController.getWhoLikedMe)
router.post("/boost", requirePremium, discoveryController.activateBoost)

export default router
