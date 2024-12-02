const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérification si l'utilisateur existe en fonction du nom d'utilisateur ou de l'email
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Nom d'utilisateur ou email incorrect" });
    }

    // Comparaison du mot de passe avec celui stocké dans la base de données
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Création du JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET, // Utilisez la clé secrète pour signer le token
      { expiresIn: '1h' } // Le token expirera dans 1 heure
    );

    // Réponse avec le token (et les informations de l'utilisateur)
    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
      token, // Ajoutez le token JWT dans la réponse
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur',
      error: error.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Validation des données d'entrée
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
    });

    // Réponse sans le mot de passe
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      registrationDate: user.registrationDate,
    };

    res.status(201).json({
      message: 'Utilisateur créé',
      user: userResponse,
    });
  } catch (error) {
    // Gestion des erreurs de validation Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Erreur de validation',
        errors: error.errors.map((e) => e.message),
      });
    }

    console.error('Erreur de création utilisateur:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur',
      error: error.message,
    });
  }
};
