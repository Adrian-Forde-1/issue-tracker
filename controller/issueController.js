const IssueModel = require("../models/IssueModel");
const ProjectModal = require("../models/ProjectModel");
const TeamModal = require("../models/TeamModel");
const _ = require("lodash");

const { NEW_ISSUE } = require("../util/issueStatus");

const issueUpdateTypes = {
  "STATUS UPDATE": "STATUS UPDATE",
  "DESCRIPTION UPDATE": "DESCRIPTION UPDATE",
  "NAME UPDATE": "NAME UPDATE",
  "LABEL UPDATE": "LABEL UPDATE",
};

module.exports = {
  //Create Issue
  createIssue: (req, res) => {
    if (req.body.issue) {
      let errors = [];
      let messages = [];

      //Get variables user entered
      const { name, description, labels, projectId, assignees } =
        req.body.issue;

      IssueModel.find({ name: name, project: projectId }).exec(function (
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

        IssueModel.findById(issueId).exec(function (err, issue) {
          //If error occured, notify user
          if (err) {
            console.error(err);
            error.push("Error occured when updating issue");
            return res.status(500).json(errors);
          }

          let newUpdates = [...issue.updates];

          let oldDescription = issue.description;
          let oldName = issue.name;
          let oldLabels = issue.labels;

          if (oldDescription.toString() !== issueInfo.description.toString()) {
            let newUpdate = {
              date: Date.now(),
              updateType: issueUpdateTypes["DESCRIPTION UPDATE"],
              updateInfo: issueInfo.description,
              updatedBy: req.body.username,
            };
            newUpdates.push(newUpdate);
          }

          if (oldName.toString() !== issueInfo.name.toString()) {
            let newUpdate = {
              date: Date.now(),
              updateType: issueUpdateTypes["NAME UPDATE"],
              updateInfo: issueInfo.name,
              updatedBy: req.body.username,
            };
            newUpdates.push(newUpdate);
          }

          if (!_.isEqual(oldLabels, issueInfo.labels)) {
            let newUpdate = {
              date: Date.now(),
              updateType: issueUpdateTypes["LABEL UPDATE"],
              updateInfo: issueInfo.labels.join(" "),
              updatedBy: req.body.username,
            };
            newUpdates.push(newUpdate);
          }

          IssueModel.findByIdAndUpdate(issueId, {
            $set: {
              name: issueInfo.name,
              description: issueInfo.description,
              labels: issueInfo.labels,
              assignees: issueInfo.assignees,
              updates: newUpdates,
            },
          }).exec(function (err, issue) {
            //If error occured, notify user
            if (err) {
              console.error(err);
              errors.push("Error occured when updating issue");
              return res.status(500).json(errors);
            }

            //If everything went well, notify user
            messages.push("Successfully updated issue");
            return res.json(messages);
          });
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
        IssueModel.findById(issueId).exec(function (err, issue) {
          //If error occured, notify user
          if (err) {
            console.error(err);
            error.push("Error occured when updating issue");
            return res.status(500).json(errors);
          }

          let newCompletedOn;
          if (newStatus["name"] === "Completed") newCompletedOn = Date.now();
          else newCompletedOn = null;

          let newUpdates = [...issue.updates];
          let newUpdate = {
            date: Date.now(),
            updateType: issueUpdateTypes["STATUS UPDATE"],
            updateInfo: newStatus["name"] ? newStatus["name"] : "undefined",
            updatedBy: req.body.username,
          };

          newUpdates.push(newUpdate);

          IssueModel.findByIdAndUpdate(issueId, {
            status: newStatus,
            completedOn: newCompletedOn,
            updates: newUpdates,
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
        .populate("createdBy comments project")
        .populate({ path: "assignees", select: "username image" })
        .exec(function (err, issue) {
          //If something went wrong when fetching issue, notify user
          if (err) {
            console.error(err);
            errors.issue = "Error occured when fetching issue";
            return res.status(500).json(errors);
          }

          //Checks to see if the project the issue belongs too is part of a team
          if (issue.project.team) {
            //If the project is part of a team, get the team
            TeamModal.findById(issue.project.team).exec(function (err, team) {
              if (err) {
                console.error(err);
                errors.issue = "Error occured when fetching issue";
                return res.status(500).json(errors);
              }

              //Check to see if the user is part of the team
              let belongsToTeam = team.users.findIndex(
                (user) => user.toString() === req.user._id.toString()
              );

              //If the user isn't part of the team, send a 404 response
              if (belongsToTeam === -1) return res.sendStatus(404);

              //If everything went right, return issue
              return res.json(issue);
            });
          } else {
            //If it isn't, check to see if the user trying to view the issue is the owner of the issue
            if (issue.project.createdBy.toString() !== req.user._id.toString())
              return res.sendStatus(404);
            //If everything went right, return issue
            return res.json(issue);
          }
        });
    }
  },
};
