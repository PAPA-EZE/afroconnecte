import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reporter_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    reported_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    reason: {
      type: DataTypes.ENUM("fake_profile", "inappropriate_content", "harassment", "spam", "scam", "underage", "other"),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    evidence_urls: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Screenshots ou autres preuves",
    },
    status: {
      type: DataTypes.ENUM("pending", "under_review", "resolved", "dismissed"),
      defaultValue: "pending",
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resolved_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "reports",
  },
)

export default Report
