const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    labels: [
      {
        name: String,
        color: String,
      },
    ],
    bugs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bug',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'team',
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } }
);

const ProjectModel = mongoose.model('project', projectSchema);

module.exports = ProjectModel;
