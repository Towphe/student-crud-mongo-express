import mongoose from 'mongoose';
const {Schema} = mongoose;

const StudentSchema = new Schema({
    firstName: String,
    lastName: String,
    studentNo: String,
    standing: String
});

const Student = mongoose.model('Student', StudentSchema);

export {StudentSchema, Student}