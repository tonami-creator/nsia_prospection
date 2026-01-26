const router = require("express").Router();
const prospectController = require("../controllers/prospect.controller");

// Récupérer tous les prospects
router.get("/", prospectController.getAll);

// Ajouter un prospect
router.post("/", prospectController.create);

// Supprimer un prospect par ID
router.delete("/:id", prospectController.delete);

module.exports = router;
