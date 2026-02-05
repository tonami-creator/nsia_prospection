const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ====================================================
// Auth - Connexion avec ID + mot de passe
// ====================================================
exports.login = async (req, res) => {
  try {
    const { id, motDePasse } = req.body;

    // Vérifier que l'ID et le mot de passe sont fournis
    if (!id || !motDePasse) {
      return res.status(400).json({ message: "ID et mot de passe sont requis." });
    }

    // Chercher dans la table employes
    const [employeRows] = await db.query(
      "SELECT * FROM employes WHERE id = ?",
      [id]
    );

    let user = employeRows.length > 0 ? employeRows[0] : null;

    // Si pas trouvé dans employes, chercher dans utilisateurs
    if (!user) {
      const [userRows] = await db.query(
        "SELECT * FROM utilisateurs WHERE id = ?",
        [id]
      );
      if (userRows.length > 0) user = userRows[0];
    }

    // Si toujours pas trouvé
    if (!user) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        role: user.role,
        nom: user.nomComplet || user.nom || ""
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur authentification" });
  }
};
