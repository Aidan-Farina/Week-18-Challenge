const { User } = require('../models');
const { path } = require('../models/Reaction');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
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
  
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.UserId }).populate([
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

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //update a user
  async updateUser(req, res) {
    try {
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

  // Delete a User
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.UserId });

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

  // get all friends
  async getFriends(req, res) {
    try {
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

  // add a friend
  async addFriend(req, res) {
    try {
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

  // remove a friend
  async removeFriend(req, res) {
    try {
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
