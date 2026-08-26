# Plateforme d'Apprentissage Adaptatif 🎓

**100% Gratuit et Open-Source**

Une plateforme d'apprentissage intelligent qui s'adapte automatiquement à votre niveau et vitesse d'apprentissage.

## ✨ Fonctionnalités

### 📚 Contenu Dynamique
- **Cours** : Contenus théoriques structurés
- **Exercices** : Pratique avec feedback immédiat
- **Simulations** : Environnements interactifs
- **Quiz** : Évaluation des connaissances
- **Projets** : Cas d'usage réels
- **Corrections** : Solutions détaillées

### 🧠 Apprentissage Adaptatif
- Ajustement automatique de la difficulté
- Parcours personnalisé basé sur les erreurs
- Identification des points faibles et forts
- Recommandations intelligentes
- Progression en temps réel

### 🎮 Gamification
- Système de points (XP)
- Niveaux et badges
- Achievements débloqués
- Leaderboards
- Statistiques détaillées

## 🚀 Stack Technologique

### Frontend
- **Next.js 14** - Framework React ultra-rapide
- **TypeScript** - Sécurité des types
- **TailwindCSS** - Styling moderne
- **Shadcn/ui** - Composants accessibles
- **Recharts** - Visualisation des données

### Backend
- **Next.js API Routes** - Serverless
- **Node.js** - Runtime JavaScript
- **TypeScript** - Typage strict

### Base de Données
- **PostgreSQL** - SGBD puissant et gratuit
- **Prisma ORM** - Gestion élégante des données

### Caching & Sessions
- **Redis** - Cache haute performance
- **NextAuth.js** - Authentification sécurisée

### Sécurité
- **bcrypt** - Hash des mots de passe
- **JWT** - Tokens sécurisés
- **Helmet** - Headers de sécurité
- **Rate Limiting** - Protection contre les abus
- **Zod** - Validation stricte

### Monitoring
- **Winston** - Logging professionnel
- **Pino** - Logging haute performance

## 📋 Prérequis

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 12+ (ou via Docker)
- Redis (optionnel, ou via Docker)

## 🔧 Installation

### 1. Cloner le repository
```bash
git clone https://github.com/diabymouss44-bit/adaptive-learning-platform.git
cd adaptive-learning-platform
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```

### 4. Lancer la base de données
```bash
docker-compose up -d
```

### 5. Migrer la base de données
```bash
npm run prisma:migrate
```

### 6. Lancer le serveur de développement
```bash
npm run dev
```

Visitez `http://localhost:3000`

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/signin` - Se connecter
- `POST /api/auth/signout` - Se déconnecter

### Cours
- `GET /api/courses` - Lister les cours
- `GET /api/courses/:id` - Détails d'un cours

### Exercices
- `POST /api/exercises/submit` - Soumettre une réponse
- `GET /api/exercises/:id` - Détails d'un exercice

### Apprentissage Adaptatif
- `GET /api/learning-path` - Parcours personnalisé
- `GET /api/progress` - Progression de l'utilisateur

## 🔒 Sécurité

✅ Authentification sécurisée avec NextAuth.js
✅ Mots de passe hashés avec bcrypt
✅ Validation stricte des données (Zod)
✅ Rate limiting sur les API
✅ CORS configuré
✅ Headers de sécurité (Helmet)
✅ Logging sécurisé des événements
✅ Protection contre CSRF

## 📊 Architecture

```
adaptive-learning-platform/
├── app/
│   ├── api/                 # API Routes
│   ├── (auth)/              # Pages d'authentification
│   └── (dashboard)/         # Dashboard utilisateur
├── components/              # Composants React
├── lib/                     # Utilitaires et configurations
├── prisma/                  # Schéma de base de données
├── public/                  # Assets statiques
├── services/                # Services métier
└── styles/                  # Styles globaux
```

## 🤝 Contribution

Les contributions sont bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE)

## 📧 Contact

Questions ? Créez une [issue](https://github.com/diabymouss44-bit/adaptive-learning-platform/issues)

---

**Construire l'avenir de l'éducation, ensemble** 🚀
