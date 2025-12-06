import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import { User, Message, Match } from "../models/index.js"
import { Op } from "sequelize"

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  // Middleware d'authentification
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token

      if (!token) {
        return next(new Error("Authentication required"))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findByPk(decoded.userId)

      if (!user || !user.is_active) {
        return next(new Error("User not found or inactive"))
      }

      socket.userId = user.id
      socket.user = user
      next()
    } catch (error) {
      next(new Error("Invalid token"))
    }
  })

  // Gestion des connexions
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`)

    // Rejoindre sa room personnelle
    socket.join(`user:${socket.userId}`)

    // Mettre à jour le statut en ligne
    User.update({ last_active: new Date() }, { where: { id: socket.userId } })

    // Rejoindre les rooms de tous ses matchs
    joinMatchRooms(socket)

    // Écouter les messages
    socket.on("send_message", async (data) => {
      try {
        const { match_id, content, message_type = "text", media_url, ice_breaker_question } = data

        // Vérifier que l'utilisateur fait partie du match
        const match = await Match.findOne({
          where: {
            id: match_id,
            [Op.or]: [{ user1_id: socket.userId }, { user2_id: socket.userId }],
            is_active: true,
          },
        })

        if (!match) {
          socket.emit("error", { message: "Match not found" })
          return
        }

        // Créer le message
        const message = await Message.create({
          match_id,
          sender_id: socket.userId,
          content,
          message_type,
          media_url,
          ice_breaker_question,
        })

        // Récupérer le message complet
        const fullMessage = await Message.findByPk(message.id, {
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["id", "first_name"],
            },
          ],
        })

        const messageData = {
          id: fullMessage.id,
          match_id,
          content: fullMessage.content,
          type: fullMessage.message_type,
          media_url: fullMessage.media_url,
          ice_breaker_question: fullMessage.ice_breaker_question,
          sender: {
            id: fullMessage.sender.id,
            first_name: fullMessage.sender.first_name,
          },
          created_at: fullMessage.created_at,
          is_read: false,
        }

        // Envoyer à tous les participants du match
        io.to(`match:${match_id}`).emit("new_message", messageData)

        // Notifier l'autre utilisateur
        const otherUserId = match.user1_id === socket.userId ? match.user2_id : match.user1_id
        io.to(`user:${otherUserId}`).emit("notification", {
          type: "new_message",
          match_id,
          sender_name: socket.user.first_name,
          preview: content?.substring(0, 50),
        })
      } catch (error) {
        console.error("Error sending message:", error)
        socket.emit("error", { message: "Failed to send message" })
      }
    })

    // Marquer les messages comme lus
    socket.on("mark_read", async (data) => {
      try {
        const { match_id } = data

        await Message.update(
          { is_read: true, read_at: new Date() },
          {
            where: {
              match_id,
              sender_id: { [Op.ne]: socket.userId },
              is_read: false,
            },
          },
        )

        // Notifier l'autre utilisateur (pour le statut de lecture Premium)
        const match = await Match.findByPk(match_id)
        if (match) {
          const otherUserId = match.user1_id === socket.userId ? match.user2_id : match.user1_id
          io.to(`user:${otherUserId}`).emit("messages_read", { match_id })
        }
      } catch (error) {
        console.error("Error marking messages as read:", error)
      }
    })

    // Typing indicator
    socket.on("typing_start", (data) => {
      socket.to(`match:${data.match_id}`).emit("user_typing", {
        match_id: data.match_id,
        user_id: socket.userId,
      })
    })

    socket.on("typing_stop", (data) => {
      socket.to(`match:${data.match_id}`).emit("user_stopped_typing", {
        match_id: data.match_id,
        user_id: socket.userId,
      })
    })

    // Déconnexion
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`)
      User.update({ last_active: new Date() }, { where: { id: socket.userId } })
    })
  })

  // Helper pour rejoindre les rooms de match
  async function joinMatchRooms(socket) {
    const matches = await Match.findAll({
      where: {
        [Op.or]: [{ user1_id: socket.userId }, { user2_id: socket.userId }],
        is_active: true,
      },
    })

    matches.forEach((match) => {
      socket.join(`match:${match.id}`)
    })
  }

  return io
}

// Fonction pour envoyer des notifications depuis d'autres parties de l'app
export const sendNotification = (io, userId, notification) => {
  io.to(`user:${userId}`).emit("notification", notification)
}

export const notifyNewMatch = (io, user1Id, user2Id, matchData) => {
  io.to(`user:${user1Id}`).emit("new_match", matchData)
  io.to(`user:${user2Id}`).emit("new_match", matchData)
}
