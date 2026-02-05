const db = require("../config/db");
const bcrypt = require("bcryptjs");

// POST /api/inscription
exports.register = async (req, res) => {
  try {
    const {
      nomComplet,
      idEmploye,
      telephone,
      email,
      sexe,
      lieu,
      motDePasse,
    } = req.body;

    // Verifier si l'ID employe existe dans employes
    const [employeRows] = await db.query(
      "SELECT * FROM employes WHERE id = ?",
      [idEmploye]
    );

    if (employeRows.length === 0) {
      return res.status(400).json({
        message:
          "L'ID fourni n'est pas associé à un employé valide. Contactez le Directeur.",
      });
    }

    // Hash mot de passe
    const hashed = await bcrypt.hash(motDePasse, 10);

    // Enregistrer utilisateur
    await db.query(
      "INSERT INTO utilisateurs (id, nomComplet, telephone, email, sexe, lieu, motDePasse) VALUES (?,?,?,?,?,?,?)",
      [idEmploye, nomComplet, telephone, email, sexe, lieu, hashed]
    );

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur inscription" });
  }
};
