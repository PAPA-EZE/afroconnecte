import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Country = sequelize.define(
  "Country",
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
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
    },
    flag_emoji: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    continent_region: {
      type: DataTypes.ENUM(
        "west_africa",
        "east_africa",
        "north_africa",
        "south_africa",
        "central_africa",
        "diaspora_europe",
        "diaspora_americas",
        "diaspora_asia",
        "diaspora_oceania",
      ),
      allowNull: false,
    },
    is_african: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "countries",
  },
)

export default Country
