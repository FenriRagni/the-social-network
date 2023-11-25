const router = require('express').Router();

const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;