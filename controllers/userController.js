const { User } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      // Fetching all users
      const users = await User.find().populate([
        {
          path: 'friends',
          select: '-__v',
        },
        {
          path: 'thoughts',
          select: '-__v',
        }
      ]);
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  // Get one user
  async getSingleUser(req, res) {
    try {
      // Fetching one user
      const user = await User.findOne({ _id: req.params.userId }).populate([
        {
          path: 'friends',
          select: '-__v',
        },
        {
          path: 'thoughts',
          select: '-__v',
        }
      ]);
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // Add a new user
  async createUser(req, res) {
    try {
      // Creating user
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  // Update user details
  async updateUser(req, res) {
    try {
      // Updating user
      const user = await User.findOneAndUpdate(
        { _id: req.params.UserId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove a user
  async deleteUser(req, res) {
    try {
      // Deleting user
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if (!user) {
        return res.status(404).json({ message: 'No such user exists' });
      }
      user.friends.forEach(async (friend) => {
        await User.updateOne(
          { _id: friend },
          { $pull: { friends: req.params.UserId } }
        );
      });
      res.json({ message: 'User deleted and friends successfully removed ' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get all friends of a user
  async getFriends(req, res) {
    try {
      // Fetching friends
      const user = await User.findOne({ _id: req.params.UserId }).populate({
        path: 'friends',
        select: '-__v',
      });
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user.friends);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a friend to user's list
  async addFriend(req, res) {
    try {
      // Adding friend
      const user = await User.updateOne(
        { _id: req.params.UserId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove a friend from user's list
  async removeFriend(req, res) {
    try {
      // Removing friend
      const user = await User.updateOne(
        { _id: req.params.UserId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
