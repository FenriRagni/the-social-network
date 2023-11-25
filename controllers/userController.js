const { User, Thought } = require('../models');

module.exports = {
  //get all users
  async getUsers(req, res) {
    try {
      const users = await User.find().populate({ path: 'friends', select: '-__v' }).select('-__v');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //get single user by id
  async getUserById(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id }).populate({ path: 'friends', select: '-__v'});
      if(!user) {
        return res.status(404).json({ message: 'No user with that ID'});
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //create user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body).select('-__v');
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      ).select('-__v');
      if(!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete({ _id: req.params.id });
      
      if(!user) {
        res.status(404).json({ message: 'No user with this id!'});
      }

      await Thought.deleteMany( { _id: { $in: user.thoughts} });
      res.json({ message: 'User and thoughts deleted'});
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //add friend to list of friends
  async addFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId},
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      ).select('-__v');

      if(!user) {
        res.status(404).json({ message: 'No user with this id!'});
      }

      res.json(user);      
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //remove friend from list of friends
  async removeFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId }},
        { runValidators: true, new: true }
      ).select('-__v')

      if(!user) {
        return res.status(404).json({ message: 'No user found with this id!'});
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}