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
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};

// verify user role
exports.verifyUserRole = async (req, res, next) => {
  try {
    // get user role from request
    const userRole = req.userData.userRole;

    // find by id
    const role = await RolesModel.findById({
      _id: mongoose.Types.ObjectId(userRole),
    }).catch((err) => {
      res.status(400).json({ message: "Invalid role id", error: err.message });
    });

    // get role tile of role retrieved
    const roleTitle = role.role_name;
    // check if user role is admin
    if (roleTitle !== "Admin" && roleTitle !== "AssetsM") {
      return res
        .status(401)
        .json({ message: "Not authorized to create a room" });
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
    const userRole = req.userData.userRole;
    // check if user role is admin
    if (userRole !== "Contributors") {
      return res.status(401).json({ message: "Auth failed" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};
