require("dotenv").config();      // charge les variables d'environnement
const express = require("express");
const cors = require("cors");

const app = express();

// Autoriser les requêtes cross-origin (CORS)
app.use(cors());

// Permettre à Express de lire le JSON envoyé par le frontend
app.use(express.json());

// =========================
// Routes API
// =========================

// Auth (connexion / login)
app.use("/api/auth", require("./routes/auth.routes"));

// Inscription (création de compte)
app.use("/api/inscription", require("./routes/inscription.routes"));

// Prospects
app.use("/api/prospects", require("./routes/prospect.routes"));

// Suivis
app.use("/api/suivis", require("./routes/suivi.routes"));

// Équipes
app.use("/api/equipes", require("./routes/equipe.routes"));

// Utilisateurs (CC, CE, Superviseurs, etc.)
app.use("/api/utilisateurs", require("./routes/user.routes"));

// Employés (CRUD complet)
app.use("/api/employes", require("./routes/employe.routes"));

// =========================
// Démarrer le serveur
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API NSIA en ligne sur http://localhost:${PORT}`);
});
