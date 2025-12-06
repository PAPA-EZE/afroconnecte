import jwt from "jsonwebtoken"
import { User, Profile } from "../models/index.js"
import { Op } from "sequelize"

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" })

  const refreshToken = jwt.sign({ userId, type: "refresh" }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  })

  return { accessToken, refreshToken }
}

export const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, date_of_birth, gender } = req.body

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé.",
      })
    }

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password,
      first_name,
      last_name,
      date_of_birth,
      gender,
      looking_for: "everyone",
    })

    // Créer le profil vide
    await Profile.create({ user_id: user.id })

    const { accessToken, refreshToken } = generateTokens(user.id)

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          is_premium: user.is_premium,
          onboarding_completed: user.onboarding_completed,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    })
  } catch (error) {
    console.error("Erreur inscription:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect.",
      })
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Ce compte utilise une connexion sociale. Veuillez utiliser Google ou Facebook.",
      })
    }

    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect.",
      })
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Ce compte a été désactivé.",
      })
    }

    await user.update({ last_active: new Date() })

    const { accessToken, refreshToken } = generateTokens(user.id)

    res.json({
      success: true,
      message: "Connexion réussie",
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          is_premium: user.is_premium,
          is_verified: user.is_verified,
          onboarding_completed: user.onboarding_completed,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    })
  } catch (error) {
    console.error("Erreur connexion:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion.",
    })
  }
}

export const oauthLogin = async (req, res) => {
  try {
    const { provider, oauth_id, email, first_name, last_name } = req.body

    let user = await User.findOne({
      where: {
        [Op.or]: [{ oauth_id, oauth_provider: provider }, { email }],
      },
    })

    let isNewUser = false

    if (!user) {
      // Créer un nouvel utilisateur OAuth
      user = await User.create({
        email,
        first_name,
        last_name,
        oauth_provider: provider,
        oauth_id,
        date_of_birth: new Date("1990-01-01"), // À compléter dans l'onboarding
        gender: "other", // À compléter dans l'onboarding
        email_verified_at: new Date(),
      })

      await Profile.create({ user_id: user.id })
      isNewUser = true
    } else if (!user.oauth_id) {
      // Lier le compte OAuth à un compte existant
      await user.update({
        oauth_provider: provider,
        oauth_id,
        email_verified_at: user.email_verified_at || new Date(),
      })
    }

    await user.update({ last_active: new Date() })

    const { accessToken, refreshToken } = generateTokens(user.id)

    res.json({
      success: true,
      message: isNewUser ? "Compte créé avec succès" : "Connexion réussie",
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          is_premium: user.is_premium,
          is_verified: user.is_verified,
          onboarding_completed: user.onboarding_completed,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
        is_new_user: isNewUser,
      },
    })
  } catch (error) {
    console.error("Erreur OAuth:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion sociale.",
    })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token requis.",
      })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        success: false,
        message: "Token invalide.",
      })
    }

    const user = await User.findByPk(decoded.userId)
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé ou désactivé.",
      })
    }

    const tokens = generateTokens(user.id)

    res.json({
      success: true,
      data: { tokens },
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Refresh token invalide ou expiré.",
    })
  }
}

export const logout = async (req, res) => {
  try {
    // Côté serveur, on peut invalider le token en stockant une liste noire
    // Pour simplifier, on indique juste le succès
    res.json({
      success: true,
      message: "Déconnexion réussie.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la déconnexion.",
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          association: "profile",
          include: ["ethnicity", "originCountry"],
        },
        "photos",
        "languages",
      ],
      attributes: { exclude: ["password"] },
    })

    res.json({
      success: true,
      data: { user },
    })
  } catch (error) {
    console.error("Erreur getMe:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil.",
    })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body

    const user = await User.findByPk(req.user.id)

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Ce compte utilise une connexion sociale.",
      })
    }

    const isValidPassword = await user.comparePassword(current_password)
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Mot de passe actuel incorrect.",
      })
    }

    await user.update({ password: new_password })

    res.json({
      success: true,
      message: "Mot de passe modifié avec succès.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du changement de mot de passe.",
    })
  }
}
