const ModulesModel = require("../models/Modules.model");
const DepartmentsModel = require("../models/Departments.model");
const { default: mongoose } = require("mongoose");

exports.getAllModules = async (req, res) => {
  try {
    const modules = await ModulesModel.find({});
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createModule = async (req, res) => {
  try {
    const module = await ModulesModel.create({
      ...req.body,
      module_name: req.body.module_name.toLowerCase(),
    });
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getModuleById = async (req, res) => {
  ModulesModel.findById(mongoose.Types.ObjectId(req.params.id))
    .then((module) => res.status(200).json(module))
    .catch((err) =>
      res.status(404).json({ message: "Module not found", error: err.message })
    );
};

exports.updateModule = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Module content can not be empty",
    });
  }

  ModulesModel.findByIdAndUpdate(
    mongoose.Types.ObjectId(req.params.id),
    req.body
  )
    .then((module) => res.status(200).json(module))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid module object", error: err.message })
    );
};

exports.changeModuleStatus = async (req, res) => {
  ModulesModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    status: req.body.status,
  })
    .then((module) => res.status(200).json(module))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid module object", error: err.message })
    );
};

exports.changeModuleDepartment = async (req, res) => {
  ModulesModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    department: req.body.department,
  })
    .then((module) => res.status(200).json(module))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid module object", error: err.message })
    );
};

exports.removeModule = async (req, res) => {
  ModulesModel.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id))
    .then((module) => res.status(200).json(module))
    .catch((err) =>
      res.status(404).json({ message: "Module not found", error: err.message })
    );
};
