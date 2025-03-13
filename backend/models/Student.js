// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  image: String,
  subjects: [String],
});

module.exports = mongoose.model("Student", studentSchema);
