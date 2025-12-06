import express from "express"
import * as authController from "../controllers/authController.js"
import { authenticate } from "../middleware/auth.js"
import { registerValidators, loginValidators } from "../middleware/validators.js"
import { authRateLimit } from "../middleware/rateLimit.js"

const router = express.Router()

// Routes publiques
router.post("/register", authRateLimit, registerValidators, authController.register)
router.post("/login", authRateLimit, loginValidators, authController.login)
router.post("/oauth", authRateLimit, authController.oauthLogin)
router.post("/refresh-token", authController.refreshToken)

// Routes protégées
router.use(authenticate)
router.get("/me", authController.getMe)
router.post("/logout", authController.logout)
router.put("/change-password", authController.changePassword)

export default router
