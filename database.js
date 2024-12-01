const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ajoutez cette ligne pour charger les variables d'environnement

const sequelize = new Sequelize(
  process.env.DB_NAME || 'user_db', // Nom de la base de données
  process.env.DB_USER || 'your_username', // Utilisateur de la base de données
  process.env.DB_PASSWORD || 'your_password', // Mot de passe
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5, // Nombre maximum de connexions dans le pool
      min: 0, // Nombre minimum de connexions dans le pool
      acquire: 30000, // Temps maximum pour établir une connexion
      idle: 10000, // Temps d'inactivité avant de libérer une connexion
    },
    define: {
      // Options par défaut pour tous les modèles
      timestamps: true, // Ajoute automatiquement createdAt et updatedAt
      underscored: true, // Utilise snake_case pour les noms de colonnes automatiques
    },
  }
);

// Synchronisation et vérification de la connexion
const initDatabase = async () => {
  try {
    // Authentification
    await sequelize.authenticate();
    console.log('Connexion à la base de données utilisateurs réussie');

    // Synchronisation des modèles
    await sequelize.sync({
      force: false, // Ne recréé pas les tables si elles existent
      alter: true, // Met à jour les tables si le schéma a changé
    });

    console.log('Modèles synchronisés avec succès');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
    // Optionnel : Relancer la connexion ou arrêter l'application
    process.exit(1);
  }
};

// Gestion des événements de la base de données
sequelize.connectionManager.on('connection-error', (error) => {
  console.error('Erreur de connexion à la base de données :', error);
});

// Initialisation
initDatabase();

module.exports = sequelize;
