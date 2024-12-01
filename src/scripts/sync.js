// scripts/sync.js
const sequelize = require('../config/database');

(async () => {
  try {
    await sequelize.sync({ force: true }); // force: true => Réinitialise les tables
    console.log('Base de données synchronisée !');
    process.exit();
  } catch (error) {
    console.error('Erreur lors de la synchronisation :', error);
    process.exit(1);
  }
})();
