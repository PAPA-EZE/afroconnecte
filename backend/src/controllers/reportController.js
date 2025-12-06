import { Report, Block, User, Match, Like } from "../models/index.js"
import { Op } from "sequelize"

export const reportUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { reason, description, evidence_urls } = req.body

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas vous signaler vous-même.",
      })
    }

    const targetUser = await User.findByPk(userId)
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé.",
      })
    }

    // Vérifier si déjà signalé récemment
    const existingReport = await Report.findOne({
      where: {
        reporter_id: req.user.id,
        reported_id: userId,
        created_at: { [Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    })

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "Vous avez déjà signalé cet utilisateur récemment.",
      })
    }

    await Report.create({
      reporter_id: req.user.id,
      reported_id: userId,
      reason,
      description,
      evidence_urls,
    })

    res.json({
      success: true,
      message: "Signalement envoyé. Notre équipe va examiner ce profil.",
    })
  } catch (error) {
    console.error("Erreur reportUser:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors du signalement.",
    })
  }
}

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { reason } = req.body

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas vous bloquer vous-même.",
      })
    }

    const [block, created] = await Block.findOrCreate({
      where: {
        blocker_id: req.user.id,
        blocked_id: userId,
      },
      defaults: { reason },
    })

    if (!created) {
      return res.status(400).json({
        success: false,
        message: "Cet utilisateur est déjà bloqué.",
      })
    }

    // Supprimer les matchs existants
    await Match.update(
      { is_active: false, unmatched_by: req.user.id, unmatched_at: new Date() },
      {
        where: {
          [Op.or]: [
            { user1_id: req.user.id, user2_id: userId },
            { user1_id: userId, user2_id: req.user.id },
          ],
        },
      },
    )

    // Supprimer les likes
    await Like.destroy({
      where: {
        [Op.or]: [
          { liker_id: req.user.id, liked_id: userId },
          { liker_id: userId, liked_id: req.user.id },
        ],
      },
    })

    res.json({
      success: true,
      message: "Utilisateur bloqué. Vous ne verrez plus ce profil.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du blocage.",
    })
  }
}

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params

    const deleted = await Block.destroy({
      where: {
        blocker_id: req.user.id,
        blocked_id: userId,
      },
    })

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Cet utilisateur n'est pas bloqué.",
      })
    }

    res.json({
      success: true,
      message: "Utilisateur débloqué.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du déblocage.",
    })
  }
}

export const getBlockedUsers = async (req, res) => {
  try {
    const blocks = await Block.findAll({
      where: { blocker_id: req.user.id },
      include: [
        {
          model: User,
          as: "blocked",
          attributes: ["id", "first_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    })

    res.json({
      success: true,
      data: {
        blocked_users: blocks.map((b) => ({
          id: b.blocked.id,
          first_name: b.blocked.first_name,
          blocked_at: b.created_at,
        })),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération.",
    })
  }
}
