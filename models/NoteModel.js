const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      maxlength: 500,
    },
    bug: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'bug',
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const NoteModel = mongoose.model('note', noteSchema);

module.exports = NoteModel;
