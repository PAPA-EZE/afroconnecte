import express from "express"
import * as profileController from "../controllers/profileController.js"
import { authenticate, requirePremium } from "../middleware/auth.js"
import { profileValidators } from "../middleware/validators.js"

const router = express.Router()

router.use(authenticate)

// Profil
router.get("/", profileController.getProfile)
router.put("/", profileValidators, profileController.updateProfile)
router.put("/languages", profileController.updateLanguages)
router.post("/complete-onboarding", profileController.completeOnboarding)
router.put("/location", profileController.updateLocation)

// Premium
router.put("/passport", requirePremium, profileController.setPassportLocation)
router.delete("/passport", requirePremium, profileController.clearPassportLocation)
router.post("/incognito", requirePremium, profileController.toggleIncognito)

// Données de référence
router.get("/ethnicities", profileController.getEthnicities)
router.get("/countries", profileController.getCountries)
router.get("/languages", profileController.getLanguages)

export default router
