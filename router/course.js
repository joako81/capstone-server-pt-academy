const express = require("express");
const multiparty = require("connect-multiparty");
const CourseController = require("../controllers/course");
const md_auth = require("../middlewares/authenticated");

const md_upload = multiparty({ uploadDir: "./media_files/course" });

const api = express.Router();

//APIS

api.post(
  "/course",
  [md_auth.asureAuth, md_upload],

  CourseController.createCourse
);

api.get("/course", CourseController.getCourses);
api.patch(
  "/course/:id",
  [md_auth.asureAuth, md_upload],
  CourseController.updateCourse
);

api.delete("/course/:id", [md_auth.asureAuth], CourseController.deleteCourse);

api.get("/course/:url", CourseController.getCourse);

module.exports = api;
