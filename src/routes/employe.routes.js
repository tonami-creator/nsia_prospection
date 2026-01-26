const router = require("express").Router();
const employeController = require("../controllers/employe.controller");

// GET all employees
router.get("/", employeController.getAll);

// GET one employee by ID
router.get("/:id", employeController.getById);

// POST create a new employee
router.post("/", employeController.create);

// PUT update an existing employee
router.put("/:id", employeController.update);

// DELETE remove an employee
router.delete("/:id", employeController.delete);

module.exports = router;



