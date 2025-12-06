import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { createServer } from "http"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

import { testConnection } from "./config/database.js"
import { syncDatabase } from "./models/index.js"
import routes from "./routes/index.js"
import { initializeSocket } from "./socket/index.js"

// Configuration
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)

// Initialiser Socket.IO
const io = initializeSocket(server)

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"))

// Parser JSON (sauf pour le webhook Stripe)
app.use((req, res, next) => {
  if (req.originalUrl === "/api/subscriptions/webhook") {
    next()
  } else {
    express.json()(req, res, next)
  }
})

app.use(express.urlencoded({ extended: true }))

// Servir les fichiers statiques (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Routes API
app.use("/api", routes)

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée.",
  })
})

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error("Error:", err)

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.code === "LIMIT_FILE_SIZE" ? "Fichier trop volumineux (max 5MB)" : "Erreur lors de l'upload",
    })
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur serveur interne.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// Démarrage du serveur
const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    // Tester la connexion à la base de données
    await testConnection()

    // Synchroniser les modèles
    await syncDatabase()

    server.listen(PORT, () => {
      console.log(`
🚀 Serveur AfriLove démarré !
📍 Port: ${PORT}
🌍 Environnement: ${process.env.NODE_ENV || "development"}
🔗 API: http://localhost:${PORT}/api
🔌 WebSocket: Activé
      `)
    })
  } catch (error) {
    console.error("❌ Erreur au démarrage:", error)
    process.exit(1)
  }
}

startServer()

export { io }
