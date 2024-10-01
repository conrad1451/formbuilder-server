//source:  https://www.geeksforgeeks.org/how-to-make-mongoose-multiple-collections-using-node-js/#

// model.js

// Requiring module
const mongoose = require('mongoose');

// Course Modal Schema
const courseSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    category: String
});

// Student Modal Schema
const studentSchema = new mongoose.Schema({
    name: String,
    enroll: Number,
    courseId: Number
});

// Teacher Modal Schema
const teacherSchema = new mongoose.Schema({
    name: String,
    teacher_id: Number,
    courseId: Number
})

// Creating model objects
const Course = mongoose.model('course', courseSchema);
const Student = mongoose.model('student', studentSchema);
const Teacher = mongoose.model('teacher', teacherSchema);

// Exporting our model objects
module.exports = {
    Student, Course, Teacher
}
