const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

// Creating the thought schema
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
);

// Getting the count of reactions
thoughtSchema.virtual('formattedCount').get(function () {
    return this.reactions.length;
});

// Creating the Thought model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
