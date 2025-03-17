const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fullTimeJobsRoute = require('./routes/jobsRoute');
const connectDB = require('./db/connection')

const app = express();
const PORT = process.env.PORT || 3000;

connectDB(); 
app.use(cors());

// Middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
// routes

app.get("/", (req,res)=>{
 res.send("Hello From Server");
})

app.use('/jobs', fullTimeJobsRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});