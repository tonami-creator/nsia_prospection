const router = require("express").Router();
const inscriptionController = require("../controllers/inscription.controller");

// Cette ligne répondra au navigateur si on tape l'URL à la main
router.get("/", (req, res) => {
    res.send("Le serveur d'inscription est prêt, mais vous devez envoyer un formulaire (POST) !");
});

// Ta route actuelle qui reçoit les données du formulaire
router.post("/", inscriptionController.register);

module.exports = router;