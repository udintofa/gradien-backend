const express = require("express");
const router = express.Router();
const tryoutController = require("../controllers/tryout.controller");

router.post("/", tryoutController.createTryout);
router.get("/course/:courseId", tryoutController.getTryoutsByCourse);
router.get("/:id", tryoutController.getTryoutById);
router.put("/:id", tryoutController.updateTryout);
router.delete("/:id", tryoutController.deleteTryout);

module.exports = router;
