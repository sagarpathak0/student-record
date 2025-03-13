// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const studentController = require("../controllers/studentController");

// Set up multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "students",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// Define routes
router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", upload.single("image"), studentController.createStudent);
router.put("/:id", upload.single("image"), studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
