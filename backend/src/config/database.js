import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME || "afrilove_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mariadb",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  },
)

// Test de connexion
export const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("✅ Connexion à MariaDB établie avec succès.")
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base de données:", error)
    process.exit(1)
  }
}

export default sequelize
