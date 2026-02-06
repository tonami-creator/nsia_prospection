const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const {
      nomComplet,
      idEmploye, // Utilisé comme ID principal
      telephone,
      email,
      sexe,
      lieu, // Correspondra à 'residence' en BDD
      motDePasse,
    } = req.body;

    // 1. Vérifier si l'employé existe dans la table 'employes'
    const [employeRows] = await db.query(
      "SELECT * FROM employes WHERE id = ?",
      [idEmploye]
    );

    if (employeRows.length === 0) {
      return res.status(400).json({
        message: "L'ID fourni n'est pas associé à un employé valide. Contactez le Directeur.",
      });
    }

    // 2. Hashage du mot de passe
    const hashed = await bcrypt.hash(motDePasse, 10);

    // 3. Insertion dans la table 'inscription' 
    // J'utilise 'lieu' pour la colonne 'residence' et génère un inscription_id aléatoire
    const inscription_id = "INS-" + Math.floor(Math.random() * 100000);

    const query = `
      INSERT INTO inscription 
      (id, inscription_id, nomComplet, telephone, email, sexe, residence, motDePasse) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(query, [
      idEmploye, 
      inscription_id, 
      nomComplet, 
      telephone, 
      email, 
      sexe, 
      lieu, 
      hashed
    ]);

    res.status(201).json({ message: "Inscription réussie ! Bienvenue chez NSIA." });
  } catch (err) {
    console.error("Erreur Inscription:", err);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription" });
  }
};