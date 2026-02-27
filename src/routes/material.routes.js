const express = require("express");
const router = express.Router();
const materialController = require("../controllers/material.controller");
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

//PUBLIC
router.get("/course/:courseId", auth, materialController.getMaterialsByCourse);
router.get("/:id", auth, materialController.getMaterialById);

// PRETECTED
router.post(
  "/",
  auth,
  authorize("mentor", "admin"),
  materialController.createMaterial,
);

router.put(
  "/:id",
  auth,
  authorize("mentor", "admin"),
  materialController.updateMaterial,
);

router.delete(
  "/:id",
  auth,
  authorize("mentor", "admin"),
  materialController.deleteMaterial,
);

module.exports = router;
