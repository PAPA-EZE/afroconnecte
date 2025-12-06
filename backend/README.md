# AfriLove Backend API

Backend Node.js pour l'application de rencontres AfriLove, axée sur la culture africaine et sa diaspora.

## Technologies

- **Node.js** avec Express.js
- **Sequelize** ORM
- **MariaDB** Base de données
- **Socket.IO** pour la messagerie en temps réel
- **JWT** pour l'authentification
- **Stripe** pour les paiements

## Installation

### Prérequis

- Node.js 18+
- MariaDB 10.5+
- npm ou yarn

### Configuration

1. Cloner le repository
2. Installer les dépendances :

\`\`\`bash
cd backend
npm install
\`\`\`

3. Copier le fichier d'environnement :

\`\`\`bash
cp .env.example .env
\`\`\`

4. Configurer les variables d'environnement dans `.env`

5. Créer la base de données MariaDB :

\`\`\`sql
CREATE DATABASE afrilove_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`

6. Lancer le serveur :

\`\`\`bash
# Développement
npm run dev

# Production
npm start
\`\`\`

7. Exécuter les seeds (données initiales) :

\`\`\`bash
mysql -u root -p afrilove_db < scripts/001_seed_data.sql
\`\`\`

## Structure du Projet

\`\`\`
backend/
├── src/
│   ├── config/          # Configuration (DB, etc.)
│   ├── controllers/     # Logique métier
│   ├── middleware/      # Auth, validation, rate limiting
│   ├── models/          # Modèles Sequelize
│   ├── routes/          # Routes API
│   ├── socket/          # WebSocket handlers
│   └── server.js        # Point d'entrée
├── scripts/             # Scripts SQL
├── uploads/             # Fichiers uploadés
└── package.json
\`\`\`

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/oauth` - Connexion OAuth
- `POST /api/auth/refresh-token` - Rafraîchir le token
- `GET /api/auth/me` - Profil utilisateur connecté

### Profil
- `GET /api/profile` - Obtenir son profil
- `PUT /api/profile` - Mettre à jour son profil
- `PUT /api/profile/languages` - Mettre à jour ses langues
- `POST /api/profile/complete-onboarding` - Terminer l'onboarding
- `PUT /api/profile/passport` - Définir localisation Passport (Premium)
- `POST /api/profile/incognito` - Toggle mode incognito (Premium)

### Photos
- `GET /api/photos` - Obtenir ses photos
- `POST /api/photos` - Uploader une photo
- `DELETE /api/photos/:photoId` - Supprimer une photo
- `PUT /api/photos/:photoId/primary` - Définir photo principale

### Découverte
- `GET /api/discovery/profiles` - Obtenir les profils à swiper
- `POST /api/discovery/swipe/:userId` - Swiper un profil
- `POST /api/discovery/rewind` - Annuler dernier swipe (Premium)
- `GET /api/discovery/who-liked-me` - Voir qui m'a liké (Premium)
- `POST /api/discovery/boost` - Activer un boost (Premium)

### Matchs
- `GET /api/matches` - Liste des matchs
- `GET /api/matches/:matchId` - Détails d'un match
- `DELETE /api/matches/:matchId` - Unmatch

### Messages
- `GET /api/messages/:matchId` - Messages d'une conversation
- `POST /api/messages/:matchId` - Envoyer un message
- `GET /api/messages/ice-breakers` - Obtenir des ice breakers

### Événements
- `GET /api/events` - Liste des événements
- `GET /api/events/:eventId` - Détails d'un événement
- `POST /api/events` - Créer un événement
- `POST /api/events/:eventId/participate` - Participer

### Abonnements
- `GET /api/subscriptions/plans` - Liste des plans
- `GET /api/subscriptions/current` - Abonnement actuel
- `POST /api/subscriptions/checkout` - Créer session Stripe
- `POST /api/subscriptions/cancel` - Annuler abonnement

### Signalements
- `POST /api/reports/user/:userId` - Signaler un utilisateur
- `POST /api/reports/block/:userId` - Bloquer un utilisateur
- `GET /api/reports/blocked` - Liste des utilisateurs bloqués

## WebSocket Events

### Client → Serveur
- `send_message` - Envoyer un message
- `mark_read` - Marquer messages comme lus
- `typing_start` - Indicateur de frappe
- `typing_stop` - Arrêt de frappe

### Serveur → Client
- `new_message` - Nouveau message reçu
- `new_match` - Nouveau match
- `notification` - Notification générale
- `messages_read` - Messages lus par l'autre
- `user_typing` - L'autre tape
- `user_stopped_typing` - L'autre a arrêté de taper

## Fonctionnalités Premium

| Fonctionnalité | Gratuit | Premium |
|----------------|---------|---------|
| Likes quotidiens | 50 | Illimité |
| Super Likes | 1/jour | 5/jour |
| Voir qui m'a liké | ❌ | ✅ |
| Rewind | ❌ | ✅ |
| Mode Incognito | ❌ | ✅ |
| Passport | ❌ | ✅ |
| Filtres avancés | ❌ | ✅ |
| Statut de lecture | ❌ | ✅ |
| Boost mensuel | 0 | 1 |
| Messages prioritaires | ❌ | ✅ |

## Sécurité

- Authentification JWT avec refresh tokens
- Rate limiting sur les endpoints sensibles
- Validation des entrées avec express-validator
- Protection CSRF/XSS avec Helmet
- Hachage des mots de passe avec bcrypt (12 rounds)
- Vérification de profil par photo

## Licence

Propriétaire - AfriLove © 2025
