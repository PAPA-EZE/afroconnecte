import sequelize from "../config/database.js"
import User from "./User.js"
import Profile from "./Profile.js"
import Photo from "./Photo.js"
import Ethnicity from "./Ethnicity.js"
import Country from "./Country.js"
import Language from "./Language.js"
import UserLanguage from "./UserLanguage.js"
import Like from "./Like.js"
import Match from "./Match.js"
import Message from "./Message.js"
import Subscription from "./Subscription.js"
import Plan from "./Plan.js"
import Event from "./Event.js"
import EventParticipant from "./EventParticipant.js"
import Report from "./Report.js"
import Block from "./Block.js"
import SuperLike from "./SuperLike.js"
import ProfileView from "./ProfileView.js"
import Boost from "./Boost.js"

// ==================== ASSOCIATIONS ====================

// User <-> Profile (1:1)
User.hasOne(Profile, { foreignKey: "user_id", as: "profile", onDelete: "CASCADE" })
Profile.belongsTo(User, { foreignKey: "user_id", as: "user" })

// User <-> Photos (1:N)
User.hasMany(Photo, { foreignKey: "user_id", as: "photos", onDelete: "CASCADE" })
Photo.belongsTo(User, { foreignKey: "user_id", as: "user" })

// Profile <-> Ethnicity (N:1)
Profile.belongsTo(Ethnicity, { foreignKey: "ethnicity_id", as: "ethnicity" })
Ethnicity.hasMany(Profile, { foreignKey: "ethnicity_id", as: "profiles" })

// Profile <-> Country (N:1) - Pays d'origine
Profile.belongsTo(Country, { foreignKey: "origin_country_id", as: "originCountry" })
Country.hasMany(Profile, { foreignKey: "origin_country_id", as: "profiles" })

// User <-> Languages (N:N)
User.belongsToMany(Language, { through: UserLanguage, foreignKey: "user_id", as: "languages" })
Language.belongsToMany(User, { through: UserLanguage, foreignKey: "language_id", as: "users" })

// User <-> Subscription (1:1 active)
User.hasMany(Subscription, { foreignKey: "user_id", as: "subscriptions", onDelete: "CASCADE" })
Subscription.belongsTo(User, { foreignKey: "user_id", as: "user" })

// Subscription <-> Plan (N:1)
Subscription.belongsTo(Plan, { foreignKey: "plan_id", as: "plan" })
Plan.hasMany(Subscription, { foreignKey: "plan_id", as: "subscriptions" })

// User <-> Likes (Liker/Liked)
User.hasMany(Like, { foreignKey: "liker_id", as: "likesGiven", onDelete: "CASCADE" })
User.hasMany(Like, { foreignKey: "liked_id", as: "likesReceived", onDelete: "CASCADE" })
Like.belongsTo(User, { foreignKey: "liker_id", as: "liker" })
Like.belongsTo(User, { foreignKey: "liked_id", as: "liked" })

// User <-> SuperLikes
User.hasMany(SuperLike, { foreignKey: "liker_id", as: "superLikesGiven", onDelete: "CASCADE" })
User.hasMany(SuperLike, { foreignKey: "liked_id", as: "superLikesReceived", onDelete: "CASCADE" })
SuperLike.belongsTo(User, { foreignKey: "liker_id", as: "liker" })
SuperLike.belongsTo(User, { foreignKey: "liked_id", as: "liked" })

// User <-> Matches
User.hasMany(Match, { foreignKey: "user1_id", as: "matchesAsUser1", onDelete: "CASCADE" })
User.hasMany(Match, { foreignKey: "user2_id", as: "matchesAsUser2", onDelete: "CASCADE" })
Match.belongsTo(User, { foreignKey: "user1_id", as: "user1" })
Match.belongsTo(User, { foreignKey: "user2_id", as: "user2" })

// Match <-> Messages (1:N)
Match.hasMany(Message, { foreignKey: "match_id", as: "messages", onDelete: "CASCADE" })
Message.belongsTo(Match, { foreignKey: "match_id", as: "match" })

// User <-> Messages (Sender)
User.hasMany(Message, { foreignKey: "sender_id", as: "messagesSent", onDelete: "CASCADE" })
Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" })

// User <-> Events (Organizer)
User.hasMany(Event, { foreignKey: "organizer_id", as: "organizedEvents", onDelete: "CASCADE" })
Event.belongsTo(User, { foreignKey: "organizer_id", as: "organizer" })

// User <-> Events (Participants - N:N)
User.belongsToMany(Event, { through: EventParticipant, foreignKey: "user_id", as: "participatedEvents" })
Event.belongsToMany(User, { through: EventParticipant, foreignKey: "event_id", as: "participants" })

// User <-> Reports (Reporter/Reported)
User.hasMany(Report, { foreignKey: "reporter_id", as: "reportsCreated", onDelete: "CASCADE" })
User.hasMany(Report, { foreignKey: "reported_id", as: "reportsReceived", onDelete: "CASCADE" })
Report.belongsTo(User, { foreignKey: "reporter_id", as: "reporter" })
Report.belongsTo(User, { foreignKey: "reported_id", as: "reported" })

// User <-> Blocks (Blocker/Blocked)
User.hasMany(Block, { foreignKey: "blocker_id", as: "blocksCreated", onDelete: "CASCADE" })
User.hasMany(Block, { foreignKey: "blocked_id", as: "blocksReceived", onDelete: "CASCADE" })
Block.belongsTo(User, { foreignKey: "blocker_id", as: "blocker" })
Block.belongsTo(User, { foreignKey: "blocked_id", as: "blocked" })

// User <-> ProfileViews
User.hasMany(ProfileView, { foreignKey: "viewer_id", as: "profilesViewed", onDelete: "CASCADE" })
User.hasMany(ProfileView, { foreignKey: "viewed_id", as: "profileViewsReceived", onDelete: "CASCADE" })
ProfileView.belongsTo(User, { foreignKey: "viewer_id", as: "viewer" })
ProfileView.belongsTo(User, { foreignKey: "viewed_id", as: "viewed" })

// User <-> Boosts
User.hasMany(Boost, { foreignKey: "user_id", as: "boosts", onDelete: "CASCADE" })
Boost.belongsTo(User, { foreignKey: "user_id", as: "user" })

// Country <-> Ethnicity (1:N pour la région)
Country.hasMany(Ethnicity, { foreignKey: "region_id", as: "ethnicities" })
Ethnicity.belongsTo(Country, { foreignKey: "region_id", as: "region" })

// Sync Database
export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" })
    console.log("✅ Base de données synchronisée.")
  } catch (error) {
    console.error("❌ Erreur de synchronisation:", error)
  }
}

export {
  sequelize,
  User,
  Profile,
  Photo,
  Ethnicity,
  Country,
  Language,
  UserLanguage,
  Like,
  Match,
  Message,
  Subscription,
  Plan,
  Event,
  EventParticipant,
  Report,
  Block,
  SuperLike,
  ProfileView,
  Boost,
}
