const db = require("../config/db");

// GET all suivis
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM suivis ORDER BY prospect_id, action");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur récupération suivis" });
  }
};

// CREATE or UPDATE suivi
exports.createOrUpdate = async (req, res) => {
  try {
    const { prospect_id, action, observation, progression } = req.body;

    const [existing] = await db.query(
      "SELECT * FROM suivis WHERE prospect_id = ? AND action = ?",
      [prospect_id, action]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE suivis SET observation = ?, progression = ? WHERE prospect_id = ? AND action = ?",
        [observation, progression, prospect_id, action]
      );
      return res.json({ message: "Suivi mis à jour" });
    }

    await db.query(
      "INSERT INTO suivis (prospect_id, action, observation, progression) VALUES (?, ?, ?, ?)",
      [prospect_id, action, observation, progression]
    );

    res.status(201).json({ message: "Suivi ajouté" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur création/mise à jour suivi" });
  }
};

// DELETE suivi
exports.delete = async (req, res) => {
  try {
    const { prospect_id, action } = req.params;
    await db.query(
      "DELETE FROM suivis WHERE prospect_id = ? AND action = ?",
      [prospect_id, action]
    );
    res.json({ message: "Suivi supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur suppression suivi" });
  }
};
