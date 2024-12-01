const { Sequelize } = require('sequelize');

// Remplacez ces valeurs par celles de votre base de données
const sequelize = new Sequelize('use_db', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql', // ou 'postgres', 'sqlite', 'mariadb'
});

sequelize
  .authenticate()
  .then(() => console.log('Connexion réussie !'))
  .catch((err) => console.error('Erreur de connexion :', err));

module.exports = sequelize;
