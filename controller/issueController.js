const IssueModel = require("../models/IssueModel");
const ProjectModal = require("../models/ProjectModel");

const { NEW_ISSUE } = require("../util/issueStatus");

module.exports = {
  //Create Issue
  createIssue: (req, res) => {
    if (req.body.issue) {
      let errors = [];
      let messages = [];

      //Get variables user entered
      const {
        name,
        description,
        labels,
        projectId,
        assignees,
      } = req.body.issue;

      const issues = IssueModel.find({ name: name }).exec(function (
        err,
        issues
      ) {
        if (issues.length === 0) {
          //Create an instance of the user model ( a document ) with the values
          //entered by the user and pre-defined values
          const newIssue = new IssueModel({
            name,
            description,
            labels,
            comments: [],
            assignees,
            status: NEW_ISSUE,
            project: projectId,
            createdBy: req.user._id,
          });

          newIssue
            .save()
            .then((issue) => {
              //If everything went well, notify user

              ProjectModal.findById(projectId).exec(function (err, project) {
                //If error occured when fecthing project, notify user
                if (err) {
                  console.error(err);
                  errors.push("Error when updating issues in project");
                  return res.status(500).json(errors);
                }

                //If everything went well, update issues in project
                const newIssues = [...project.issues, issue._id];

                //Update Project
                ProjectModal.findByIdAndUpdate(projectId, {
                  issues: newIssues,
                }).exec(function (err, project) {
                  //If error occured when updating project, notify user
                  if (err) {
                    console.error(err);
                    errors.push("Error when updating issues in project");
                    return res.status(500).json(errors);
                  }

                  //If everything went well, notify user
                  messages.push("Issue successfully added");
                  return res.json(messages);
                });
              });
            })
            .catch((err) => {
              //If error occured, notify user
              errors.push("Error occured when adding issue");
              return res.status(500).json(errors);
            });
        } else {
          errors.push("Issue name already exists");
          return res.status(400).json(errors);
        }
      });
    } else {
      let errors = [];
      errors.push("Opps! Something went wrong");
      return res.status(400).json(errors);
    }
  },
  //Edit Issue
  editIssue: (req, res) => {
    if (req.body.issue) {
      if (req.params.issueId) {
        let messages = [];
        let errors = [];
        const issueId = req.params.issueId;

        const issueInfo = req.body.issue;

        IssueModel.findByIdAndUpdate(issueId, {
          $set: {
            name: issueInfo.name,
            description: issueInfo.description,
            labels: issueInfo.labels,
            assignees: issueInfo.assignees,
          },
        }).exec(function (err, issue) {
          //If error occured, notify user
          if (err) {
            console.error(err);
            error.push("Error occured when updating issue");
            return res.status(500).json(errors);
          }

          //If everything went well, notify user
          messages.push("Successfully updated issue");
          return res.json(messages);
        });
      } else {
        let errors = [];
        errors.push("Issue Not Found");
        return res.status(404).json(errors);
      }
    } else {
      let errors = [];
      errors.push("Opps! Something went wrong");
      return res.status(400).json(errors);
    }
  },
  editIssueStatus: (req, res) => {
    if (req.body.issue) {
      if (req.params.issueId) {
        let messages = [];
        let errors = [];
        const issueId = req.params.issueId;

        const newStatus = req.body.issue;

        IssueModel.findByIdAndUpdate(issueId, { status: newStatus }).exec(
          function (err, issue) {
            //If error occured, notify user
            if (err) {
              console.error(err);
              error.push("Error occured when updating issue");
              return res.status(500).json(errors);
            }

            //If everything went well, notify user
            messages.push("Successfully updated issue");
            return res.json(messages);
          }
        );
      } else {
        let errors = [];
        errors.push("Issue Not Found");
        return res.status(404).json(errors);
      }
    } else {
      let errors = [];
      errors.push("Opps! Something went wrong");
      return res.status(400).json(errors);
    }
  },
  //Delete Issue
  deleteIssue: (req, res) => {
    if (req.params.issueId) {
      let messages = [];
      let errors = [];
      const issueId = req.params.issueId;
      IssueModel.findByIdAndDelete(issueId).exec(function (err, issue) {
        //If error occured, notify user
        if (err) {
          console.error(err);
          errors.push("Error occured when deleting issue");
          return res.status(500).json(errors);
        }

        //If everything went well, notify user
        messages.push("Successfully deleted issue");
        return res.json(messages);
      });
    } else {
      let errors = [];
      errors.push("Issue not found");
      return res.status(404).json(errors);
    }
  },
  getIssue: (req, res) => {
    if (req.params.issueId) {
      let errors = [];
      const issueId = req.params.issueId;
      IssueModel.findById(issueId)
        .populate("createdBy comments project assignees")
        .exec(function (err, issue) {
          //If something went wrong when fetching issue, notify user
          if (err) {
            console.error(err);
            errors.issue = "Error occured when fetching issue";
            return res.status(500).json(errors);
          }

          //If everything went right, return issue
          return res.json(issue);
        });
    }
  },
};
