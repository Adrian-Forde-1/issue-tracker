const NoteModel = require('../models/NoteModel');
const BugModel = require('../models/BugModel');

module.exports = {
  createNote: (req, res) => {
    if (req.body.bugId && req.body.note) {
      let messages = {};
      let errors = {};
      const bugId = req.body.bugId;

      const { note } = req.body.note;
      const username = req.body.username;

      const newNote = new NoteModel({
        note,
        createdBy: username,
        bug: bugId,
      });

      newNote
        .save()
        .then((note) => {
          //Add note to bug document
          BugModel.findById(bugId).exec(function (err, bug) {
            //If something went wrong when fecthing bug, notify user,
            if (err) {
              console.err(err);
              errors.note = 'Error occured when adding note to bug';
              return res.this.status(500).json(error);
            }

            const newNoteArray = [...bug.notes, note._id];

            //Update bug with new notes

            BugModel.findByIdAndUpdate(bugId, { notes: newNoteArray }).exec(
              function (err, bug) {
                //If something went wrong when updating bug, notify user,
                if (err) {
                  console.err(err);
                  errors.note = 'Error occured when adding note to bug';
                  return res.this.status(500).json(error);
                }

                //If everything went well, notify user
                messages.note = 'Note successfully added';
                return res.json(messages);
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          errors.note = 'Opps! Something went wrong';
          return res.status(500).json(errors);
        });
    } else {
      let errors = {};
      errors.general = 'Opps! Something went wrong';
      return res.status(400).json(errors);
    }
  },
  deleteNote: (req, res) => {
    if (req.params.noteId) {
      let errors = {};
      let messages = {};
      const noteId = req.params.noteId;
      NoteModel.findByIdAndDelete(noteId).exec(function (err, note) {
        //If something went wrong when deleting note, notify user
        if (err) {
          console.err(err);
          errors.note = 'Error occured when deleting note';
          return res.status(500).json(errors);
        }

        //If note was deleted, remove it from bug
        BugModel.findById(note.bug).exec(function (err, bug) {
          //If something went wrong when fetching bug, notify user
          if (err) {
            console.err(err);
            errors.note = 'Error occured when removing note from bug';
            return res.status(500).json(errors);
          }

          //If bug was fetched, remove note
          const newNoteArray = bug.notes.filter(
            (note) => note.toString() !== noteId.toString()
          );

          //Update bug with new notes

          BugModel.findByIdAndUpdate(bug._id, { notes: newNoteArray }).exec(
            function (err, bug) {
              //If something went wrong when updating bug notes, notify user
              if (err) {
                console.err(err);
                errors.note = 'Error occured when updating bug notes';
                return res.status(500).json(errors);
              }

              //If everything went well, notify user
              messages.note = 'Note successfully removed';
              return res.json(messages);
            }
          );
        });
      });
    } else {
      let errors = {};
      errors.general = 'Opps! Something went wrong';
      return res.status(400).json(errors);
    }
  },
  editNote: (req, res) => {
    if (req.params.noteId) {
      let messages = {};
      let errors = {};
      const noteId = req.params.noteId;

      const { description } = req.body.note;

      NoteModel.findByIdAndUpdate(noteId, { description: description }).exec(
        function (err, note) {
          //If error occured when updating note with edit, notify user
          if (err) {
            console.err(err);
            errors.note = 'Error occured when updating note with edit';
            return res.status(500).json(errors);
          }

          //If everything went well, notify user
          messages.note = 'Note successfully updated';
          return res.json(messages);
        }
      );
    } else {
      let errors = {};
      errors.general = 'Opps! Something went wrong';
      return res.status(400).json(errors);
    }
  },
};
