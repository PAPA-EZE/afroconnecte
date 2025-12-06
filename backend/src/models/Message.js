import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    match_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "matches",
        key: "id",
      },
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    message_type: {
      type: DataTypes.ENUM("text", "image", "voice", "gif", "ice_breaker"),
      defaultValue: "text",
    },
    media_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    ice_breaker_question: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Question "Ice Breaker Culturel" utilisée',
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "messages",
  },
)

export default Message
