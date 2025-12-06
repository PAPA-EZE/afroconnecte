import express from "express"
import * as subscriptionController from "../controllers/subscriptionController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// Webhook Stripe (pas d'auth)
router.post("/webhook", express.raw({ type: "application/json" }), subscriptionController.handleWebhook)

router.use(authenticate)

router.get("/plans", subscriptionController.getPlans)
router.get("/current", subscriptionController.getCurrentSubscription)
router.post("/checkout", subscriptionController.createCheckoutSession)
router.post("/cancel", subscriptionController.cancelSubscription)

export default router
