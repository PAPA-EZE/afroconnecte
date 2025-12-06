import { User, Profile, Photo, Like, Match, Block, Boost, SuperLike } from "../models/index.js"
import { Op, Sequelize, literal } from "sequelize"

// Calcul de distance Haversine en SQL
const haversineDistance = (lat1, lon1, lat2Col, lon2Col) => {
  return literal(`
    6371 * acos(
      cos(radians(${lat1})) * cos(radians(${lat2Col})) * 
      cos(radians(${lon2Col}) - radians(${lon1})) + 
      sin(radians(${lat1})) * sin(radians(${lat2Col}))
    )
  `)
}

export const getDiscoveryProfiles = async (req, res) => {
  try {
    const currentUser = await User.findByPk(req.user.id, {
      include: ["profile"],
    })

    const profile = currentUser.profile

    // Déterminer la localisation (Passport si Premium, sinon réelle)
    let userLat, userLon
    if (currentUser.is_premium && currentUser.passport_location) {
      userLat = currentUser.passport_location.latitude
      userLon = currentUser.passport_location.longitude
    } else {
      userLat = currentUser.latitude
      userLon = currentUser.longitude
    }

    // Filtres de base
    const {
      min_age = profile?.min_age_preference || 18,
      max_age = profile?.max_age_preference || 50,
      max_distance = profile?.max_distance_km || 50,
      gender,
    } = req.query

    // Filtres avancés (Premium uniquement)
    const advancedFilters = {}
    if (currentUser.is_premium) {
      const { ethnicity_id, country_id, religion, education, relationship_goal } = req.query
      if (ethnicity_id) advancedFilters["$profile.ethnicity_id$"] = ethnicity_id
      if (country_id) advancedFilters["$profile.origin_country_id$"] = country_id
      if (religion) advancedFilters["$profile.religion$"] = religion
      if (education) advancedFilters["$profile.education$"] = education
      if (relationship_goal) advancedFilters["$profile.relationship_goal$"] = relationship_goal
    }

    // Récupérer les utilisateurs déjà likés/passés
    const interactedUsers = await Like.findAll({
      where: { liker_id: currentUser.id },
      attributes: ["liked_id"],
    })
    const interactedIds = interactedUsers.map((l) => l.liked_id)

    // Récupérer les utilisateurs bloqués
    const blockedUsers = await Block.findAll({
      where: {
        [Op.or]: [{ blocker_id: currentUser.id }, { blocked_id: currentUser.id }],
      },
      attributes: ["blocker_id", "blocked_id"],
    })
    const blockedIds = blockedUsers.map((b) => (b.blocker_id === currentUser.id ? b.blocked_id : b.blocker_id))

    // Exclure les IDs
    const excludeIds = [...new Set([currentUser.id, ...interactedIds, ...blockedIds])]

    // Construire le filtre de genre
    const genderFilter = {}
    const lookingFor = gender || currentUser.looking_for
    if (lookingFor === "male") {
      genderFilter.gender = "male"
    } else if (lookingFor === "female") {
      genderFilter.gender = "female"
    } else if (lookingFor === "both") {
      genderFilter.gender = { [Op.in]: ["male", "female"] }
    }

    // Calculer la date de naissance pour le filtre d'âge
    const today = new Date()
    const minBirthDate = new Date(today.getFullYear() - max_age, today.getMonth(), today.getDate())
    const maxBirthDate = new Date(today.getFullYear() - min_age, today.getMonth(), today.getDate())

    // Récupérer les profils boostés
    const boostedUserIds = await Boost.findAll({
      where: {
        is_active: true,
        expires_at: { [Op.gt]: new Date() },
        user_id: { [Op.notIn]: excludeIds },
      },
      attributes: ["user_id"],
    }).then((boosts) => boosts.map((b) => b.user_id))

    // Requête principale
    const profiles = await User.findAll({
      where: {
        id: { [Op.notIn]: excludeIds },
        is_active: true,
        is_incognito: false,
        onboarding_completed: true,
        date_of_birth: {
          [Op.between]: [minBirthDate, maxBirthDate],
        },
        ...genderFilter,
        ...advancedFilters,
      },
      include: [
        {
          model: Profile,
          as: "profile",
          include: ["ethnicity", "originCountry"],
        },
        {
          model: Photo,
          as: "photos",
          where: { moderation_status: "approved" },
          required: false,
        },
        "languages",
      ],
      attributes: {
        include: userLat && userLon ? [[haversineDistance(userLat, userLon, "latitude", "longitude"), "distance"]] : [],
        exclude: ["password", "email", "oauth_id"],
      },
      having:
        userLat && userLon
          ? Sequelize.where(haversineDistance(userLat, userLon, "latitude", "longitude"), "<=", max_distance)
          : undefined,
      order: [
        // Boosted profiles first
        [Sequelize.literal(`FIELD(User.id, '${boostedUserIds.join("','")}')`), "DESC"],
        // Then by distance
        userLat && userLon ? [Sequelize.literal("distance"), "ASC"] : ["last_active", "DESC"],
      ],
      limit: 50,
    })

    // Formater les résultats
    const formattedProfiles = profiles.map((user) => ({
      id: user.id,
      first_name: user.first_name,
      age: user.getAge(),
      gender: user.gender,
      city: user.city,
      country: user.country,
      is_verified: user.is_verified,
      is_premium: user.is_premium,
      distance: user.dataValues.distance ? Math.round(user.dataValues.distance) : null,
      is_boosted: boostedUserIds.includes(user.id),
      profile: user.profile
        ? {
            bio: user.profile.bio,
            ethnicity: user.profile.ethnicity,
            originCountry: user.profile.originCountry,
            religion: user.profile.religion,
            education: user.profile.education,
            occupation: user.profile.occupation,
            height_cm: user.profile.height_cm,
            relationship_goal: user.profile.relationship_goal,
            favorite_cuisine: user.profile.favorite_cuisine,
            cultural_values: user.profile.cultural_values,
            interests: user.profile.interests,
            music_preferences: user.profile.music_preferences,
          }
        : null,
      photos:
        user.photos
          ?.filter((p) => p.moderation_status === "approved")
          .map((p) => ({
            id: p.id,
            url: p.url,
            is_primary: p.is_primary,
          })) || [],
      languages:
        user.languages?.map((l) => ({
          id: l.id,
          name: l.name,
          proficiency: l.UserLanguage?.proficiency,
        })) || [],
    }))

    res.json({
      success: true,
      data: {
        profiles: formattedProfiles,
        remaining_likes: currentUser.is_premium ? null : 50 - currentUser.daily_likes_count,
        remaining_super_likes: currentUser.is_premium
          ? 5 - currentUser.daily_super_likes_count
          : 1 - currentUser.daily_super_likes_count,
      },
    })
  } catch (error) {
    console.error("Erreur getDiscoveryProfiles:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des profils.",
    })
  }
}

