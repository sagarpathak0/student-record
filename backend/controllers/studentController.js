// controllers/studentController.js
const Student = require("../models/Student");
const cloudinary = require("../config/cloudinary");

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { email, phone, studentId } = req.body;
    // Check for duplicate email, phone, or studentId
    const existingStudent = await Student.findOne({
      $or: [{ email }, { phone }, { studentId }],
    });
    if (existingStudent) {
      return res.status(400).json({
        error: "A student with the same email, phone, or student ID already exists.",
      });
    }

    // Parse subjects (expecting JSON string)
    let { subjects } = req.body;
    if (typeof subjects === "string") {
      subjects = JSON.parse(subjects);
    }

    const imageUrl = req.file ? req.file.path : "";
    const student = new Student({ ...req.body, subjects, image: imageUrl });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const { email, phone, studentId } = req.body;
    // Check for duplicates excluding the current student
    const duplicate = await Student.findOne({
      _id: { $ne: req.params.id },
      $or: [{ email }, { phone }, { studentId }],
    });
    if (duplicate) {
      return res.status(400).json({
        error: "A student with the same email, phone, or student ID already exists.",
      });
    }

    // Parse subjects (expecting JSON string)
    let { subjects } = req.body;
    if (typeof subjects === "string") {
      subjects = JSON.parse(subjects);
    }

    let imageUrl = student.image;
    if (req.file) {
      // Delete the old image from Cloudinary if present
      if (student.image) {
        const publicId = student.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`students/${publicId}`);
      }
      imageUrl = req.file.path;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body, subjects, image: imageUrl },
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    if (student.image) {
      const publicId = student.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`students/${publicId}`);
    }

    await Student.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
