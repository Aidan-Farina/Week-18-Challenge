const { User, Thought, Reaction } = require('../models');

module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
        try {
            // Fetching all thoughts
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Get a specific thought
    async getSingleThought(req, res) {
        try {
            // Fetching one thought
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Add a new thought
    async createThought(req, res) {
        try {
            // Checking if user exists
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Creating a new thought
            const newThought = new Thought({
                ...req.body,
                username: user.username,
            });
            const thought = await Thought.create(newThought);
            await User.updateOne(
                { _id: req.params.userId },
                { $addToSet: { thoughts: thought._id } },
                { runValidators: true, new: true }
            );
            res.status(201).json(newThought);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },
    // Remove a thought
    async deleteThought(req, res) {
        try {
            // Deleting a thought
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
            if (!thought) {
                res.status(404).json({ message: 'No thought with that ID' });
            }
            await Reaction.deleteMany({ _id: { $in: thought.reactions } });
            res.json({ message: 'Thought and Reactions deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Update a thought
    async updateThought(req, res) {
        try {
            // Updating a thought
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!thought) {
                res.status(404).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Add a reaction
    async addReaction(req, res) {
        try {
            // Checking if user exists
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'user not found' });
            };
            // Creating a new reaction
            const newReaction = {
                ...req.body,
                username: user.username,
            };
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: newReaction } },
                { runValidators: true, new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found!' });
            }
            res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    // Remove a reaction
    async deleteReaction(req, res) {
        try {
            // Deleting a reaction
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found!' });
            };
            res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
};

