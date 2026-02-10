const express = require("express");
const router = express.Router();
const materialController = require("../controllers/material.controller");

router.post("/", materialController.createMaterial);
router.get("/course/:courseId", materialController.getMaterialsByCourse);
router.get("/:id", materialController.getMaterialById);
router.put("/:id", materialController.updateMaterial);
router.delete("/:id", materialController.deleteMaterial);

module.exports = router;