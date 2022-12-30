const GroupsSchema = require("../models/Groups.model");

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
        }
        else {
            res.status(404).json({ message: "Group not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createGroup = async (req, res) => {
    const group = req.body;
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