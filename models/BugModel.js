const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  status: {
    type: Object,
    required: true,
  },
  label: {
    name: String,
    color: String,
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'note',
    },
  ],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'project',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const BugModel = mongoose.model('bug', bugSchema);

module.exports = BugModel;
