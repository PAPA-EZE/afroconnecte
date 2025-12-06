import { body, param, query, validationResult } from "express-validator"

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    })
  }
  next()
}

// Validateurs d'inscription
export const registerValidators = [
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"),
  body("first_name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Le prénom doit contenir entre 2 et 100 caractères"),
  body("date_of_birth").isDate().withMessage("Date de naissance invalide"),
  body("gender").isIn(["male", "female", "non_binary", "other"]).withMessage("Genre invalide"),
  handleValidation,
]

// Validateurs de connexion
export const loginValidators = [
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password").notEmpty().withMessage("Mot de passe requis"),
  handleValidation,
]

// Validateurs de profil
export const profileValidators = [
  body("bio").optional().isLength({ max: 500 }).withMessage("La bio ne peut pas dépasser 500 caractères"),
  body("min_age_preference").optional().isInt({ min: 18, max: 100 }).withMessage("Âge minimum invalide"),
  body("max_age_preference").optional().isInt({ min: 18, max: 100 }).withMessage("Âge maximum invalide"),
  body("max_distance_km").optional().isInt({ min: 1, max: 500 }).withMessage("Distance invalide"),
  handleValidation,
]

// Validateurs de swipe
export const swipeValidators = [
  param("userId").isUUID().withMessage("ID utilisateur invalide"),
  body("action").isIn(["like", "pass", "super_like"]).withMessage("Action invalide"),
  handleValidation,
]

// Validateurs de message
export const messageValidators = [
  param("matchId").isUUID().withMessage("ID de match invalide"),
  body("content").optional().isLength({ max: 2000 }).withMessage("Message trop long"),
  body("message_type")
    .optional()
    .isIn(["text", "image", "voice", "gif", "ice_breaker"])
    .withMessage("Type de message invalide"),
  handleValidation,
]

// Validateurs de filtres de découverte
export const discoveryFiltersValidators = [
  query("min_age").optional().isInt({ min: 18, max: 100 }),
  query("max_age").optional().isInt({ min: 18, max: 100 }),
  query("max_distance").optional().isInt({ min: 1, max: 500 }),
  query("gender").optional().isIn(["male", "female", "both", "everyone"]),
  handleValidation,
]

// Validateurs Premium (filtres avancés)
export const advancedFiltersValidators = [
  query("ethnicity_id").optional().isUUID(),
  query("country_id").optional().isUUID(),
  query("religion")
    .optional()
    .isIn(["christianity", "islam", "traditional", "judaism", "buddhism", "hinduism", "other", "none"]),
  query("education").optional().isIn(["high_school", "some_college", "bachelor", "master", "doctorate", "other"]),
  query("relationship_goal").optional().isIn(["serious", "casual", "friendship", "networking", "not_sure"]),
  handleValidation,
]
