const db = require("../config/db");

// Récupérer tous les utilisateurs (employés)
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, nom, prenom, role FROM employes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur utilisateurs" });
  }
};
