import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const SuperLike = sequelize.define(
  "SuperLike",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    liker_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    liked_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "super_likes",
    indexes: [
      {
        unique: true,
        fields: ["liker_id", "liked_id"],
      },
    ],
  },
)

export default SuperLike
