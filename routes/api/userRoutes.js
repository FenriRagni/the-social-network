const router = require('express').Router();

const {
  getUsers
} = require('../../controllers/userController');

// /api/users
router.router('/').get(getUsers);