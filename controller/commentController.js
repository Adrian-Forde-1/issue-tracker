const CommentModel = require("../models/CommentModel");
const IssueModel = require("../models/IssueModel");

module.exports = {
  createComment: (req, res) => {
    if (req.body.issueId && req.body.comment) {
      let messages = {};
      let errors = {};
      const issueId = req.body.issueId;

      const { comment } = req.body.comment;
      const username = req.body.username;

      const newComment = new CommentModel({
        comment,
        createdBy: username,
        issue: issueId,
      });

      newComment
        .save()
        .then((comment) => {
          //Add comment to issue document
          IssueModel.findById(issueId).exec(function (err, issue) {
            //If something went wrong when fecthing issue, notify user,
            if (err) {
              console.error(err);
              errors.comment = "Error occured";
              return res.this.status(500).json(error);
            }

            const newCommentArray = [...issue.comments, comment._id];

            //Update issue with new comments

            IssueModel.findByIdAndUpdate(issueId, {
              comments: newCommentArray,
            }).exec(function (err, issue) {
              //If something went wrong when updating issue, notify user,
              if (err) {
                console.error(err);
                errors.comment = "Error occured";
                return res.this.status(500).json(error);
              }

              //If everything went well, notify user
              messages.comment = "COmment successfully added";
              return res.json(messages);
            });
          });
        })
        .catch((error) => {
          console.error(error);
          errors.comment = "Opps! Something went wrong";
          return res.status(500).json(errors);
        });
    } else {
      let errors = {};
      errors.general = "Opps! Something went wrong";
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
          errors.comment = "Error occured";
          return res.status(500).json(errors);
        }

        //If comment was deleted, remove it from issue
        IssueModel.findById(comment.issue).exec(function (err, issue) {
          //If something went wrong when fetching issue, notify user
          if (err) {
            console.error(err);
            errors.comment = "Error occured";
            return res.status(500).json(errors);
          }

          //If issue was fetched, remove comment
          const newCommentArray = issue.comments.filter(
            (comment) => comment.toString() !== commentId.toString()
          );

          //Update issue with new comments

          IssueModel.findByIdAndUpdate(issue._id, {
            comments: newCommentArray,
          }).exec(function (err, issue) {
            //If something went wrong when updating issue comments, notify user
            if (err) {
              console.error(err);
              errors.comment = "Error occured";
              return res.status(500).json(errors);
            }

            //If everything went well, notify user
            messages.comment = "Comment successfully removed";
            return res.json(messages);
          });
        });
      });
    } else {
      let errors = {};
      errors.general = "Opps! Something went wrong";
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
          errors.comment = "Error occured";
          return res.status(500).json(errors);
        }

        //If everything went well, notify user
        messages.comment = "Comment successfully updated";
        return res.json(messages);
      });
    } else {
      let errors = {};
      errors.general = "Opps! Something went wrong";
      return res.status(400).json(errors);
    }
  },
};
