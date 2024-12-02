const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Remplacez ces valeurs par celles de votre base de données
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});

sequelize
  .authenticate()
  .then(() => console.log('Connexion réussie !'))
  .catch((err) => console.error('Erreur de connexion :', err));

module.exports = sequelize;
