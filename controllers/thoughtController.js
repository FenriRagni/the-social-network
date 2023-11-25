const { User } = require('../models');

module.exports = {
  //get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(courses);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}