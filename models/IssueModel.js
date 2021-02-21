const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Object,
    required: true,
  },
  labels: [
    {
      type: String,
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  assignees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  completedOn: {
    type: Date,
    default: null,
  },
  updates: [
    {
      date: Date,
      updateType: String,
      updateInfo: String,
      updatedBy: String,
    },
  ],
});

const IssueModel = mongoose.model("issue", issueSchema);

module.exports = IssueModel;
