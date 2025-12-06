import express from "express"
import authRoutes from "./auth.js"
import profileRoutes from "./profile.js"
import photoRoutes from "./photos.js"
import discoveryRoutes from "./discovery.js"
import matchRoutes from "./matches.js"
import messageRoutes from "./messages.js"
import eventRoutes from "./events.js"
import subscriptionRoutes from "./subscriptions.js"
import reportRoutes from "./reports.js"

const router = express.Router()

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Routes API
router.use("/auth", authRoutes)
router.use("/profile", profileRoutes)
router.use("/photos", photoRoutes)
router.use("/discovery", discoveryRoutes)
router.use("/matches", matchRoutes)
router.use("/messages", messageRoutes)
router.use("/events", eventRoutes)
router.use("/subscriptions", subscriptionRoutes)
router.use("/reports", reportRoutes)

export default router
