const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, getProjectsByUser, getUserName } = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect, restrictTo('ADMIN'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id/projects', getProjectsByUser);
router.get('/:id/name', getUserName);

module.exports = router;
