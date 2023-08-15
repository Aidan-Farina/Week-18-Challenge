const { Schema, model } = require('mongoose');

// User schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought', 
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User', 
      },
    ],
  },
);

// Getting the count of friends
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Creating the User model
const User = model('User', userSchema);

module.exports = User;
