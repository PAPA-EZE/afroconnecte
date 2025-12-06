import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Match = sequelize.define(
  "Match",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user1_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    user2_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    unmatched_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    unmatched_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "matches",
    indexes: [
      {
        unique: true,
        fields: ["user1_id", "user2_id"],
      },
    ],
  },
)

export default Match
