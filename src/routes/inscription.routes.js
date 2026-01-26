const router = require("express").Router();
const inscriptionController = require("../controllers/inscription.controller");

// POST /api/inscription
router.post("/", inscriptionController.register);

module.exports = router;
