const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
    });

    await user.save();
    res.status(201).json({ message: "Utilisateur créé", userId: user._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur de création", error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
