import express from "express"
import * as eventController from "../controllers/eventController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.use(authenticate)

router.get("/", eventController.getEvents)
router.get("/my-events", eventController.getMyEvents)
router.get("/:eventId", eventController.getEventById)
router.post("/", eventController.createEvent)
router.post("/:eventId/participate", eventController.participateEvent)
router.delete("/:eventId/participate", eventController.cancelParticipation)

export default router
