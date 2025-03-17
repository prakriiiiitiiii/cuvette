const mongoose = require('mongoose');

const JobsSchema = new mongoose.Schema({
  title: { type: String, default: "Untitled Job" }, 
  location: { type: String, default: "Remote" },   
  tech: { type: [String], default: [] },     
  package: { type: String},           
  startdate: { type: Date, default: Date.now },     
  openings: { type: Number, default: 1 },            
  experience: { type: String, default: "Any" },    
  type: { type: String, default: "Full-time" } 
}, {timestamps:true});


module.exports = mongoose.model('Jobs', JobsSchema);