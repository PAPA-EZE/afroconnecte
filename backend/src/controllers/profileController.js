import { User, Profile, Language, UserLanguage, Ethnicity, Country } from "../models/index.js"

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          association: "profile",
          include: ["ethnicity", "originCountry"],
        },
        {
          association: "photos",
          where: { moderation_status: "approved" },
          required: false,
          order: [["order", "ASC"]],
        },
        "languages",
      ],
      attributes: { exclude: ["password"] },
    })

    res.json({
      success: true,
      data: { user },
    })
  } catch (error) {
    console.error("Erreur getProfile:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil.",
    })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      looking_for,
      city,
      country,
      latitude,
      longitude,
      // Profile fields
      bio,
      ethnicity_id,
      origin_country_id,
      origin_region,
      religion,
      education,
      occupation,
      height_cm,
      relationship_goal,
      has_children,
      wants_children,
      smoking,
      drinking,
      favorite_cuisine,
      cultural_values,
      interests,
      music_preferences,
      min_age_preference,
      max_age_preference,
      max_distance_km,
      show_distance,
      show_age,
    } = req.body

    // Mettre à jour User
    const userUpdates = {}
    if (first_name) userUpdates.first_name = first_name
    if (last_name !== undefined) userUpdates.last_name = last_name
    if (gender) userUpdates.gender = gender
    if (looking_for) userUpdates.looking_for = looking_for
    if (city) userUpdates.city = city
    if (country) userUpdates.country = country
    if (latitude) userUpdates.latitude = latitude
    if (longitude) userUpdates.longitude = longitude

    if (Object.keys(userUpdates).length > 0) {
      await User.update(userUpdates, { where: { id: req.user.id } })
    }

    // Mettre à jour Profile
    const profileUpdates = {}
    if (bio !== undefined) profileUpdates.bio = bio
    if (ethnicity_id !== undefined) profileUpdates.ethnicity_id = ethnicity_id
    if (origin_country_id !== undefined) profileUpdates.origin_country_id = origin_country_id
    if (origin_region !== undefined) profileUpdates.origin_region = origin_region
    if (religion !== undefined) profileUpdates.religion = religion
    if (education !== undefined) profileUpdates.education = education
    if (occupation !== undefined) profileUpdates.occupation = occupation
    if (height_cm !== undefined) profileUpdates.height_cm = height_cm
    if (relationship_goal !== undefined) profileUpdates.relationship_goal = relationship_goal
    if (has_children !== undefined) profileUpdates.has_children = has_children
    if (wants_children !== undefined) profileUpdates.wants_children = wants_children
    if (smoking !== undefined) profileUpdates.smoking = smoking
    if (drinking !== undefined) profileUpdates.drinking = drinking
    if (favorite_cuisine !== undefined) profileUpdates.favorite_cuisine = favorite_cuisine
    if (cultural_values !== undefined) profileUpdates.cultural_values = cultural_values
    if (interests !== undefined) profileUpdates.interests = interests
    if (music_preferences !== undefined) profileUpdates.music_preferences = music_preferences
    if (min_age_preference !== undefined) profileUpdates.min_age_preference = min_age_preference
    if (max_age_preference !== undefined) profileUpdates.max_age_preference = max_age_preference
    if (max_distance_km !== undefined) profileUpdates.max_distance_km = max_distance_km
    if (show_distance !== undefined) profileUpdates.show_distance = show_distance
    if (show_age !== undefined) profileUpdates.show_age = show_age

    if (Object.keys(profileUpdates).length > 0) {
      await Profile.update(profileUpdates, { where: { user_id: req.user.id } })
    }

    // Récupérer le profil mis à jour
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
      message: "Profil mis à jour avec succès.",
      data: { user },
    })
  } catch (error) {
    console.error("Erreur updateProfile:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du profil.",
    })
  }
}

export const updateLanguages = async (req, res) => {
  try {
    const { languages } = req.body // [{ language_id, proficiency }]

    // Supprimer les langues existantes
    await UserLanguage.destroy({ where: { user_id: req.user.id } })

    // Ajouter les nouvelles langues
    if (languages && languages.length > 0) {
      const userLanguages = languages.map((lang) => ({
        user_id: req.user.id,
        language_id: lang.language_id,
        proficiency: lang.proficiency || "intermediate",
      }))

      await UserLanguage.bulkCreate(userLanguages)
    }

    const user = await User.findByPk(req.user.id, {
      include: ["languages"],
    })

    res.json({
      success: true,
      message: "Langues mises à jour.",
      data: { languages: user.languages },
    })
  } catch (error) {
    console.error("Erreur updateLanguages:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour des langues.",
    })
  }
}

export const completeOnboarding = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: ["photos", "profile"],
    })

    // Vérifier que le profil est complet
    const profile = user.profile
    const photos = user.photos

    const errors = []

    if (!user.date_of_birth) errors.push("Date de naissance manquante")
    if (!user.gender) errors.push("Genre manquant")
    if (!profile?.origin_country_id) errors.push("Pays d'origine manquant")
    if (photos.length === 0) errors.push("Au moins une photo est requise")

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Profil incomplet",
        errors,
      })
    }

    await user.update({ onboarding_completed: true })

    res.json({
      success: true,
      message: "Onboarding terminé ! Vous pouvez maintenant découvrir des profils.",
    })
  } catch (error) {
    console.error("Erreur completeOnboarding:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la finalisation de l'onboarding.",
    })
  }
}

export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, city, country } = req.body

    await User.update({ latitude, longitude, city, country }, { where: { id: req.user.id } })

    res.json({
      success: true,
      message: "Localisation mise à jour.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la localisation.",
    })
  }
}

// Passport (Premium)
export const setPassportLocation = async (req, res) => {
  try {
    const { latitude, longitude, city, country } = req.body

    await User.update(
      {
        passport_location: {
          latitude,
          longitude,
          city,
          country,
          set_at: new Date(),
        },
      },
      { where: { id: req.user.id } },
    )

    res.json({
      success: true,
      message: `Localisation Passport définie sur ${city}, ${country}.`,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la définition de la localisation Passport.",
    })
  }
}

export const clearPassportLocation = async (req, res) => {
  try {
    await User.update({ passport_location: null }, { where: { id: req.user.id } })

    res.json({
      success: true,
      message: "Localisation Passport réinitialisée.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la réinitialisation.",
    })
  }
}

// Toggle Incognito (Premium)
export const toggleIncognito = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    const newStatus = !user.is_incognito

    await user.update({ is_incognito: newStatus })

    res.json({
      success: true,
      message: newStatus ? "Mode Incognito activé." : "Mode Incognito désactivé.",
      data: { is_incognito: newStatus },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du changement de mode.",
    })
  }
}

// Obtenir les données de référence
export const getEthnicities = async (req, res) => {
  try {
    const ethnicities = await Ethnicity.findAll({
      order: [["name", "ASC"]],
    })

    res.json({
      success: true,
      data: { ethnicities },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des ethnies.",
    })
  }
}

export const getCountries = async (req, res) => {
  try {
    const countries = await Country.findAll({
      order: [["name", "ASC"]],
    })

    res.json({
      success: true,
      data: { countries },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des pays.",
    })
  }
}

export const getLanguages = async (req, res) => {
  try {
    const languages = await Language.findAll({
      order: [["name", "ASC"]],
    })

    res.json({
      success: true,
      data: { languages },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des langues.",
    })
  }
}
