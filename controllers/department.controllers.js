const mongoose = require("mongoose");
const DepartmentsModel = require("../models/Departments.model");
const DepartmentModel = require("../models/Departments.model");
const UsersModel = require("../models/Users.model");

exports.getAllDepartments = async (_req, res) => {
  DepartmentModel.find({
    status: "active",
  })
    .then((department) => res.status(200).json(department))
    .catch((err) =>
      res
        .status(404)
        .json({ message: "No Department not found", error: err.message })
    );
};

exports.getDepartmentById = async (req, res) => {
  DepartmentModel.findById(mongoose.Types.ObjectId(req.params.id))
    .then((department) => res.status(200).json(department))
    .catch((err) =>
      res
        .status(404)
        .json({ message: "Department not found", error: err.message })
    );
};

exports.updateDepartment = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Department content can not be empty",
    });
  }

  DepartmentModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    name: req.body.name,
    status: req.body.status,
  })
    .then((department) => res.status(200).json(department))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid department object", error: err.message })
    );
};

exports.changeDepartmentStatus = async (req, res) => {
  DepartmentModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    status: req.body.status,
  })
    .then((_response) =>
      res
        .status(204)
        .json({ result: "success", message: "Department status updated" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid department object", error: err.message })
    );
};

exports.createDepartment = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Department content can not be empty",
    });
  }

  // check if department already exists
  const departmentExists = await DepartmentsModel.findOne({
    department_name: req.body.department_name,
  });
  if (departmentExists) {
    return res.status(400).json({
      message: "Department already exists",
    });
  }

  // check if department head exists in users
  const departmentHeadExists = await UsersModel.findOne({
    _id: req.body.department_head.toLowerCase(),
  });
  if (!departmentHeadExists) {
    return res.status(400).json({
      message: "Department head does not exist",
    });
  }

  const department = new DepartmentModel({
    department_name: req.body.department_name.toLowerCase(),
    department_description: req.body.department_description,
    department_head: req.body.department_head,
    office_location: req.body.office_location,
    near_locations: req.body.near_locations,
  });

  department
    .save()
    .then((data) => res.status(201).json(data))
    .catch((err) =>
      res.status(400).json({ message: "Invalid department object", error: err })
    );
};

exports.removeDepartment = async (req, res) => {
  DepartmentModel.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id))
    .then((_response) =>
      res.status(204).json({ result: "success", message: "Department removed" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid department object", error: err.message })
    );
};

exports.changeDepartmentHead = async (req, res) => {
  DepartmentModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    department_head: req.body.department_head,
  })
    .then((_response) =>
      res
        .status(204)
        .json({ result: "success", message: "Department head updated" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid department object", error: err.message })
    );
};

exports.changeDepartmentOfficeCoordinates = async (req, res) => {
  let coordinates = [];
  coordinates.push({ latitude: req.body.lat, longitude: req.body.long });
  DepartmentModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    office_location: req.body.coordinates,
  })
    .then((_response) =>
      res
        .status(204)
        .json({ result: "success", message: "Office location updated" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid department object", error: err.message })
    );
};

exports.changeDepartmentNearLocations = async (req, res) => {
  DepartmentModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    near_locations: req.body.near_locations,
  })
    .then((_response) =>
      res
        .status(204)
        .json({ result: "success", message: "Near locations updated" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid department object", error: err.message })
    );
};
