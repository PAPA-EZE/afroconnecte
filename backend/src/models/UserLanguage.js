import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const UserLanguage = sequelize.define(
  "UserLanguage",
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
    language_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "languages",
        key: "id",
      },
    },
    proficiency: {
      type: DataTypes.ENUM("native", "fluent", "intermediate", "basic"),
      defaultValue: "intermediate",
    },
  },
  {
    tableName: "user_languages",
  },
)

export default UserLanguage
