const { default: mongoose } = require("mongoose");
const DepartmentsModel = require("../models/Departments.model");
const GroupsSchema = require("../models/Groups.model");
const UsersModel = require("../models/Users.model");

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await GroupsSchema.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  const { id } = req.params;
  try {
    const group = await GroupsSchema.findById(id);
    if (group) {
      res.status(200).json(group);
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGroup = async (req, res) => {
  // check if department exists and if user exists when input provided
  const { class_presenter } = req.body;

  const department = await DepartmentsModel.findById(
    mongoose.Types.ObjectId(req.body.department)
  );
  if (!department) {
    return res.status(404).json({
      message: "Department not found",
    });
  }
  if (class_presenter) {
    const user = await UsersModel.findById(
      mongoose.Types.ObjectId(req.body.class_presenter)
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // check if no other group has the same class presenter
    const group = await GroupsSchema.findOne({ class_presenter });
    if (group) {
      return res.status(400).json({
        message: "User already has a group",
      });
    }
  }

  const group = { ...req.body, group_name: req.body.group_name.toLowerCase() };
  const newGroup = new GroupsSchema(group);
  try {
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.modifyGroupInfo = async (req, res) => {};

exports.removeGroup = async (req, res) => {};

exports.modifyGroupDepartment = async (req, res) => {};

exports.getGroupByDepartment = async (req, res) => {};

exports.getGroupBySize = async (req, res) => {};

exports.getGroupByYear = async (req, res) => {};

exports.searchGroupByKeyword = async (req, res) => {};
