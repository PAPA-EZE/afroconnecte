import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Subscription = sequelize.define(
  "Subscription",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    plan_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "plans",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "cancelled", "expired", "pending", "trial"),
      defaultValue: "pending",
    },
    payment_provider: {
      type: DataTypes.ENUM("stripe", "paystack", "flutterwave", "paypal"),
      allowNull: true,
    },
    payment_provider_subscription_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    trial_ends_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "EUR",
    },
  },
  {
    tableName: "subscriptions",
  },
)

export default Subscription
