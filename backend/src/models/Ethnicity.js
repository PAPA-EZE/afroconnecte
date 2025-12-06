import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Ethnicity = sequelize.define(
  "Ethnicity",
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
      comment: "Nom dans la langue locale",
    },
    region_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "countries",
        key: "id",
      },
      comment: "Pays/région principale de cette ethnie",
    },
    continent_region: {
      type: DataTypes.ENUM("west_africa", "east_africa", "north_africa", "south_africa", "central_africa", "diaspora"),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "ethnicities",
  },
)

export default Ethnicity
