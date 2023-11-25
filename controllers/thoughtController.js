const { Thought, User } = require('../models');

module.exports = {
  //get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  //get thought by id
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.id});
      if(!thought) {
        res.status(404).json({ message: 'No thought with this id!'});
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //create thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id }},
        { runValidators: true, new: true}
        );

      if(!user) {
        res.status(404).json('No matching username found!')
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  //update thought
  async updateThought(req, res) {
    try{ 
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if(!thought){
        res.status(404).json({ message: 'No thought with this id!'});
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //delete thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.id});
      if(!thought) {
        res.status(404).json({ message: 'No thought with this id!'});
      }
      res.json({ message: 'Thought deleted'});
    } catch (err) {
      res.status(500).json(err)
    }
  },

  //add reaction
  async addReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.id},
        { $addToSet: req.body},
        { runValidators: true, new: true});
      if(!thought) {
        res.status(404).json({ message: 'No thought with this id!'});
      }
      res.json(thought);
    } catch(err) {
      res.status(500).json(err);
    }
  },

  //remove reaction
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.id },
        { $pull: req.body.reactionId},
        { runValidators: true, new: true});
      if(!thought){
        res.status(404).json({ message: 'No thought with this id!'});
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}