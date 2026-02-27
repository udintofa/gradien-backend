const express = require("express");
const router = express.Router();
const tryoutController = require("../controllers/tryout.controller");
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

// Public
router.get("/course/:courseId", auth, tryoutController.getTryoutsByCourse);

router.get("/:id", auth, tryoutController.getTryoutById);

// Protected
router.post(
  "/",
  auth,
  authorize("mentor", "admin"),
  tryoutController.createTryout,
);

router.put(
  "/:id",
  auth,
  authorize("mentor", "admin"),
  tryoutController.updateTryout,
);

router.delete(
  "/:id",
  auth,
  authorize("mentor", "admin"),
  tryoutController.deleteTryout,
);

module.exports = router;
