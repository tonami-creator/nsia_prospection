const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// CRUD Employés
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM employes");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM employes WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Employé non trouvé." });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { id, nom, prenom, date_naissance, telephone, email, role, motDePasse } = req.body;
    const hashed = await bcrypt.hash(motDePasse, 10);

    await db.query(
      "INSERT INTO employes (id, nom, prenom, date_naissance, telephone, email, role, motDePasse) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, nom, prenom, date_naissance, telephone, email, role, hashed]
    );

    res.status(201).json({ message: "Employé créé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, date_naissance, telephone, email, role } = req.body;

    await db.query(
      "UPDATE employes SET nom=?, prenom=?, date_naissance=?, telephone=?, email=?, role=? WHERE id=?",
      [nom, prenom, date_naissance, telephone, email, role, id]
    );

    res.json({ message: "Employé mis à jour" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM employes WHERE id=?", [id]);
    res.json({ message: "Employé supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
