// add middleware functions
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const RolesModel = require("../models/Roles.model");
const { RSU_SECRET } = process.env;

// verify token
exports.verifyToken = async (req, res, next) => {
  try {
    // get token from request
    const token = req.headers.authorization.split(" ")[1];
    // verify token
    const decoded = jwt.verify(token, RSU_SECRET);
    // if token is valid
    req.userData = decoded;

    // find by id
    const role = await RolesModel.findById(req.userData.userRole);

    // get role tile of role retrieved
    const roleTitle = role.role_name;
    req.roleTitle = roleTitle;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Auth failed" });
  }
};

// verify user role
exports.verifyUserRole = async (req, res, next) => {
  try {
    const roleTitle = req.roleTitle;
    // check if user role is admin or assets manager
    if (roleTitle !== "Admin" && roleTitle !== "AssetsM") {
      return res.status(401).json({
        message: "Not authorized to alteration of rooms or buildings",
      });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};

// verify user role
exports.verifySchedulers = async (req, res, next) => {
  try {
    const roleTitle = req.roleTitle;
    // check if user role is admin or assets manager
    if (roleTitle !== "Admin" && roleTitle !== "Scheduler") {
      return res
        .status(401)
        .json({ message: "Not authorized to alteration of timetable" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};

// verify contributors role
exports.verifyUser = (req, res, next) => {
  try {
    // get user role from request
    const roleTitle = req.roleTitle;
    // check if user role is contributors, Scheduler, Admin or AssetsM
    if (
      roleTitle !== "Contributors" &&
      roleTitle !== "Scheduler" &&
      roleTitle !== "Admin" &&
      roleTitle !== "AssetsM"
    ) {
      return res.status(401).json({ message: "Auth failed" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};

exports.verifyAdmin = (req, res, next) => {
  try {
    // get user role from request
    const roleTitle = req.roleTitle;
    // check if user role is admin
    if (roleTitle !== "Admin") {
      return res.status(401).json({ message: "Auth failed" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};
