const { Course, Student, Thought } = require('../models');

module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Course.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Get a course
    async getSingleThought(req, res) {
        try {
            const course = await Thought.findOne({ _id: req.params.thoughtaId })
                .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Create a thought
    async createThought(req, res) {
        try {
            const user = await user.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'user not found' });
            }

            const newThought = new Thought({
                content: req.body.content,
                user: user._id,
            })

            await newThought.save();

            res.status(201).json(newThought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // Delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.courseId });

            if (!thought) {
                res.status(404).json({ message: 'No thought with that ID' });
            }

            await Student.deleteMany({ _id: {$in: thought.reactions} } );

            res.json({ message: 'Thought and Reactions deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(course);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};
