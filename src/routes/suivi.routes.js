const router = require("express").Router();
const suiviController = require("../controllers/suivi.controller");

router.get("/", suiviController.getAll);

router.post("/", suiviController.createOrUpdate);

router.delete("/:prospect_id/:action", suiviController.delete);

module.exports = router;

