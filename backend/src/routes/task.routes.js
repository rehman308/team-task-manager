const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/task.controller');

const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/project/:projectId', getTasks);
router.post('/project/:projectId', createTask);

router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;
