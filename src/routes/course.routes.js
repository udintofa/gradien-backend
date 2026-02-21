const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const auth = require('../middlewares/auth.middleware')
const authorize = require('../middlewares/role.middleware')


// PUBLIC
router.get("/", auth, courseController.getAllCourses);
router.get("/:id", auth, courseController.getCourseById);

// PROTECTED (mentor & admin only)
router.post(
  "/",
  auth,
  authorize("mentor", "admin"),
  courseController.createCourse
);

router.put(
  "/:id",
  auth,
  authorize("mentor", "admin"),
  courseController.updateCourse
);

router.delete(
  "/:id",
  auth,
  authorize("mentor", "admin"),
  courseController.deleteCourse
);

module.exports = router;
