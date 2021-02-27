const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

teamSchema.pre("save", async function (next) {
  try {
    //Generate a bcrypt salt
    const salt = await bcrypt.genSalt(10);

    //Hash the current password
    const hashedPassword = await bcrypt.hash(this.password, salt);

    //Assign the current password to the hashed password
    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

teamSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

const TeamModel = mongoose.model("team", teamSchema);

module.exports = TeamModel;
