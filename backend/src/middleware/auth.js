import jwt from "jsonwebtoken"
import { User } from "../models/index.js"

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé. Token manquant.",
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé.",
      })
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Compte désactivé.",
      })
    }

    // Mettre à jour last_active
    await user.update({ last_active: new Date() })

    req.user = user
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expiré. Veuillez vous reconnecter.",
      })
    }

    return res.status(401).json({
      success: false,
      message: "Token invalide.",
    })
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next()
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    })

    if (user && user.is_active) {
      req.user = user
    }

    next()
  } catch (error) {
    next()
  }
}

export const requirePremium = (req, res, next) => {
  if (!req.user.is_premium) {
    return res.status(403).json({
      success: false,
      message: "Cette fonctionnalité nécessite un abonnement Premium.",
      upgrade_required: true,
    })
  }
  next()
}

export const requireVerified = (req, res, next) => {
  if (!req.user.is_verified) {
    return res.status(403).json({
      success: false,
      message: "Veuillez vérifier votre profil pour accéder à cette fonctionnalité.",
    })
  }
  next()
}

export const requireOnboarding = (req, res, next) => {
  if (!req.user.onboarding_completed) {
    return res.status(403).json({
      success: false,
      message: "Veuillez compléter votre profil.",
      redirect: "/onboarding",
    })
  }
  next()
}
