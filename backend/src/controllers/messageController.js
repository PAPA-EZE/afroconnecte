import { Message, Match, User, Photo } from "../models/index.js"
import { Op } from "sequelize"

// Liste des Ice Breakers Culturels
const ICE_BREAKERS = [
  "Quel est ton plat africain préféré ? 🍲",
  "Quelle est la fête traditionnelle la plus importante dans ta famille ?",
  "Quel artiste africain écoutes-tu le plus en ce moment ? 🎵",
  "Si tu pouvais voyager n'importe où en Afrique, où irais-tu ?",
  "Quelle tradition de ta culture te tient le plus à cœur ?",
  "Quel est ton film ou série africain(e) préféré(e) ?",
  "Comment célèbres-tu les grandes occasions en famille ?",
  "Quelle langue africaine aimerais-tu apprendre ?",
  "Quel est ton souvenir préféré lié à ta culture ?",
  "Quel conseil te donnerait ta grand-mère ?",
]

export const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params
    const { page = 1, limit = 50 } = req.query

    // Vérifier que l'utilisateur fait partie du match
    const match = await Match.findOne({
      where: {
        id: matchId,
        [Op.or]: [{ user1_id: req.user.id }, { user2_id: req.user.id }],
        is_active: true,
      },
    })

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Conversation non trouvée.",
      })
    }

    const offset = (page - 1) * limit

    const messages = await Message.findAndCountAll({
      where: {
        match_id: matchId,
        is_deleted: false,
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "first_name"],
          include: [
            {
              model: Photo,
              as: "photos",
              where: { is_primary: true },
              required: false,
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: Number.parseInt(limit),
      offset,
    })

    // Marquer les messages comme lus
    await Message.update(
      { is_read: true, read_at: new Date() },
      {
        where: {
          match_id: matchId,
          sender_id: { [Op.ne]: req.user.id },
          is_read: false,
        },
      },
    )

    res.json({
      success: true,
      data: {
        messages: messages.rows.reverse().map((m) => ({
          id: m.id,
          content: m.content,
          type: m.message_type,
          media_url: m.media_url,
          ice_breaker_question: m.ice_breaker_question,
          is_mine: m.sender_id === req.user.id,
          is_read: m.is_read,
          read_at: req.user.is_premium ? m.read_at : undefined,
          sender: {
            id: m.sender.id,
            first_name: m.sender.first_name,
            photo: m.sender.photos?.[0]?.url,
          },
          created_at: m.created_at,
        })),
        pagination: {
          total: messages.count,
          page: Number.parseInt(page),
          pages: Math.ceil(messages.count / limit),
        },
      },
    })
  } catch (error) {
    console.error("Erreur getMessages:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des messages.",
    })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { matchId } = req.params
    const { content, message_type = "text", media_url, ice_breaker_question } = req.body

    // Vérifier le match
    const match = await Match.findOne({
      where: {
        id: matchId,
        [Op.or]: [{ user1_id: req.user.id }, { user2_id: req.user.id }],
        is_active: true,
      },
    })

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Conversation non trouvée.",
      })
    }

    const message = await Message.create({
      match_id: matchId,
      sender_id: req.user.id,
      content,
      message_type,
      media_url,
      ice_breaker_question,
    })

    // Récupérer le message avec les infos du sender
    const fullMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "first_name"],
          include: [
            {
              model: Photo,
              as: "photos",
              where: { is_primary: true },
              required: false,
            },
          ],
        },
      ],
    })

    res.status(201).json({
      success: true,
      data: {
        message: {
          id: fullMessage.id,
          content: fullMessage.content,
          type: fullMessage.message_type,
          media_url: fullMessage.media_url,
          ice_breaker_question: fullMessage.ice_breaker_question,
          is_mine: true,
          is_read: false,
          sender: {
            id: fullMessage.sender.id,
            first_name: fullMessage.sender.first_name,
            photo: fullMessage.sender.photos?.[0]?.url,
          },
          created_at: fullMessage.created_at,
        },
      },
    })
  } catch (error) {
    console.error("Erreur sendMessage:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du message.",
    })
  }
}

export const deleteMessage = async (req, res) => {
  try {
    const { matchId, messageId } = req.params

    const message = await Message.findOne({
      where: {
        id: messageId,
        match_id: matchId,
        sender_id: req.user.id,
      },
    })

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message non trouvé.",
      })
    }

    await message.update({ is_deleted: true })

    res.json({
      success: true,
      message: "Message supprimé.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression.",
    })
  }
}

export const getIceBreakers = async (req, res) => {
  try {
    // Retourner 5 ice breakers aléatoires
    const shuffled = ICE_BREAKERS.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 5)

    res.json({
      success: true,
      data: { ice_breakers: selected },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des ice breakers.",
    })
  }
}

// Statut de lecture (Premium)
export const getReadStatus = async (req, res) => {
  try {
    const { matchId, messageId } = req.params

    const message = await Message.findOne({
      where: {
        id: messageId,
        match_id: matchId,
        sender_id: req.user.id,
      },
    })

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message non trouvé.",
      })
    }

    res.json({
      success: true,
      data: {
        is_read: message.is_read,
        read_at: message.read_at,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur.",
    })
  }
}
