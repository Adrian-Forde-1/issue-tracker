const BugModel = require('../models/BugModel');
const ProjectModal = require('../models/ProjectModel');

const { NEW_BUG } = require('../util/bugStatus');

module.exports = {
  //Create Bug
  createBug: (req, res) => {
    if (req.body.bug) {
      let errors = {};
      let messages = {};

      //Get variables user entered
      const { name, description, labels, projectId, assignees } = req.body.bug;

      //Create an instance of the user model ( a document ) with the values
      //entered by the user and pre-defined values
      const newBug = new BugModel({
        name,
        description,
        labels,
        comments: [],
        assignees,
        status: NEW_BUG,
        project: projectId,
        createdBy: req.user._id,
      });

      newBug
        .save()
        .then((bug) => {
          //If everything went well, notify user

          ProjectModal.findById(projectId).exec(function (err, project) {
            //If error occured when fecthing project, notify user
            if (err) {
              console.error(err);
              error.bug = 'Error when updating bugs in project';
              return res.status(500).json(errors);
            }

            //If everything went well, update bugs in project
            const newBugs = [...project.bugs, bug._id];

            //Update Project
            ProjectModal.findByIdAndUpdate(projectId, { bugs: newBugs }).exec(
              function (err, project) {
                //If error occured when updating project, notify user
                if (err) {
                  console.error(err);
                  error.project = 'Error when updating bugs in project';
                  return res.status(500).json(errors);
                }

                //If everything went well, notify user
                messages.bug = 'Bug successfully added';
                return res.json(messages);
              }
            );
          });
        })
        .catch((err) => {
          //If error occured, notify user
          errors.bug = 'Error occured when adding bug';
          return res.status(500).json(errors);
        });
    } else {
      let errors = {};
      errors.bug = 'Opps! Something went wrong';
      return res.status(400).json(errors);
    }
  },
  //Edit Bug
  editBug: (req, res) => {
    if (req.body.bug) {
      if (req.params.bugId) {
        let messages = {};
        let errors = {};
        const bugId = req.params.bugId;

        const bugInfo = req.body.bug;

        BugModel.findByIdAndUpdate(bugId, {
          $set: {
            name: bugInfo.name,
            description: bugInfo.description,
            labels: bugInfo.labels,
            assignees: bugInfo.assignees,
          },
        }).exec(function (err, bug) {
          //If error occured, notify user
          if (err) {
            console.error(err);
            error.bug = 'Error occured when updating bug';
            return res.status(500).json(errors);
          }

          //If everything went well, notify user
          messages.bug = 'Successfully updated bug';
          return res.json(messages);
        });
      } else {
        let errors = {};
        errors.bug = 'Bug Not Found';
        return res.status(404).json(errors);
      }
    } else {
      let errors = {};
      errors.bug = 'Opps! Something went wrong';
      return res.status(400).json(errors);
    }
  },
  editBugStatus: (req, res) => {
    if (req.body.bug) {
      if (req.params.bugId) {
        let messages = {};
        let errors = {};
        const bugId = req.params.bugId;

        const newStatus = req.body.bug;

        BugModel.findByIdAndUpdate(bugId, { status: newStatus }).exec(function (
          err,
          bug
        ) {
          //If error occured, notify user
          if (err) {
            console.error(err);
            error.bug = 'Error occured when updating bug';
            return res.status(500).json(errors);
          }

          //If everything went well, notify user
          messages.bug = 'Successfully updated bug';
          return res.json(messages);
        });
      } else {
        let errors = {};
        errors.bug = 'Bug Not Found';
        return res.status(404).json(errors);
      }
    } else {
      let errors = {};
      errors.bug = 'Opps! Something went wrong';
      return res.status(400).json(errors);
    }
  },
  //Delete Bug
  deleteBug: (req, res) => {
    if (req.params.bugId) {
      let messages = {};
      let errors = {};
      const bugId = req.params.bugId;
      BugModel.findByIdAndDelete(bugId).exec(function (err, bug) {
        //If error occured, notify user
        if (err) {
          console.error(err);
          errors.bug = 'Error occured when deleting bug';
          return res.status(500).json(errors);
        }

        //If everything went well, notify user
        messages.bug = 'Successfully deleted bug';
        return res.json(messages);
      });
    } else {
      let errors = {};
      errors.bug = 'Bug not found';
      return res.status(404).json(errors);
    }
  },
  getBug: (req, res) => {
    if (req.params.bugId) {
      let errors = {};
      const bugId = req.params.bugId;
      BugModel.findById(bugId)
        .populate('createdBy comments project assignees')
        .exec(function (err, bug) {
          //If something went wrong when fetching bug, notify user
          if (err) {
            console.error(err);
            errors.bug = 'Error occured when fetching bug';
            return res.status(500).json(errors);
          }

          //If everything went right, return bug
          return res.json(bug);
        });
    }
  },
};
