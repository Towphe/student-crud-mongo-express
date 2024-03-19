import express from 'express';
import mongoose from 'mongoose';
import { Student } from './StudentSchema.js';

const server = '127.0.0.1:27017';
const database = 'test-db';
const port = 3000;
const app = express();

// configure express js
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// db connection
await mongoose.connect(`mongodb://${server}/${database}`);

// express application

// GET > Retrieve specific student
app.get("/:studentNo", async (req, res) => {
    let student = await Student.findOne({
        studentNo: req.params.studentNo
    }, 'firstName lastName studentNo standing').exec();

    if (student == null){
        res.statusCode = 404;
        res.send({detail: 'Student not found'});
        return;
    }

    await res.send(student);
});

// GET > Retrieves students via paginations
app.get("/", async (req, res) => {
    // query parameters: p - page, c - count
    let page = req.query.p ?? 1;
    let count = req.query.c ?? 10;

    // get
    let students = await Student.find().skip((page - 1) * count).limit(count);

    res.send(students);
});

// POST > Create new Student
app.post("/", async (req,res) => {
    if (JSON.stringify(Object.keys(req.body).sort()) != JSON.stringify(['firstName', 'lastName', 'standing', 'studentNo'])){
        // invalid JSON body
        res.statusCode = 400;
        res.send({detail: 'Invalid input'});
        return;
    }
    
    // check if student is already in system
    let student = await Student.findOne({studentNo: req.body.studentNo});

    if (student != null){
        // student is already in system.
        res.statusCode = 400;
        res.send({detail: 'Student already in system.'});
        return;
    }

    // save Student in db
    student = new Student(req.body);
    await student.save();
    
    res.send({detail: 'Success'});
});

// DELETE > Deletes a student from system
app.delete("/:studentNo", async (req, res) => {
    let student = await Student.findOneAndDelete({studentNo: req.params.studentNo});

    if (student == null){
        // non-existent user in the first place
        res.statusCode = 404;
        await res.send({detail: 'Non-existent user.'});
        return;
    }

    await res.send({detail: 'Deletion success.'});
});

// PATCH > updates student info
app.patch('/:studentNo', async (req, res) => {
    let body = req.body;
    let student = await Student.findOne({studentNo: req.params.studentNo});

    if (student == null){
        // non-existent user in the first place
        res.statusCode = 404;
        await res.send({detail: 'Non-existent user.'});
        return;
    }
    
    student.standing = body.standing;
    student.studentNo = body.studentNo;
    student.firstName = body.firstName;
    student.lastName = body.lastName;

    await student.save();

    await res.send({detail: 'Update success.'});
});

// configure server to listen to 
app.listen(port, () => {
    // startup behaviour
    console.log(`Example app listening on ${port}`)
});


// const s1 = new Student({firstName: "JC", lastName: "Castillo", studentNo: '2022-03647', standing: "SOPHOMORE"});

// await s1.save();