
const router = require("express").Router();
const inscriptionController = require("../controllers/inscription.controller");

// Route pour l'inscription
router.post("/", inscriptionController.register);

module.exports = router;