const mongoose = require("mongoose");
const BuildingModel = require("../models/Buildings.model");
const RoomsModel = require("../models/Rooms.model");

exports.getAllBuildings = async (_req, res) => {
  BuildingModel.find({
    status: "active",
  })
    .sort({ added_on: -1 })
    .then(async (building) => {
      const rooms = await RoomsModel.find({
        status: "active",
      });

      // map to get the number of rooms per building
      const roomsPerBuilding = building.map((building) => {
        const roomsInBuilding = rooms.filter(
          (room) => room.room_building.toString() === building._id.toString()
        );

        return {
          ...building._doc,
          no_of_rooms: roomsInBuilding.length,
        };
      });

      res.json(roomsPerBuilding);
    })
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
      statusCode: 400,
    });
  }

  const newBuilding = new BuildingModel({
    building_name: req.body.building_name,
    building_description: req.body.building_description,
    floors: req.body.floors,
    coordinates: req.body.coordinates,
    near_locations: req.body.near_locations,
    added_on: Date.now(),
    status: req.body.status,
  });

  newBuilding
    .save()
    .then((_building) =>
      res
        .status(201)
        .json({ message: "Building added successfully", statusCode: 201 })
    )
    .catch((err) =>
      res.status(400).json({
        message: "Invalid building object",
        statusCode: 400,
        error: err.message,
      })
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
      $set: { ...req.body },
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
