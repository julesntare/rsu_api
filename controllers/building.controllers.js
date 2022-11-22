const mongoose = require("mongoose");
const BuildingModel = require("../models/Buildings.model");

exports.getAllBuildings = async (_req, res) => {
  BuildingModel.find({
    status: "active",
  })
    .then((building) => res.json(building))
    .catch((err) =>
      res
        .status(404)
        .json({ message: "No Building not found", error: err.message })
    );
};

exports.getBuildingById = async (req, res) => {
  BuildingModel.findById(mongoose.Types.ObjectId(req.params.id))
    .then((building) => res.json(building))
    .catch((err) =>
      res
        .status(404)
        .json({ message: "Building not found", error: err.message })
    );
};

exports.createBuilding = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Building content can not be empty",
    });
  }
  
  const newBuilding = new BuildingModel({
    building_name: req.body.building_name,
    building_description: req.body.building_description,
    coordinates: req.body.coordinates,
    near_locations: req.body.near_locations,
    added_on: Date.now(),
    status: req.body.status,
  });
  
  newBuilding
    .save()
    .then((building) => res.json(building))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid building object", error: err.message })
    );
};

exports.removeBuilding = async (req, res) => {
  BuildingModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    status: "inactive",
  })
    .then((_response) =>
      res.status(204).json({ result: "success", message: "Building removed" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid building object", error: err.message })
    );
};

exports.modifyBuilding = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "At least one field must be provided",
    });
  }

  BuildingModel.updateOne(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    {
      $set: {...req.body},
    }
  )
    .then((_response) =>
      res.status(200).json({ result: "success", message: "Building modified" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid building object", error: err.message })
    );
};
