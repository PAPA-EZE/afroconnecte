import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Block = sequelize.define(
  "Block",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    blocker_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    blocked_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "blocks",
    indexes: [
      {
        unique: true,
        fields: ["blocker_id", "blocked_id"],
      },
    ],
  },
)

export default Block
