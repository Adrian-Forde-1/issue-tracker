const CommentModel = require('../models/CommentModel');
const BugModel = require('../models/BugModel');

module.exports = {
  createComment: (req, res) => {
    if (req.body.bugId && req.body.comment) {
      let messages = {};
      let errors = {};
      const bugId = req.body.bugId;

      const { comment } = req.body.comment;
      const username = req.body.username;

      const newComment = new CommentModel({
        comment,
        createdBy: username,
        bug: bugId,
      });

      newComment
        .save()
        .then((comment) => {
          //Add comment to bug document
          BugModel.findById(bugId).exec(function (err, bug) {
            //If something went wrong when fecthing bug, notify user,
            if (err) {
              console.error(err);
              errors.comment = 'Error occured';
              return res.this.status(500).json(error);
            }

            const newCommentArray = [...bug.comments, comment._id];

            //Update bug with new comments

            BugModel.findByIdAndUpdate(bugId, {
              comments: newCommentArray,
            }).exec(function (err, bug) {
              //If something went wrong when updating bug, notify user,
              if (err) {
                console.error(err);
                errors.comment = 'Error occured';
                return res.this.status(500).json(error);
              }

              //If everything went well, notify user
              messages.comment = 'COmment successfully added';
              return res.json(messages);
            });
          });
        })
        .catch((error) => {
          console.error(error);
          errors.comment = 'Opps! Something went wrong';
          return res.status(500).json(errors);
        });
    } else {
      let errors = {};
      errors.general = 'Opps! Something went wrong';
      return res.status(400).json(errors);
    }
  },
  deleteComment: (req, res) => {
    if (req.params.commentId) {
      let errors = {};
      let messages = {};
      const commentId = req.params.commentId;
      CommentModel.findByIdAndDelete(commentId).exec(function (err, comment) {
        //If something went wrong when deleting comment, notify user
        if (err) {
          console.error(err);
          errors.comment = 'Error occured';
          return res.status(500).json(errors);
        }

        //If comment was deleted, remove it from bug
        BugModel.findById(comment.bug).exec(function (err, bug) {
          //If something went wrong when fetching bug, notify user
          if (err) {
            console.error(err);
            errors.comment = 'Error occured';
            return res.status(500).json(errors);
          }

          //If bug was fetched, remove comment
          const newCommentArray = bug.comments.filter(
            (comment) => comment.toString() !== commentId.toString()
          );

          //Update bug with new comments

          BugModel.findByIdAndUpdate(bug._id, {
            comments: newCommentArray,
          }).exec(function (err, bug) {
            //If something went wrong when updating bug comments, notify user
            if (err) {
              console.error(err);
              errors.comment = 'Error occured';
              return res.status(500).json(errors);
            }

            //If everything went well, notify user
            messages.comment = 'Comment successfully removed';
            return res.json(messages);
          });
        });
      });
    } else {
      let errors = {};
      errors.general = 'Opps! Something went wrong';
      return res.status(400).json(errors);
    }
  },
  editComment: (req, res) => {
    if (req.params.commentId) {
      let messages = {};
      let errors = {};
      const commentId = req.params.commentId;

      const { description } = req.body.comment;

      CommentModel.findByIdAndUpdate(commentId, {
        description: description,
      }).exec(function (err, comment) {
        //If error occured when updating comment with edit, notify user
        if (err) {
          console.error(err);
          errors.comment = 'Error occured';
          return res.status(500).json(errors);
        }

        //If everything went well, notify user
        messages.comment = 'Comment successfully updated';
        return res.json(messages);
      });
    } else {
      let errors = {};
      errors.general = 'Opps! Something went wrong';
      return res.status(400).json(errors);
    }
  },
};
