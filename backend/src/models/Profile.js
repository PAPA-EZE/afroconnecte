import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500],
      },
    },
    ethnicity_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "ethnicities",
        key: "id",
      },
    },
    origin_country_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "countries",
        key: "id",
      },
    },
    origin_region: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Région spécifique du pays d'origine",
    },
    religion: {
      type: DataTypes.ENUM(
        "christianity",
        "islam",
        "traditional",
        "judaism",
        "buddhism",
        "hinduism",
        "other",
        "none",
        "prefer_not_to_say",
      ),
      allowNull: true,
    },
    education: {
      type: DataTypes.ENUM("high_school", "some_college", "bachelor", "master", "doctorate", "other"),
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    height_cm: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 100,
        max: 250,
      },
    },
    relationship_goal: {
      type: DataTypes.ENUM("serious", "casual", "friendship", "networking", "not_sure"),
      defaultValue: "not_sure",
    },
    has_children: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    wants_children: {
      type: DataTypes.ENUM("yes", "no", "maybe", "prefer_not_to_say"),
      allowNull: true,
    },
    smoking: {
      type: DataTypes.ENUM("never", "occasionally", "regularly", "trying_to_quit"),
      allowNull: true,
    },
    drinking: {
      type: DataTypes.ENUM("never", "socially", "regularly"),
      allowNull: true,
    },
    favorite_cuisine: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Liste des cuisines africaines préférées",
    },
    cultural_values: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Valeurs culturelles importantes: famille, tradition, etc.",
    },
    interests: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Centres d'intérêt généraux",
    },
    music_preferences: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Préférences musicales africaines: Afrobeats, Highlife, etc.",
    },
    min_age_preference: {
      type: DataTypes.INTEGER,
      defaultValue: 18,
      validate: {
        min: 18,
        max: 100,
      },
    },
    max_age_preference: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: {
        min: 18,
        max: 100,
      },
    },
    max_distance_km: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: {
        min: 1,
        max: 500,
      },
    },
    show_distance: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    show_age: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "profiles",
  },
)

export default Profile
