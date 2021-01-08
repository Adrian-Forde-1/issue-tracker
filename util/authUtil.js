const JWT = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

exports.validateSignUpData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email";
  }

  if (isEmpty(data.password)) errors.password = "Must not be empty";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match";
  if (isEmpty(data.username)) errors.username = "Must not be empty";

  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";

  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

const signToken = (user) => {
  return JWT.sign({ data: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

exports.generateRefreshToken = (user) => {
  return JWT.sign({ data: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

exports.verifyToken = (token, user) => {
  let accessToken;
  JWT.verify(token, process.env.REFRESH_TOKEN_SECRET, (err) => {
    if (err) return resizeBy.sendStatus(403);
    accessToken = signToken(user);
  });
  return accessToken;
};

exports.decodeToken = (token) => {
  return JWT.decode(token);
};

exports.signToken = signToken;
