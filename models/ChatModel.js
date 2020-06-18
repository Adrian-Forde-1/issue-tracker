const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'team',
    },
    postedAt: {
      type: Date,
      default: Date.now(),
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
