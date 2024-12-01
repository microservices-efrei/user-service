const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

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

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['password'], // Exclure le mot de passe
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur de récupération du profil:', error);
    res.status(500).json({
      message: 'Erreur de récupération du profil',
      error: error.message,
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email } = req.body;

    // Trouver l'utilisateur
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mise à jour des champs
    if (fullName) user.fullName = fullName;
    if (email) {
      // Vérifier si l'email est unique
      const existingUser = await User.findOne({
        where: { email, id: { [Op.ne]: id } },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email déjà utilisé' });
      }

      user.email = email;
    }

    // Sauvegarde des modifications
    await user.save();

    // Réponse sans le mot de passe
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    };

    res.json({
      message: 'Profil mis à jour',
      user: userResponse,
    });
  } catch (error) {
    console.error('Erreur de mise à jour du profil:', error);
    res.status(500).json({
      message: 'Erreur de mise à jour',
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Trouver l'utilisateur
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Suppression de l'utilisateur
    await user.destroy();

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur de suppression utilisateur:', error);
    res.status(500).json({
      message: 'Erreur de suppression',
      error: error.message,
    });
  }
};

exports.listUsers = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Récupération des utilisateurs
    const { count, rows: users } = await User.findAndCountAll({
      attributes: {
        exclude: ['password'],
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      users,
      totalUsers: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('Erreur de listage des utilisateurs:', error);
    res.status(500).json({
      message: 'Erreur de récupération des utilisateurs',
      error: error.message,
    });
  }
};
