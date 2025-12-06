import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const EventParticipant = sequelize.define(
  "EventParticipant",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("interested", "going", "attended"),
      defaultValue: "interested",
    },
  },
  {
    tableName: "event_participants",
    indexes: [
      {
        unique: true,
        fields: ["event_id", "user_id"],
      },
    ],
  },
)

export default EventParticipant
