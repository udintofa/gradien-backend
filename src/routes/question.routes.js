const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const controller = require("../controllers/question.controller");

// ================= PUBLIC =================
router.get(
  "/subtryouts/:subtryoutId",
  auth,
  controller.getQuestionsBySubtryout,
);

// ================= PROTECTED =================
router.post(
  "/subtryouts/:subtryoutId",
  auth,
  authorize("mentor", "admin"),
  controller.createQuestion,
);

router.put(
  "/:questionId",
  auth,
  authorize("mentor", "admin"),
  controller.updateQuestion,
);

router.delete(
  "/:questionId",
  auth,
  authorize("mentor", "admin"),
  controller.deleteQuestion,
);

module.exports = router;