export const swipeProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const { action } = req.body // 'like', 'pass', 'super_like'
    const currentUser = await User.findByPk(req.user.id)

    // Vérifier que l'utilisateur cible existe
    const targetUser = await User.findByPk(userId)
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé.",
      })
    }

    if (action === "pass") {
      // Enregistrer le pass (pour ne plus montrer ce profil)
      await Like.create({
        liker_id: currentUser.id,
        liked_id: userId,
        is_super_like: false,
      })

      return res.json({
        success: true,
        data: { action: "pass" },
      })
    }

    // Vérifier les limites de likes
    if (action === "like") {
      if (!currentUser.canLike()) {
        return res.status(403).json({
          success: false,
          message: "Limite de likes quotidienne atteinte.",
          upgrade_required: true,
        })
      }
    }

    if (action === "super_like") {
      if (!currentUser.canSuperLike()) {
        return res.status(403).json({
          success: false,
          message: "Limite de Super Likes quotidienne atteinte.",
          upgrade_required: !currentUser.is_premium,
        })
      }
    }

    // Créer le like
    const [like, created] = await Like.findOrCreate({
      where: { liker_id: currentUser.id, liked_id: userId },
      defaults: { is_super_like: action === "super_like" },
    })

    if (!created) {
      return res.status(400).json({
        success: false,
        message: "Vous avez déjà interagi avec ce profil.",
      })
    }

    // Mettre à jour les compteurs
    const now = new Date()
    if (action === "like") {
      if (now.toDateString() !== new Date(currentUser.daily_likes_reset_at).toDateString()) {
        await currentUser.update({
          daily_likes_count: 1,
          daily_likes_reset_at: now,
        })
      } else {
        await currentUser.increment("daily_likes_count")
      }
    } else if (action === "super_like") {
      // Créer aussi un enregistrement SuperLike
      await SuperLike.create({
        liker_id: currentUser.id,
        liked_id: userId,
      })

      if (now.toDateString() !== new Date(currentUser.daily_super_likes_reset_at).toDateString()) {
        await currentUser.update({
          daily_super_likes_count: 1,
          daily_super_likes_reset_at: now,
        })
      } else {
        await currentUser.increment("daily_super_likes_count")
      }
    }

    // Vérifier s'il y a un match
    const reciprocalLike = await Like.findOne({
      where: {
        liker_id: userId,
        liked_id: currentUser.id,
      },
    })

    let isMatch = false
    let matchData = null

    if (reciprocalLike) {
      isMatch = true

      // Créer le match
      const match = await Match.create({
        user1_id: currentUser.id,
        user2_id: userId,
      })

      // Récupérer les infos du match
      const matchedUser = await User.findByPk(userId, {
        include: [
          {
            model: Photo,
            as: "photos",
            where: { is_primary: true },
            required: false,
          },
        ],
        attributes: ["id", "first_name", "is_verified", "is_premium"],
      })

      matchData = {
        match_id: match.id,
        user: {
          id: matchedUser.id,
          first_name: matchedUser.first_name,
          photo: matchedUser.photos?.[0]?.url,
          is_verified: matchedUser.is_verified,
        },
      }
    }

    res.json({
      success: true,
      data: {
        action: action,
        is_match: isMatch,
        match: matchData,
        remaining_likes: currentUser.is_premium ? null : 50 - currentUser.daily_likes_count - 1,
        remaining_super_likes:
          action === "super_like"
            ? (currentUser.is_premium ? 5 : 1) - currentUser.daily_super_likes_count - 1
            : undefined,
      },
    })
  } catch (error) {
    console.error("Erreur swipeProfile:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors du swipe.",
    })
  }
}

