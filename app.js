const express = require('express');
const sequelize = require('./src/database');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialisation de la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie');
  })
  .catch((error) => {
    console.error('Impossible de se connecter à la base de données :', error);
    process.exit(1);
  });

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
