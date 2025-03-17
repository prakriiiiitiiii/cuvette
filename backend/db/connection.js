const mongoose = require('mongoose');

const connectDB = async ()=>{
    try {
        mongoose.connect("mongodb://localhost:27017/Cuvette")
        console.log("DB connected!");
    } catch (error) {
        console.log("DB connection Error!", error);
    }
}
module.exports = connectDB;