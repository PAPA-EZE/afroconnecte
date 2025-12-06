import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"
import bcrypt from "bcryptjs"

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable pour OAuth
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAdult(value) {
          const today = new Date()
          const birthDate = new Date(value)
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          if (age < 18) {
            throw new Error("Vous devez avoir au moins 18 ans.")
          }
        },
      },
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "non_binary", "other"),
      allowNull: false,
    },
    looking_for: {
      type: DataTypes.ENUM("male", "female", "both", "everyone"),
      allowNull: false,
      defaultValue: "everyone",
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verification_photo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_incognito: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    passport_location: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Localisation "Passport" pour les utilisateurs Premium',
    },
    last_active: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    oauth_provider: {
      type: DataTypes.ENUM("google", "facebook", "apple"),
      allowNull: true,
    },
    oauth_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    daily_likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    daily_likes_reset_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    daily_super_likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    daily_super_likes_reset_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    onboarding_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fcm_token: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Firebase Cloud Messaging token pour les notifications push",
    },
  },
  {
    tableName: "users",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(12)
          user.password = await bcrypt.hash(user.password, salt)
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password") && user.password) {
          const salt = await bcrypt.genSalt(12)
          user.password = await bcrypt.hash(user.password, salt)
        }
      },
    },
  },
)

// Méthodes d'instance
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

User.prototype.getAge = function () {
  const today = new Date()
  const birthDate = new Date(this.date_of_birth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

User.prototype.canLike = function () {
  if (this.is_premium) return true

  const now = new Date()
  const resetAt = new Date(this.daily_likes_reset_at)

  // Reset quotidien
  if (now.toDateString() !== resetAt.toDateString()) {
    return true
  }

  return this.daily_likes_count < 50 // Limite gratuite: 50 likes/jour
}

User.prototype.canSuperLike = function () {
  const now = new Date()
  const resetAt = new Date(this.daily_super_likes_reset_at)

  // Reset quotidien
  if (now.toDateString() !== resetAt.toDateString()) {
    return true
  }

  const limit = this.is_premium ? 5 : 1
  return this.daily_super_likes_count < limit
}

User.prototype.toPublicJSON = function () {
  return {
    id: this.id,
    first_name: this.first_name,
    age: this.getAge(),
    gender: this.gender,
    city: this.city,
    country: this.country,
    is_verified: this.is_verified,
    is_premium: this.is_premium,
    last_active: this.last_active,
  }
}

export default User
