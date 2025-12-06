import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Language = sequelize.define(
  "Language",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name_local: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    is_african: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "languages",
  },
)

export default Language
