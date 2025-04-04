// main.js
require('dotenv').config();

const mongoose = require('mongoose');
const { Student, Course, Teacher } = require('../models/model.js');

// Connecting to database
// mongoose.connect('mongodb://localhost:27017/GFG',
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false
//     });

mongoose.connect(process.env.MONGODB_CONNECTION_GFG_DB);

// Creating array of course data object
const courseData = [{
    _id: 0o1,
    name: "NodeJS",
    category: "Backend"
},
{
    _id: 0o2,
    name: "MongoDB",
    category: "Database"
}]

// Creating array of student data objects
const studentData = [{
    name: "John",
    enroll: 1801,
    courseId: 0o1
}]

// Creating array of teacher data object
const teacherData = [{
    name: "TeacherX",
    teacher_id: 9901,
    courseId: 0o1
},
{
    name: "TeacherY",
    teacher_id: 9902,
    courseId: 0o2
}]

// Inserting course data
Course.insertMany(courseData)
    .then(value => {
        console.log("Saved Successfully");
    })
    .catch(error => {
        console.log(error);
    })

// Inserting student data
Student.insertMany(studentData)
    .then(value => {
        console.log("Saved Successfully");
    })
    .catch(error => {
        console.log(error);
    })

// Inserting teacher data
Teacher.insertMany(teacherData)
    .then(value => {
        console.log("Saved Successfully");
    })
    .catch(error => {
        console.log(error);
    })
