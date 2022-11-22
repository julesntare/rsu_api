const mongoose = require("mongoose");
const RoleModel = require("../models/Roles.model");

exports.getAllRoles = async (_req, res) => {
  RoleModel.find({
    status: "active",
  })
    .then((role) => res.status(200).json(role))
    .catch((err) =>
      res.status(404).json({ message: "No Role not found", error: err.message })
    );
};

exports.getRoleById = async (req, res) => {
  RoleModel.findById(mongoose.Types.ObjectId(req.params.id))
    .then((role) => res.status(200).json(role))
    .catch((err) =>
      res.status(404).json({ message: "Role not found", error: err.message })
    );
};

exports.createRole = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Role content can not be empty",
    });
  }

  const newRole = new RoleModel({
    role_name: req.body.role_name,
    role_description: req.body.role_description,
    added_on: Date.now(),
    status: req.body.status,
  });

  newRole
    .save()
    .then((role) => res.status(201).json(role))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid role object", error: err.message })
    );
};

exports.removeRole = async (req, res) => {
  RoleModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    status: "inactive",
  })
    .then((_response) =>
      res.status(204).json({ result: "success", message: "Role removed" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid role object", error: err.message })
    );
};

exports.updateRole = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Role content can not be empty",
    });
  }

  RoleModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    role_name: req.body.role_name,
    role_description: req.body.role_description,
    status: req.body.status,
  })
    .then((role) => res.status(200).json(role))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid role object", error: err.message })
    );
};
