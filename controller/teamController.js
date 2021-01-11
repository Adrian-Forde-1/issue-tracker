const TeamModel = require("../models/TeamModel");
const UserModel = require("../models/UserModel");
const ProjectModel = require("../models/ProjectModel");

module.exports = {
  //Create Team
  createTeam: async (req, res) => {
    if (req.body.team) {
      let messages = [];
      let errors = [];
      //Get name and password from body
      const { name, password } = req.body.team;

      //Create a new team using team model
      const newTeam = new TeamModel({
        name,
        password,
        users: [req.user._id],
        createdBy: req.user._id,
      });

      //Save team in database
      await newTeam
        .save()
        .then(async (team) => {
          //Add the team to the list of teams the user is in ( adding it by its id )
          let newTeams = [...req.user.teams, team._id];
          await UserModel.findByIdAndUpdate(req.user._id, {
            teams: newTeams,
          }).exec(function (err, user) {
            //Error occured? Notify user
            if (err) {
              console.error(err);
              errors.push("Error occured");
              return res.status(500).json(errors);
            }

            //Return a message if the team was successfully saved
            messages.push("User successfully added to team");
          });
          messages.push("Team successfully created");
          return res.json(messages);
        })
        .catch((err) => {
          //Return an error if the team was not successfullt saved
          errors.push("Error occured");
          console.error(err);
          return res.status(500).json(errors);
        });
    }
  },
  //Leave Team
  leaveTeam: (req, res) => {
    if (req.params.teamId) {
      let messages = [];
      let errors = [];
      const teamId = req.params.teamId;

      TeamModel.findById(teamId).exec(function (err, team) {
        //If an error occured when fetching team, return it
        if (err) {
          console.error(err);
          errors.push("Opps! Something went wrong");
          return res.status(500).json(errors);
        }
        if (team.createdBy.toString() !== req.user._id.toString()) {
          //Get all the users in the team and filter out the one that left
          var users = team.users;
          users = users.filter(
            (user) => user.toString() !== req.user._id.toString()
          );

          //Update the team with the new user data
          TeamModel.findByIdAndUpdate(teamId, { users: users }).exec(function (
            err,
            team
          ) {
            //Error occured? Notify User
            if (err) {
              console.error(err);
              let errors = [];
              errors.push("Error occured");
              return res.status(500).json(errors);
            }

            //Get all the teams that the user is in and filter out the one the user left
            var teams = req.user.teams;
            teams = teams.filter(
              (team) => team.toString() !== teamId.toString()
            );

            //Update the user with the new teams
            UserModel.findByIdAndUpdate(req.user._id, {
              teams: teams,
            }).exec(function (err, user) {
              //If an error occured, notify the user
              if (err) {
                console.error(err);
                errors.push("Error occured");
                return res.status(500).json(errors);
              }

              //If everything went well, return a message to notify the user
              messages.push("Successfully left team");
              return res.json(messages);
            });
          });
        } else {
          let errors = [];
          errors.push(
            "You cannot leave this team because you are the Admin. Try deleting it instead"
          );
          return res.status(400).json(errors);
        }
      });
    }
  },
  //Join Team
  joinTeam: async (req, res) => {
    if (req.body.team) {
      let messages = [];
      let errors = [];
      //Get the variables entered by the user
      const { teamId, password } = req.body.team;

      //Search for the team in database
      const team = await TeamModel.findById(teamId);

      //If the team was not found, notify user
      if (team === null) {
        errors.push("Team not found");
        return res.status(404).json(errors);
      }

      //Check to see if the password entered by the user matches the team's password
      const isMatch = await team.isValidPassword(password);

      //If the passwords don't match, notify user
      if (!isMatch) {
        errors.push("Incorrect password");
        return res.status(401).json(errors);
      }

      var inTeam = req.user.teams.some(
        (team) => team.toString() === teamId.toString()
      );

      if (inTeam) {
        errors.push("You are already part of this team");
        return res.status(401).json(errors);
      }

      //If everything went ok, add user to team
      const newUsersInTeam = [...team.users, req.user._id];

      //Update team with new users
      TeamModel.findByIdAndUpdate(teamId, { users: newUsersInTeam }).exec(
        function (err, team) {
          //If an error occured while updating team with new user, notify user
          if (err) {
            console.error(err);
            errors.push("Error occured");
            return res.status(500).json(errors);
          }

          //Add the new team to the list of teams the user is in
          const newListOfTeams = [...req.user.teams, team._id];
          UserModel.findByIdAndUpdate(req.user._id, {
            teams: newListOfTeams,
          }).exec(function (err, user) {
            //If something went wrong when updating user with new team list, notify user
            if (err) {
              console.error(err);
              errors.push("Error occured when updating user with new teams");
              return res.status(500).json(errors);
            }

            messages.push("Joined team successfully");
            return res.json(messages);
          });
        }
      );
    } else {
      let errors = [];
      errors.push("Opps! Something went wrong");
      return res.status(400).json(errors);
    }
  },
  //Delete Team
  deleteTeam: (req, res) => {
    //Check to see if the teamId was included in the request params
    if (req.params.teamId) {
      let messages = [];
      let errors = [];
      const teamId = req.params.teamId;
      TeamModel.findByIdAndDelete(teamId).exec(async function (err, team) {
        if (err) {
          console.error(err);
          errors.push("Error occured when leaving team");
          return res.status(500).jsno(errors);
        }

        //Get all users that are in this team
        await UserModel.find({ teams: team._id }).exec(function (err, users) {
          //If an error occurs, return an error string
          if (err) {
            console.error(err);
            let errors = [];
            errors.push(
              "Error occured when getting all users that are in the team"
            );
            return res.status(500).json(errors);
          }
          //Loop through all the users returns from query
          users.forEach((user) => {
            //For each user, filter the team out of the teams that the user is in
            var newTeams = user.teams.filter(
              (team) => team.toString() !== teamId.toString()
            );
            UserModel.findByIdAndUpdate(
              user._id,
              { teams: newTeams },
              (err, user) => {
                //If there was an error when updating the user teams, return an error string
                if (err) {
                  console.error(err);
                  let errors = [];
                  errors.project = "Error occured when removing team from user";
                  return res.status(500).json(errors);
                }
                //If everything went well, return the user
                return user;
              }
            );
          });
        });

        //Get all projects that are in this team
        team.projects.forEach((project) => {
          ProjectModel.findByIdAndDelete(project).exec(function (err, project) {
            //Error occured, notify user
            if (err) {
              console.error(err);
              let errors = [];
              errors.push("Error occured when removing project from team");
              return res.status(500).json(errors);
            }
          });
        });

        //When everything is done, return a message to inform the user
        messages.push("Team successfully deleted");
        return res.json(messages);
      });
    }
  },
  getProjectsFromTeam: (req, res) => {
    if (req.params.teamId) {
      const teamId = req.params.teamId;
      //Get all the projects in a certain team by checking the g
      TeamModel.findById(teamId)
        .populate("projects")
        .exec(function (err, team) {
          //If error occured, notify user
          if (err) {
            console.error(err);
            let errors = [];
            errors.push("Error occured when fetching team");
            return res.status(500).json(errors);
          }

          return res.json(team.projects);
        });
    } else {
      let errors = [];
      errors.push("Opps! Something went wrong");
      return res.status(400).json(errors);
    }
  },
  getTeam: (req, res) => {
    if (req.params.teamId) {
      let errors = [];
      const teamId = req.params.teamId;
      TeamModel.findById(teamId)
        .populate("projects")
        .populate("users")
        .exec(function (err, team) {
          //If something went wrong when fetching team, notify user
          if (err) {
            console.error(err);
            errors.push("Error occured");
            return res.status(500).json(errors);
          }

          let belongsToTeam = team.users.findIndex(
            (user) => user._id.toString() === req.user._id.toString()
          );

          if (belongsToTeam === -1) return res.sendStatus(404);

          //If everything went well, return team
          return res.json(team);
        });
    }
  },
  getTeams: (req, res) => {
    let errors = [];
    const userId = req.user._id;

    TeamModel.find({ users: { $elemMatch: { $eq: userId } } })
      .sort("name")
      .select("name createdBy _id")
      .exec(function (err, teams) {
        //If error occured when fetching teams, notify user
        if (err) {
          console.error(err);
          errors.push("Error occured when fetching teams");
          return res.status(500).json(teams);
        }

        //If everything went well, return teams
        return res.json(teams);
      });
  },
  getArchivedTeamProjects: (req, res) => {
    if (req.params.teamId) {
      let errors = [];
      const teamId = req.params.teamId;

      TeamModel.findById(teamId)
        .populate("projects")
        .exec(function (err, team) {
          //Error occured? Notify User
          if (err) {
            errors.push("Error Occured");
            return res.status(500).json(errors);
          }

          //Everything went well? Continue
          const archivedProjects = team.projects.filter(
            (project) => project.archived === true
          );

          return res.json(archivedProjects);
        });
    } else {
      let errors = [];
      errors.push("Error occured");
      return res.status(400).json(errors);
    }
  },
};
