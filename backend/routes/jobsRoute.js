const express = require('express');
const router = express.Router();
const { handleCreateJob, handleViewJobs,} = require('../controllers/jobController')

router.get('/', handleViewJobs);

router.post('/createjob', handleCreateJob);

module.exports = router;