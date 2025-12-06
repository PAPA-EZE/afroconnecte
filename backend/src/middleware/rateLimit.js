const requestCounts = new Map()

export const rateLimit = (options = {}) => {
  const {
    windowMs = 60000, // 1 minute par défaut
    max = 100, // 100 requêtes max par défaut
    message = "Trop de requêtes, veuillez réessayer plus tard.",
  } = options

  return (req, res, next) => {
    const key = `${req.ip}-${req.path}`
    const now = Date.now()

    if (!requestCounts.has(key)) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs })
      return next()
    }

    const record = requestCounts.get(key)

    if (now > record.resetTime) {
      record.count = 1
      record.resetTime = now + windowMs
      return next()
    }

    if (record.count >= max) {
      return res.status(429).json({
        success: false,
        message,
      })
    }

    record.count++
    next()
  }
}

// Rate limits spécifiques
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
})

export const swipeRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: "Vous swipez trop vite ! Prenez le temps de regarder les profils.",
})

export const messageRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Trop de messages envoyés. Attendez un moment.",
})
