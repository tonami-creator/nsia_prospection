const db = require("../config/db");
const bcrypt = require("bcryptjs");

// GET all
exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nom, prenom, date_naissance, telephone, email, role FROM employes");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET by ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT id, nom, prenom, date_naissance, telephone, email, role FROM employes WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Employé non trouvé." });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE
exports.create = async (req, res) => {
    try {
        const { id, nom, prenom, date_naissance, telephone, email, role, motDePasse } = req.body;
        
        // Sécurité si mot de passe absent
        const passToHash = motDePasse || "NsiaDefault123";
        const hashed = await bcrypt.hash(passToHash, 10);

        await db.query(
            "INSERT INTO employes (id, nom, prenom, date_naissance, telephone, email, role, motDePasse) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [id, nom, prenom, date_naissance, telephone, email, role, hashed]
        );

        res.status(201).json({ message: "Employé créé avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, date_naissance, telephone, email, role } = req.body;

        await db.query(
            "UPDATE employes SET nom=?, prenom=?, date_naissance=?, telephone=?, email=?, role=? WHERE id=?",
            [nom, prenom, date_naissance, telephone, email, role, id]
        );

        res.json({ message: "Employé mis à jour avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM employes WHERE id=?", [id]);
        res.json({ message: "Employé supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};