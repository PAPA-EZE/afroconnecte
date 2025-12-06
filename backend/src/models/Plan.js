import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Plan = sequelize.define(
  "Plan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price_monthly: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price_yearly: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "EUR",
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Liste des fonctionnalités incluses",
    },
    daily_likes_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      comment: "Limite de likes par jour (null = illimité)",
    },
    daily_super_likes: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    can_see_who_liked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_rewind: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_use_incognito: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_use_passport: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_use_advanced_filters: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_see_read_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    monthly_boosts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    priority_messages: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    stripe_price_id_monthly: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stripe_price_id_yearly: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "plans",
  },
)

export default Plan