// Rewind (Premium)
export const rewindLastSwipe = async (req, res) => {
  try {
    // Récupérer le dernier like
    const lastLike = await Like.findOne({
      where: { liker_id: req.user.id },
      order: [["created_at", "DESC"]],
    })

    if (!lastLike) {
      return res.status(404).json({
        success: false,
        message: "Aucun swipe à annuler.",
      })
    }

    // Vérifier si c'était un super like
    if (lastLike.is_super_like) {
      await SuperLike.destroy({
        where: {
          liker_id: req.user.id,
          liked_id: lastLike.liked_id,
        },
      })
    }

    // Supprimer un éventuel match créé
    await Match.destroy({
      where: {
        [Op.or]: [
          { user1_id: req.user.id, user2_id: lastLike.liked_id },
          { user1_id: lastLike.liked_id, user2_id: req.user.id },
        ],
      },
    })

    // Supprimer le like
    await lastLike.destroy()

    res.json({
      success: true,
      message: "Dernier swipe annulé.",
      data: { undone_user_id: lastLike.liked_id },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du rewind.",
    })
  }
}

// Voir qui m'a liké (Premium)
export const getWhoLikedMe = async (req, res) => {
  try {
    const likes = await Like.findAll({
      where: { liked_id: req.user.id },
      include: [
        {
          model: User,
          as: "liker",
          include: [
            {
              model: Photo,
              as: "photos",
              where: { is_primary: true },
              required: false,
            },
            {
              model: Profile,
              as: "profile",
              include: ["originCountry"],
            },
          ],
          attributes: ["id", "first_name", "date_of_birth", "city", "country", "is_verified", "is_premium"],
        },
      ],
      order: [["created_at", "DESC"]],
    })

    // Vérifier si on a déjà liké en retour (= match potentiel)
    const myLikes = await Like.findAll({
      where: { liker_id: req.user.id },
      attributes: ["liked_id"],
    })
    const myLikedIds = myLikes.map((l) => l.liked_id)

    const formattedLikes = likes
      .filter((l) => l.liker && !myLikedIds.includes(l.liker.id))
      .map((l) => ({
        id: l.liker.id,
        first_name: l.liker.first_name,
        age: l.liker.getAge(),
        city: l.liker.city,
        country: l.liker.country,
        is_verified: l.liker.is_verified,
        is_super_like: l.is_super_like,
        photo: l.liker.photos?.[0]?.url,
        origin_country: l.liker.profile?.originCountry?.name,
        liked_at: l.created_at,
      }))

    res.json({
      success: true,
      data: {
        likes: formattedLikes,
        total: formattedLikes.length,
      },
    })
  } catch (error) {
    console.error("Erreur getWhoLikedMe:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des likes.",
    })
  }
}

// Activer un Boost (Premium)
export const activateBoost = async (req, res) => {
  try {
    // Vérifier s'il y a un boost actif
    const activeBoost = await Boost.findOne({
      where: {
        user_id: req.user.id,
        is_active: true,
        expires_at: { [Op.gt]: new Date() },
      },
    })

    if (activeBoost) {
      return res.status(400).json({
        success: false,
        message: "Vous avez déjà un boost actif.",
        data: {
          expires_at: activeBoost.expires_at,
        },
      })
    }

    // Créer le boost (30 minutes)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

    const boost = await Boost.create({
      user_id: req.user.id,
      expires_at: expiresAt,
    })

    res.json({
      success: true,
      message: "Boost activé pour 30 minutes !",
      data: {
        boost_id: boost.id,
        expires_at: expiresAt,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'activation du boost.",
    })
  }
}

// Obtenir un profil spécifique
export const getProfileById = async (req, res) => {
  try {
    const { userId } = req.params

    // Vérifier si bloqué
    const isBlocked = await Block.findOne({
      where: {
        [Op.or]: [
          { blocker_id: req.user.id, blocked_id: userId },
          { blocker_id: userId, blocked_id: req.user.id },
        ],
      },
    })

    if (isBlocked) {
      return res.status(404).json({
        success: false,
        message: "Profil non disponible.",
      })
    }

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Profile,
          as: "profile",
          include: ["ethnicity", "originCountry"],
        },
        {
          model: Photo,
          as: "photos",
          where: { moderation_status: "approved" },
          required: false,
        },
        "languages",
      ],
      attributes: { exclude: ["password", "email", "oauth_id"] },
    })

    if (!user || !user.is_active) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé.",
      })
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          first_name: user.first_name,
          age: user.getAge(),
          gender: user.gender,
          city: user.city,
          country: user.country,
          is_verified: user.is_verified,
          is_premium: user.is_premium,
          profile: user.profile,
          photos: user.photos,
          languages: user.languages,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil.",
    })
  }
}
