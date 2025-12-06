import { Match, User, Message, Photo, Profile } from "../models/index.js"
import { Op } from "sequelize"

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      where: {
        [Op.or]: [{ user1_id: req.user.id }, { user2_id: req.user.id }],
        is_active: true,
      },
      include: [
        {
          model: User,
          as: "user1",
          include: [
            {
              model: Photo,
              as: "photos",
              where: { is_primary: true },
              required: false,
            },
          ],
          attributes: ["id", "first_name", "is_verified", "is_premium", "last_active"],
        },
        {
          model: User,
          as: "user2",
          include: [
            {
              model: Photo,
              as: "photos",
              where: { is_primary: true },
              required: false,
            },
          ],
          attributes: ["id", "first_name", "is_verified", "is_premium", "last_active"],
        },
        {
          model: Message,
          as: "messages",
          limit: 1,
          order: [["created_at", "DESC"]],
        },
      ],
      order: [["created_at", "DESC"]],
    })

    // Formater les matches
    const formattedMatches = matches.map((match) => {
      const otherUser = match.user1_id === req.user.id ? match.user2 : match.user1
      const lastMessage = match.messages?.[0]

      return {
        match_id: match.id,
        user: {
          id: otherUser.id,
          first_name: otherUser.first_name,
          is_verified: otherUser.is_verified,
          is_premium: otherUser.is_premium,
          photo: otherUser.photos?.[0]?.url,
          is_online: isOnline(otherUser.last_active),
        },
        last_message: lastMessage
          ? {
              content: lastMessage.content,
              type: lastMessage.message_type,
              is_mine: lastMessage.sender_id === req.user.id,
              created_at: lastMessage.created_at,
              is_read: lastMessage.is_read,
            }
          : null,
        matched_at: match.created_at,
        has_unread: lastMessage && !lastMessage.is_read && lastMessage.sender_id !== req.user.id,
      }
    })

    // Trier: non lus en premier, puis par dernière activité
    formattedMatches.sort((a, b) => {
      if (a.has_unread && !b.has_unread) return -1
      if (!a.has_unread && b.has_unread) return 1

      const aTime = a.last_message?.created_at || a.matched_at
      const bTime = b.last_message?.created_at || b.matched_at
      return new Date(bTime) - new Date(aTime)
    })

    res.json({
      success: true,
      data: { matches: formattedMatches },
    })
  } catch (error) {
    console.error("Erreur getMatches:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des matchs.",
    })
  }
}

// Helper function
function isOnline(lastActive) {
  if (!lastActive) return false
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  return new Date(lastActive) > fiveMinutesAgo
}

export const getMatchById = async (req, res) => {
  try {
    const { matchId } = req.params

    const match = await Match.findOne({
      where: {
        id: matchId,
        [Op.or]: [{ user1_id: req.user.id }, { user2_id: req.user.id }],
        is_active: true,
      },
      include: [
        {
          model: User,
          as: "user1",
          include: [
            { model: Photo, as: "photos", where: { moderation_status: "approved" }, required: false },
            { model: Profile, as: "profile", include: ["originCountry"] },
          ],
          attributes: [
            "id",
            "first_name",
            "date_of_birth",
            "city",
            "country",
            "is_verified",
            "is_premium",
            "last_active",
          ],
        },
        {
          model: User,
          as: "user2",
          include: [
            { model: Photo, as: "photos", where: { moderation_status: "approved" }, required: false },
            { model: Profile, as: "profile", include: ["originCountry"] },
          ],
          attributes: [
            "id",
            "first_name",
            "date_of_birth",
            "city",
            "country",
            "is_verified",
            "is_premium",
            "last_active",
          ],
        },
      ],
    })

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match non trouvé.",
      })
    }

    const otherUser = match.user1_id === req.user.id ? match.user2 : match.user1

    res.json({
      success: true,
      data: {
        match: {
          id: match.id,
          matched_at: match.created_at,
          user: {
            id: otherUser.id,
            first_name: otherUser.first_name,
            age: otherUser.getAge(),
            city: otherUser.city,
            country: otherUser.country,
            is_verified: otherUser.is_verified,
            is_premium: otherUser.is_premium,
            is_online: isOnline(otherUser.last_active),
            photos: otherUser.photos?.map((p) => ({ id: p.id, url: p.url, is_primary: p.is_primary })),
            profile: otherUser.profile,
          },
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du match.",
    })
  }
}

export const unmatch = async (req, res) => {
  try {
    const { matchId } = req.params

    const match = await Match.findOne({
      where: {
        id: matchId,
        [Op.or]: [{ user1_id: req.user.id }, { user2_id: req.user.id }],
      },
    })

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match non trouvé.",
      })
    }

    await match.update({
      is_active: false,
      unmatched_by: req.user.id,
      unmatched_at: new Date(),
    })

    res.json({
      success: true,
      message: "Vous avez supprimé ce match.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du match.",
    })
  }
}
