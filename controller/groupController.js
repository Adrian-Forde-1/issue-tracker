const GroupModel = require('../models/GroupModel');
const UserModel = require('../models/UserModel');
const ProjectModel = require('../models/ProjectModel');

module.exports = {
  //Create Group
  createGroup: async (req, res) => {
    if (req.body.group) {
      let messages = {};
      let errors = {};
      //Get name and password from body
      const { name, password } = req.body.group;

      //Create a new group using group model
      const newGroup = new GroupModel({
        name,
        password,
        users: [req.user._id],
        createdBy: req.user._id,
      });

      //Save group in database
      await newGroup
        .save()
        .then(async (group) => {
          //Add the group to the list of groups the user is in ( adding it by its id )
          let newGroups = [...req.user.groups, group._id];
          await UserModel.findByIdAndUpdate(req.user._id, {
            groups: newGroups,
          }).exec(function (err, user) {
            //Error occured? Notify user
            if (err) {
              console.error(err);
              errors.user = 'Error occured when adding user to group';
              return res.status(500).json(errors);
            }

            //Return a message if the group was successfully saved
            messages.user = 'User successfully added to group';
          });
          messages.group = 'Group successfully created';
          return res.json(messages);
        })
        .catch((err) => {
          //Return an error if the group was not successfullt saved
          errors.group = 'Error occured when creating group';
          console.error(err);
          return res.status(500).json(errors);
        });
    }
  },
  //Leave Group
  leaveGroup: (req, res) => {
    if (req.params.groupId) {
      let messages = {};
      let errors = {};
      const groupId = req.params.groupId;

      GroupModel.findById(groupId).exec(function (err, group) {
        //If an error occured when fetching group, return it
        if (err) {
          console.error(err);
          errors.group = 'Opps! Something went wrong';
          return res.status(500).json(errors);
        }
        if (group.createdBy.toString() !== req.user._id.toString()) {
          //Get all the users in the group and filter out the one that left
          var users = group.users;
          users = users.filter(
            (user) => user.toString() !== req.user._id.toString()
          );

          //Update the group with the new user data
          GroupModel.findByIdAndUpdate(groupId, { users: users }).exec(
            function (err, group) {
              //Error occured? Notify User
              if (err) {
                console.error(err);
                let errors = {};
                errors.group =
                  'Something went wrong when updating group information';
                return res.status(500).json(errors);
              }

              //Get all the groups that the user is in and filter out the one the user left
              var groups = req.user.groups;
              groups = groups.filter(
                (group) => group.toString() !== groupId.toString()
              );

              //Update the user with the new groups
              UserModel.findByIdAndUpdate(req.user._id, {
                groups: groups,
              }).exec(function (err, user) {
                //If an error occured, notify the user
                if (err) {
                  console.error(err);
                  errors.group = 'Error occured when leaving group';
                  return res.status(500).json(errors);
                }

                //If everything went well, return a message to notify the user
                messages.group = 'Successfully left group';
                return res.json(messages);
              });
            }
          );
        } else {
          let errors = {};
          errors.group =
            'You cannot leave this group because you are the Admin. Try deleting it instead';
          return res.status(400).json(errors);
        }
      });
    }
  },
  //Join Group
  joinGroup: async (req, res) => {
    if (req.body.group) {
      let messages = {};
      let errors = {};
      //Get the variables entered by the user
      const { groupId, password } = req.body.group;

      console.log(
        '|||||||||||||||||||||||||||||||| JOIN GROUP |||||||||||||||||||||||'
      );
      console.log(groupId);
      console.log(password);

      //Search for the group in database
      const group = await GroupModel.findById(groupId);

      //If the group was not found, notify user
      if (group === null) {
        errors.group = 'Group not found';
        return res.status(404).json(errors);
      }

      //Check to see if the password entered by the user matches the group's password
      const isMatch = group.isValidPassword(password);

      console.log(isMatch);

      //If the passwords don't match, notify user
      if (!isMatch) {
        errors.group = 'Incorrect password';
        return res.status(401).json(group);
      }

      //If everything went ok, add user to group
      const newUsersInGroup = [...group.users, req.user._id];

      //Update group with new users
      GroupModel.findByIdAndUpdate(groupId, { users: newUsersInGroup }).exec(
        function (err, group) {
          //If an error occured while updating group with new user, notify user
          if (err) {
            console.error(err);
            errors.group = 'Error occured when adding user to group';
            return res.status(500).json(errors);
          }

          //Add the new group to the list of groups the user is in
          const newListOfGroups = [...req.user.groups, group._id];
          UserModel.findByIdAndUpdate(req.user._id, {
            groups: newListOfGroups,
          }).exec(function (err, user) {
            //If something went wrong when updating user with new group list, notify user
            if (err) {
              console.error(err);
              errors.user = 'Error occured when updating user with new groups';
              return res.status(500).json(errors);
            }

            messages.group = 'Joined group successfully';
            return res.json(messages);
          });
        }
      );
    } else {
      let errors = {};
      errors.group = 'Opps! Something went wrong';
      return res.status(400).json(errors);
    }
  },
  //Delete Group
  deleteGroup: (req, res) => {
    //Check to see if the groupId was included in the request params
    if (req.params.groupId) {
      let messages = {};
      let errors = {};
      const groupId = req.params.groupId;
      GroupModel.findByIdAndDelete(groupId).exec(async function (err, group) {
        if (err) {
          console.error(err);
          errors.group = 'Error occured when leaving group';
          return res.status(500).jsno(errors);
        }

        //Get all users that are in this group
        await UserModel.find({ groups: group._id }).exec(function (err, users) {
          //If an error occurs, return an error string
          if (err) {
            console.error(err);
            let errors = {};
            errors.user =
              'Error occured when getting all users that are in the group';
            return res.status(500).json(errors);
          }
          //Loop through all the users returns from query
          users.forEach((user) => {
            //For each user, filter the group out of the groups that the user is in
            var newGroups = user.groups.filter(
              (group) => group.toString() !== groupId.toString()
            );
            UserModel.findByIdAndUpdate(
              user._id,
              { groups: newGroups },
              (err, user) => {
                //If there was an error when updating the user groups, return an error string
                if (err) {
                  console.error(err);
                  let errors = {};
                  errors.project =
                    'Error occured when removing group from user';
                  return res.status(500).json(errors);
                }
                //If everything went well, return the user
                return user;
              }
            );
          });
        });

        //Get all projects that are in this group
        group.projects.forEach((project) => {
          ProjectModel.findByIdAndDelete(project).exec(function (err, project) {
            //Error occured, notify user
            if (err) {
              console.error(err);
              let errors = {};
              errors.user = 'Error occured when removing project from group';
              return res.status(500).json(errors);
            }
          });
        });

        //When everything is done, return a message to inform the user
        messages.group = 'Group successfully deleted';
        return res.json(messages);
      });
    }
  },
  getProjectsFromGroup: (req, res) => {
    if (req.params.groupId) {
      const groupId = req.params.groupId;
      //Get all the projects in a certain group by checking the g
      GroupModel.findById(groupId)
        .populate('projects')
        .exec(function (err, group) {
          //If error occured, notify user
          if (err) {
            console.error(err);
            let errors = {};
            errors.group = 'Error occured when fetching group';
            return res.status(500).json(errors);
          }

          return res.json(group.projects);
        });
    } else {
      let errors = {};
      errors.project = 'Opps! Something went wrong';
      return res.status(400).json(errors);
    }
  },
  getGroup: (req, res) => {
    if (req.params.groupId) {
      let errors = {};
      const groupId = req.params.groupId;
      GroupModel.findById(groupId)
        .populate('projects')
        .populate('users')
        .exec(function (err, group) {
          //If something went wrong when fetching group, notify user
          if (err) {
            console.error(err);
            errors.group = 'Error occured';
            return res.status(500).json(errors);
          }

          //If everything went well, return group
          return res.json(group);
        });
    }
  },
  getGroups: (req, res) => {
    let errors = {};
    const userId = req.user._id;

    GroupModel.find({ users: { $elemMatch: { $eq: userId } } })
      .populate('projects')
      .exec(function (err, groups) {
        //If error occured when fetching groups, notify user
        if (err) {
          console.error(err);
          errors.groups = 'Error occured when fetching groups';
          return res.status(500).json(groups);
        }

        //If everything went well, return groups
        return res.json(groups);
      });
  },
  getArchivedGroupProjects: (req, res) => {
    if (req.params.groupId) {
      let errors = {};
      const groupId = req.params.groupId;

      GroupModel.findById(groupId)
        .populate('projects')
        .exec(function (err, group) {
          //Error occured? Notify User
          if (err) {
            errors.group = 'Error Occured';
            return res.status(500).json(errors);
          }

          //Everything went well? Continue
          const archivedProjects = group.projects.filter(
            (project) => project.archived === true
          );

          return res.json(archivedProjects);
        });
    } else {
      let errors = {};
      errors.group = 'Error occured';
      return res.status(400).json(errors);
    }
  },
};
