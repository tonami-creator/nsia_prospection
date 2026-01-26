const router = require("express").Router();
const equipeController = require("../controllers/equipe.controller");

router.get("/", equipeController.getAll);

module.exports = router;
