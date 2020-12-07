const { json } = require("express");
const multer = require("multer");
const User = require("../models/UserModel");
const path = require("path");

const { validateLoginData, validateSignUpData } = require("../util/authUtil");
const { signToken, decodeToken } = require("../util/authUtil");

const UserModel = require("../models/UserModel");

module.exports = {
  //Login User
  login: (req, res) => {
    // console.log('Login called');
    // // if (req.body.user) {
    //   //Create a user object
    //   const user = {
    //     email: req.body.user.email,
    //     password: req.body.user.password,
    //   };

    //   console.log(user);

    //   //Pass user object for validation and get the returned values
    // const { valid, errors } = validateLoginData(user);

    //   //Check to see if the data passed in was valid
    //   if (!valid) return res.status(400).json(errors);

    //Generate token
    const token = signToken(req.user);

    //Return the token as json
    res.json({ token });
    // }
  },

  //SignUp User
  signUp: async (req, res) => {
    //Check to see if the request has a body
    if (req.body.user) {
      let messages = [];
      //Destructor the variables from req.body
      const { username, email, password, confirmPassword } = req.body.user;

      //Create a user object
      const user = {
        username,
        email,
        password,
        confirmPassword,
      };

      //Pass user object for validation and get the returned values
      const { valid, errors } = validateSignUpData(user);

      //Check to see if the data passed in was valid
      if (!valid) return res.status(400).json(errors);

      //Check to see if the user already exists using email
      const foundUserByEmail = await UserModel.findOne({ email });

      //If the user already exists, return an error
      if (foundUserByEmail) {
        let errors = [];
        errors.push("Email is already registered");
        return res.status(403).json(errors);
      }

      //Check to see if the user already exists using usernmae
      const foundUserByUsername = await UserModel.findOne({ username });

      //If the user already exists, return an error
      if (foundUserByUsername) {
        let errors = [];
        errors.push("Username already exists");
        return res.status(403).json(errors);
      }

      //Create a new user from req.body
      const newUser = new UserModel({
        username,
        email,
        password,
      });

      //Save the new user in the database
      await newUser
        .save()
        .then(() => {
          //If user was saved successfully, notify user
          messages.push("Successfully signed up, try logging in.");
          return res.json(messages);
        })
        .catch(() => {
          //If something went wrong when saving user, notify user
          let errors = [];
          errors.push("Error occured when signing user up. Please try again");
          return res.status(500).json(errors);
        });

      // //Generate token
      // const token = signToken(newUser);

      // //Return the token as json
      // res.json({ token });
    }
  },

  //Delete User
  deleteUser: (req, res) => {
    if (req.user) {
      let messages = {};
      let errors = {};
      //Get user if from current user
      const userId = req.user._id;

      //Find user in database and delete them
      UserModel.findByIdAndDelete(userId).exec(function (err, user) {
        //If error occured, notify user
        if (err) {
          console.error(err);
          errors.user = "Error occured when attempting to delete user";
          return res.status(500).json(errors);
        }

        //If everything went well, notify user
        messages.user = "User successfully deleted";
        return res.json(messages);
      });
    }
  },
  getUser: (req, res) => {
    const token = req.headers.authorization;
    const splitToken = token.split("Bearer ")[1];
    //Decode token the was sent by user
    const decodedToken = decodeToken(splitToken);
    //Get user id from token sub
    const userId = decodedToken.sub;
    //Find user in databse
    UserModel.findById(userId)
      .populate("teams")
      .exec(function (err, user) {
        //If error occured, notify user
        let errors = {};
        if (err) {
          console.error(err);
          errors.user = "Error occured when fetching user data";
          return res.status(500).json(errors);
        }

        //If everything went well, return user
        return res.json(user);
      });
  },
  editProfile: (req, res) => {
    var errors = [];
    var messages = [];
    var file = req.file;

    const userID = req.user._id;

    User.findByIdAndUpdate(userID, {
      $set: {
        image: req.file.path,
      },
    }).exec(function (err, user) {
      if (err) {
        console.error(err);
        errors.push("Error occured when updating profile");
        return res.status(500).json(errors);
      }

      //If everything went right, notify user
      messages.push("Profile successfully updated");
      return res.json(messages);
    });
  },
};
