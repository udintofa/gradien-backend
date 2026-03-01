const express = require("express");
const router = express.Router();

const subtryoutController = require("../controllers/subtryout.controller");
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

// PUBLIC
router.get(
  "/tryout/:tryoutId",
  auth,
  subtryoutController.getSubtryoutsByTryout,
);

router.get("/:id", auth, subtryoutController.getSubtryoutById);

// PROTECTED (mentor & admin only)
router.post(
  "/",
  auth,
  authorize("mentor", "admin"),
  subtryoutController.createSubtryout,
);

router.put(
  "/:id",
  auth,
  authorize("mentor", "admin"),
  subtryoutController.updateSubtryout,
);

router.delete(
  "/:id",
  auth,
  authorize("mentor", "admin"),
  subtryoutController.deleteSubtryout,
);

module.exports = router;
