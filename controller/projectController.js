const ProjectModel = require("../models/ProjectModel");
const UserModel = require("../models/UserModel");
const TeamModel = require("../models/TeamModel");

module.exports = {
  //Create Project
  createProject: (req, res) => {
    if (req.body.project) {
      let messages = {};
      let errors = {};

      const team = req.body.project.teamId || null;
      console.log("||||||||||||||||||| Team Id |||||||||||||||||||");
      console.log(team);

      const defaultLabels = [
        {
          name: "Need Help",
          color: "#32936f",
        },
        {
          name: "More Info",
          color: "#2274a5",
        },
        {
          name: "Bug",
          color: "#a71d31",
        },
        {
          name: "Question",
          color: "#FFAA1D",
        },
      ];

      //Get variables from the user
      const { name, description } = req.body.project;

      //Create an instance of the project model ( a document ) with the values passed in
      //by the user and other pre-defined values
      const newProject = new ProjectModel({
        name,
        description,
        createdBy: req.user._id,
        labels: defaultLabels,
        createdBy: req.user._id,
        team,
      });

      //Save a new project to the database
      newProject
        .save()
        .then((project) => {
          //Add the project to the list of projects the user is in ( adding it by its id )
          let newProjects = [...req.user.projects, project._id];

          UserModel.findByIdAndUpdate(req.user._id, {
            projects: newProjects,
          }).exec(function (err, user) {
            //Error occured? Notify user
            if (err) {
              console.error(err);
              errors.user = "Error occured when adding project to user";
              return res.status(500).json(errors);
            }

            if (req.body.project.teamId) {
              const teamId = req.body.project.teamId;
              TeamModel.findById(teamId).exec(function (err, team) {
                //Error occured? Notify user
                if (err) {
                  console.error(err);
                  errors.user = "Error occured when adding project to team";
                  return res.status(500).json(errors);
                }

                const newProjectsArray = [...team.projects, project._id];

                TeamModel.findByIdAndUpdate(teamId, {
                  projects: newProjectsArray,
                }).exec(function (err, team) {
                  //Error occured? Notify user
                  if (err) {
                    console.error(err);
                    errors.user = "Error occured";
                    return res.status(500).json(errors);
                  }

                  //Return a message if the project was successfully saved
                  messages.project = "Project successfully created";
                  return res.json(messages);
                });
              });
            } else {
              //Return a message if the project was successfully saved
              messages.project = "Project successfully created";
              return res.json(messages);
            }
          });
        })
        .catch((error) => {
          errors.project = "Error occured when creating project";
          return res.status(500).json(error);
        });
    } else {
      let errors = {};
      errors.project = "Opps! Something went wrong";
      return res.status(400).json(errors);
    }
  },
  //Edit Project
  editProject: (req, res) => {
    if (req.body.project) {
      if (req.params.projectId) {
        let messages = [];
        let errors = [];
        const projectId = req.params.projectId;

        //Update project information with the information passed in by the user
        ProjectModel.findByIdAndUpdate(projectId, {
          $set: {
            name: req.body.project.name,
            description: req.body.project.description,
          },
        }).exec(function (err, project) {
          //If an error occured while updating project, notify user
          if (err) {
            console.error(err);
            errors.push("Error occured when updating project");
            return res.status(500).json(errors);
          }

          //If everything went right, notify user
          messages.push("Project successfully updated");
          return res.json(messages);
        });
      } else {
        let errors = {};
        errors.push("Opps! Something went wrong");
        return res.status(400).json(errors);
      }
    } else {
      let errors = {};
      errors.push("Opps! Something went wrong");
      return res.status(400).json(errors);
    }
  },
  //Delete Project
  deleteProject: (req, res) => {
    if (req.params.projectId) {
      let errors = {};
      let messages = {};
      const projectId = req.params.projectId;

      ProjectModel.findById(projectId).exec(function (err, project) {
        //Error occured? Notify User
        if (err) {
          errors.project = "Error occured";
          return res.status(500).json(errors);
        }

        //Check to see if the project is in a team, if so, then the team creator has permission to delete the project
        if (project.team) {
          TeamModel.findById(project.team).exec(function (err, team) {
            //Error occured? Notify user
            if (err) {
              console.error(err);
              errors.project = "An Error occured";
              return res.status(500).json(errors);
            }

            //Check to see if the person deleting the project is the same person who created the team
            if (team.createdBy.toString() === req.user._id.toString()) {
              ProjectModel.findByIdAndDelete(projectId).exec(function (
                err,
                project
              ) {
                //If something went wrong when deleting project, notify user
                if (err) {
                  console.error(err);
                  errors.project = "Error occured";
                  return res.status(500).json(errors);
                }

                TeamModel.findById(project.team).exec(function (err, team) {
                  //Error occured? Notify user
                  if (err) {
                    console.error(err);
                    errors.project = "Error occured";
                    return res.status(500).json(errors);
                  }

                  const newProjectsArray = team.projects.filter(
                    (teamProject) =>
                      teamProject.toString() !== project._id.toString()
                  );

                  TeamModel.findByIdAndUpdate(project.team, {
                    projects: newProjectsArray,
                  }).exec(function (err, team) {
                    //Error occured? Notify user
                    if (err) {
                      console.error(err);
                      errors.project = "Error occured";
                      return res.status(500).json(errors);
                    }

                    //If everything went right, notify user
                    messages.project = "Project was successfully deleted";
                    return res.json(messages);
                  });
                });
              });
            } else {
              //If the person trying to delete the project isn't the same person who created it, notify them
              errors.project =
                "You don't have permission to delete this project";
              return res.status(401).json(errors);
            }
          });
        } else {
          //Check to see if the person deleting the project is the same person who created the project
          if (project.createdBy.toString() === req.user._id.toString()) {
            ProjectModel.findByIdAndDelete(projectId).exec(function (
              err,
              project
            ) {
              //If something went wrong when deleting project, notify user
              if (err) {
                console.error(err);
                errors.project = "Error occured";
                return res.status(500).json(errors);
              }

              //If everything went right, notify user
              messages.project = "Project was successfully deleted";
              return res.json(messages);
            });
          } else {
            //If the person trying to delete the project isn't the same person who created it, notify them
            errors.project = "You don't have permission to delete this project";
            return res.status(401).json(errors);
          }
        }
      });
    } else {
      let errors = {};
      errors.project = "Opps! Something went wrong";
      return res.status(400).json(errors);
    }
  },
  getProject: (req, res) => {
    if (req.params.projectId) {
      let errors = {};

      const projectId = req.params.projectId;

      ProjectModel.findById(projectId)
        .populate("user")
        .populate("bugs")
        .exec(function (err, project) {
          //If something went wrong when looking for project, notify user
          if (err) {
            console.error(err);
            errors.project = "Error occured";
            return res.status(500).json(errors);
          }

          //If everything went right, return project
          return res.json(project);
        });
    }
  },
  getProjects: (req, res) => {
    let errors = {};
    const userId = req.user._id;
    //Find all projects created by a certain user
    ProjectModel.find({
      $and: [{ createdBy: userId }, { team: null }, { archived: false }],
    })
      .populate("bugs")
      .exec(function (err, projects) {
        //If something went wrong when fetching projects, notify user
        if (err) {
          errors.project = "Error occured";
          console.error(err);
          return res.status(500).json(errors);
        }

        //If everything went well, return projects
        return res.json(projects);
      });
  },
  getProjectsForTeam: (req, res) => {
    let errors = [];
    const teamId = req.params.teamId;
    //Find all projects created by a certain user
    ProjectModel.find({
      $and: [{ team: teamId }, { archived: false }],
    })
      .select(" _id name archived")
      .exec(function (err, projects) {
        //If something went wrong when fetching projects, notify user
        if (err) {
          errors.push("Error occured when retrieving projects");
          console.error(err);
          return res.status(500).json(errors);
        }

        //If everything went well, return projects
        return res.json(projects);
      });
  },
  addLabel: (req, res) => {
    if (req.params.projectId) {
      if (req.body.label) {
        let messages = {};
        let errors = {};
        const projectId = req.params.projectId;
        ProjectModel.findById(projectId).exec(function (err, project) {
          //If error occured when fetching project, notfiy user
          if (err) {
            console.error(err);
            errors.project = "Error occured";
            return res.status(500).json(errors);
          }

          //Check to see if the label already exists
          const hasLabel = project.labels.some(
            (label) => label.name.toString() === req.body.label.name.toString()
          );

          //If it does, notfiy user
          if (hasLabel) {
            errors.label = "That label already exists";
            return res.status(400).json(errors);
          }

          console.log(req.body.label);

          //If everything went well continue
          const newLabels = [...project.labels, req.body.label];

          //Update Project with new labels
          ProjectModel.findByIdAndUpdate(projectId, { labels: newLabels }).exec(
            function (err, project) {
              //If error occured when updating project labels, notfiy user
              if (err) {
                console.error(err);
                errors.project = "Error occured";
                return res.status(500).json(errors);
              }

              //If everything went well, notify user,
              messages.project = "Label successfully added";
              return res.json(messages);
            }
          );
        });
      } else {
        let errors = {};
        errors.project = "Opps! Something went wrong";
        return res.status(400).json(errors);
      }
    } else {
      let errors = {};
      errors.project = "Opps! Something went wrong";
      return res.status(400).json(errors);
    }
  },
  deleteLabel: (req, res) => {
    if (req.params.projectId) {
      if (req.params.labelId) {
        let errors = {};
        let messages = {};
        const projectId = req.params.projectId;
        const labelId = req.params.labelId;
        ProjectModel.findById(projectId).exec(function (err, project) {
          //If error occured when fetching project, notfiy user
          if (err) {
            console.error(err);
            errors.project = "Error occured";
            return res.status(500).json(errors);
          }

          //If everything went well, remove label
          const newLabels = project.labels.filter(
            (label) => label._id.toString() !== labelId.toString()
          );

          ProjectModel.findByIdAndUpdate(projectId, { labels: newLabels }).exec(
            function (err, project) {
              //If error occured when updating project labels, notfiy user
              if (err) {
                console.error(err);
                errors.project = "Error occured when updating project labels";
                return res.status(500).json(errors);
              }

              //If everything went well, notify user
              messages.project = "Label successfully removed";
              return res.json(messages);
            }
          );
        });
      } else {
        let errors = {};
        errors.project = "Opps! Something went wrong";
        return res.status(400).json(errors);
      }
    } else {
      let errors = {};
      errors.project = "Opps! Something went wrong";
      return res.status(400).json(errors);
    }
  },
  editLabel: (req, res) => {
    if (req.params.projectId) {
      if (req.params.labelId) {
        let errors = {};
        let messages = {};
        const projectId = req.params.projectId;
        const labelId = req.params.labelId;
        ProjectModel.findById(projectId).exec(function (err, project) {
          //If error occured when fetching project, notfiy user
          if (err) {
            console.error(err);
            errors.project = "Error occured when fetching project";
            return res.status(500).json(errors);
          }

          //If everything went well, remove label
          var label = project.labels.find(
            (label) => label._id.toString() === labelId.toString()
          );

          var newLabelsArray = project.labels.filter(
            (label) => label._id.toString() !== labelId.toString()
          );

          label.name = req.body.label.name;
          label.color = req.body.label.color;

          newLabelsArray = [...newLabelsArray, label];

          ProjectModel.findByIdAndUpdate(projectId, {
            labels: newLabelsArray,
          }).exec(function (err, project) {
            //If error occured when updating project labels, notfiy user
            if (err) {
              console.error(err);
              errors.project = "Error occured when updating project labels";
              return res.status(500).json(errors);
            }

            //If everything went well, notify user
            messages.project = "Label successfully updated";
            return res.json(messages);
          });
        });
      } else {
        let errors = {};
        errors.project = "Opps! Something went wrong";
        return res.status(400).json(errors);
      }
    } else {
      let errors = {};
      errors.project = "Opps! Something went wrong";
      return res.status(400).json(errors);
    }
  },
  addToArchive: (req, res) => {
    if (req.params.projectId) {
      let errors = {};
      let messages = {};
      const projectId = req.params.projectId;

      //Everything went well, add project to archive
      ProjectModel.findByIdAndUpdate(projectId, { archived: true }).exec(
        function (err, project) {
          //Error occrued? Notify User
          if (err) {
            errors.project = "Error occured";
            return res.status(500).json(errors);
          }

          //Everything went well, notify user
          messages.project = "Project successfully archived";
          return res.json(messages);
        }
      );
    } else {
      let errors = {};
      errors.project = "Error occured";
      return res.status(400).json(errors);
    }
  },
  removeFromArchive: (req, res) => {
    if (req.params.projectId) {
      let errors = {};
      let messages = {};
      const projectId = req.params.projectId;

      //Everything went well, remove project from archive
      ProjectModel.findByIdAndUpdate(projectId, { archived: false }).exec(
        function (err, project) {
          //Error occrued? Notify User
          if (err) {
            errors.project = "Error occured";
            return res.status(500).json(errors);
          }

          //Everything went well, notify user
          messages.project = "Project successfully removed from archived";
          return res.json(messages);
        }
      );
    } else {
      let errors = {};
      errors.project = "Error occured";
      return res.status(400).json(errors);
    }
  },
  getArchivedProjects: (req, res) => {
    let errors = {};
    const userId = req.user._id;
    //Find all projects created by a certain user
    ProjectModel.find({
      $and: [{ createdBy: userId }, { team: null }, { archived: true }],
    })
      .populate("bugs")
      .exec(function (err, projects) {
        //If something went wrong when fetching projects, notify user
        if (err) {
          errors.project = "Error occured";
          console.error(err);
          return res.status(500).json(errors);
        }

        //If everything went well, return projects
        return res.json(projects);
      });
  },
};
