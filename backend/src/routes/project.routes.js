const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject, getProjectTitle } = require('../controllers/project.controller');

const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getProjects).post(createProject);

router.route('/:id').get(getProjectTitle);

router.route('/:id').put(updateProject).delete(deleteProject);

module.exports = router;
