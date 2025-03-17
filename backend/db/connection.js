const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://rawatprakriti9:aq0UMIcluFJXl9DA@cluster0.w69sa.mongodb.net/Cuvette", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Stop the app if DB connection fails
  }
};

module.exports = connectDB;
