const mongoose = require("mongoose");
const UsersModel = require("../models/Users.model");
const sessionsModel = require("../models/Sessions.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RolesModel = require("../models/Roles.model");

// express, jwt and mongoose user authentication
const { RSU_SECRET } = process.env;

// Signup controller
exports.register = async (req, res) => {
  try {
    // check if user already exists
    const user = await UsersModel.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ message: "User already exists", statusCode: 400 });
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // create new user
    const newUser = new UsersModel({
      _id: new mongoose.Types.ObjectId(),
      fullname: req.body.fullname,
      title: req.body.title,
      email: req.body.email,
      mobile_no: req.body.mobile_no,
      password: hashedPassword,
      user_role: req.body.user_role,
    });
    // save user and return response
    const userResult = await newUser.save();
    res.status(201).json({ message: "User created successfully", userResult, statusCode: 201 });
  } catch (error) {
    res.status(500).json({ message: error.message, statusCode: 500 });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    // find user
    const user = await UsersModel.findOne({ email: req.body.email});
    // if user not found
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    // if user found
    // compare password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    // if password not matched
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid credentials" });
    }
    // if password matched
    // create a token
    const token = jwt.sign({ user: user._id, userRole: user.user_role }, RSU_SECRET, { expiresIn: "7 days" });

    // create a new session
    await sessionsModel.create({ user_id: user._id, session_token: token });

    // get role name from rolesModel by id
    const role = await RolesModel.findById(user.user_role);

    // send token as response
    res.status(200).json({
      status: 200,
      message: "Logged in successful",
      data: {
        fullname: user.fullname,
        title: user.title,
        email: user.email,
        mobile_no: user.mobile_no,
        user_role: role.role_name,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Logout controller
exports.logout = async (req, res) => {
  try {
    // delete session
    await sessionsModel.deleteOne({ session_token: req.body.token });
    // send response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
